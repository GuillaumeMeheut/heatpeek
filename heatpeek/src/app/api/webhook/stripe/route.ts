import { StripeSync } from "@supabase/stripe-sync-engine";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createServerSupabaseClientWithServiceRole } from "@/lib/supabase/server";

const sync = new StripeSync({
  databaseUrl: process.env.DATABASE_URL!,
  stripeSecretKey: process.env.STRIPE_SECRET_KEY!,
  stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET!,
  backfillRelatedEntities: true,
  schema: "stripe",
});

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

function parseMetadata(metadata: Stripe.Metadata) {
  return {
    pageviews_limit: parseInt(metadata.pageviews_limit || "0"),
    max_websites: parseInt(metadata.max_websites || "0"),
    max_total_tracked_pages: parseInt(metadata.max_total_tracked_pages || "0"),
    data_retention_days: parseInt(metadata.data_retention_days || "0"),
  };
}

async function updateUserLimits(
  customerId: string,
  subscription: Stripe.Subscription
) {
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

  // Get price → product to access metadata
  const item = subscription.items.data[0];
  const priceId = item.price.id;

  const price = await stripe.prices.retrieve(priceId, { expand: ["product"] });
  const product = price.product as Stripe.Product;

  const limits = parseMetadata(product.metadata);
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
      ...limits,
    })
    .eq("id", user.id);

  if (updateError) {
    console.error("Failed to update user plan limits:", updateError);
  }
}

export async function POST(req: NextRequest) {
  const payload = await req.text();
  const signature = req.headers.get("stripe-signature")!;

  try {
    const event = stripe.webhooks.constructEvent(
      payload,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );

    // First, sync to Supabase
    try {
      await sync.processWebhook(payload, signature);
    } catch (syncError) {
      if (
        syncError instanceof Error &&
        syncError.message.includes("Unhandled webhook event")
      ) {
        // ignore silently
      } else {
        console.error("Stripe Sync error:", syncError);
        return new NextResponse("Stripe Sync error", { status: 400 });
      }
    }

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const customerId = session.customer;
        const userId = session.client_reference_id;

        console.log(userId, customerId);
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
          const { error: lockError } = await supabase
            .from("user_profiles")
            .update({
              is_locked: true,
              subscription_status: "canceled",
              subscription_current_period_end: null,
            })
            .eq("id", user.id);

          if (lockError) {
            console.error("Error locking user account:", lockError);
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
