import "server-only";

import Stripe from "stripe";
import { StripeSync } from "@supabase/stripe-sync-engine";

let stripeInstance: Stripe | null = null;

export function getStripe() {
  if (stripeInstance) {
    return stripeInstance;
  }

  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

  if (!stripeSecretKey) {
    throw new Error("Missing STRIPE_SECRET_KEY environment variable");
  }

  stripeInstance = new Stripe(stripeSecretKey, {
    typescript: true,
    httpClient: Stripe.createFetchHttpClient(),
  });

  return stripeInstance;
}

let sync: StripeSync | null = null;

export function getStripeSync(): StripeSync {
  if (!sync) {
    sync = new StripeSync({
      databaseUrl: process.env.DATABASE_URL!,
      stripeSecretKey: process.env.STRIPE_SECRET_KEY!,
      stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET!,
      backfillRelatedEntities: true,
      schema: "stripe",
    });
  }
  return sync;
}
