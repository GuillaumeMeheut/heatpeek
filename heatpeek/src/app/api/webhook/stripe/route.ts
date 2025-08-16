import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { getStripe } from "@/lib/stripe/init";
import { createServerSupabaseClientWithServiceRole } from "@/lib/supabase/server";

async function updateUserLimits(
  customerId: string,
  subscription: Stripe.Subscription
) {
  const stripe = getStripe();
  const supabase = createServerSupabaseClientWithServiceRole();

  // Find user by stripe_customer_id
  const { data: user, error: userError } = await supabase
    .from("user_profiles")
    .select("id")
    .eq("stripe_customer_id", customerId)
    .single();

  if (!user || userError) {
    console.error("User not found for customer:", customerId);
    return;
  }

  const item = subscription.items.data[0];
  const priceId = item.price.id;

  const price = await stripe.prices.retrieve(priceId, { expand: ["product"] });
  const product = price.product as Stripe.Product;

  const planName = product.name?.toLowerCase() || "unknown";

  const { error: updateError } = await supabase
    .from("user_profiles")
    .update({
      current_plan: planName,
      subscription_status: subscription.status,
      subscription_current_period_end: new Date(
        (subscription as Stripe.Subscription & { current_period_end: number })
          .current_period_end * 1000
      ),
      subscription_trial_end: subscription.trial_end
        ? new Date(subscription.trial_end * 1000)
        : null,
    })
    .eq("id", user.id);

  if (updateError) {
    console.error("Failed to update user plan limits:", updateError);
  }

  const { error: updateError2 } = await supabase
    .from("projects")
    .update({ is_active: true, usage_exceeded: false })
    .eq("user_id", user.id);

  if (updateError2) {
    console.error("Failed to update user projects:", updateError2);
  }
}

export async function POST(req: NextRequest) {
  const payload = await req.text();
  const signature = req.headers.get("stripe-signature")!;
  const stripe = getStripe();

  try {
    const event = stripe.webhooks.constructEvent(
      payload,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const customerId = session.customer;
        const userId = session.client_reference_id;

        if (userId && customerId) {
          const supabase = createServerSupabaseClientWithServiceRole();
          const { data: userProfile, error: fetchError } = await supabase
            .from("user_profiles")
            .select("stripe_customer_id")
            .eq("id", userId)
            .single();

          if (!fetchError && userProfile && !userProfile.stripe_customer_id) {
            const { error } = await supabase
              .from("user_profiles")
              .update({ stripe_customer_id: customerId })
              .eq("id", userId);

            if (error) {
              console.error(
                "Error updating user profile with customer ID:",
                error
              );
            }
          }
        }
        break;
      }

      case "customer.subscription.created":
      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        await updateUserLimits(subscription.customer as string, subscription);
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;

        const supabase = createServerSupabaseClientWithServiceRole();
        const { data: user, error: userError } = await supabase
          .from("user_profiles")
          .select("id")
          .eq("stripe_customer_id", customerId)
          .single();

        if (user && !userError) {
          const { error: updateError } = await supabase
            .from("user_profiles")
            .update({
              subscription_status: "canceled",
              subscription_current_period_end: null,
            })
            .eq("id", user.id);

          if (updateError) {
            console.error("Error updating user account:", updateError);
          }
        }

        break;
      }
    }

    return new NextResponse("Stripe webhook processed", { status: 200 });
  } catch (error) {
    console.error("Stripe webhook error:", error);
    return new NextResponse("Stripe webhook error", { status: 400 });
  }
}
