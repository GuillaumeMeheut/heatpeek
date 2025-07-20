"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { checkoutSchema } from "./types";
import { getUser } from "@/lib/supabase/queries";
import { createClient } from "@/lib/supabase/server";
import { getStripe } from "@/lib/stripe/init";

export async function createCheckoutSession(formData: FormData) {
  const rawData = {
    userId: formData.get("userId"),
    customerId: formData.get("customerId"),
    userEmail: formData.get("userEmail"),
    priceId: formData.get("priceId"),
  };
  const result = checkoutSchema.safeParse(rawData);

  if (!result.success) {
    throw new Error(result.error.errors[0].message);
  }

  const { userId, userEmail, priceId, customerId } = result.data;

  const supabase = createClient();
  const { user } = await getUser(supabase);
  if (!user) {
    throw new Error("User not found");
  }
  if (user.id !== userId) {
    throw new Error("User ID mismatch");
  }

  const origin = (await headers()).get("origin");

  const isStarter =
    priceId === process.env.NEXT_PUBLIC_STARTER_MONTHLY_PRICE_ID;

  const stripe = getStripe();

  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    mode: "subscription",
    client_reference_id: userId,
    ...(customerId ? { customer: customerId } : { customer_email: userEmail }),
    ...(isStarter ? { subscription_data: { trial_period_days: 14 } } : {}),
    success_url: `${origin}/pricing?success=Successfully subscribed`,
    cancel_url: `${origin}/pricing?canceled=true`,
  });

  if (session.url) {
    redirect(session.url);
  }
  return { error: "Stripe session creation failed" };
}

export async function createCustomerPortalSession(formData: FormData) {
  const customerId = formData.get("customerId");
  if (!customerId || typeof customerId !== "string")
    throw new Error("Missing customerId");
  const origin = (await headers()).get("origin");
  const stripe = getStripe();
  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: `${origin}/pricing`,
  });
  if (session.url) {
    redirect(session.url);
  }
  return { error: "Stripe portal session creation failed" };
}
