import Stripe from "stripe";
import { StripeSync } from "@supabase/stripe-sync-engine";

let stripe: Stripe | null = null;

export function getStripe(): Stripe {
  if (!stripe) {
    stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
  }
  return stripe;
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
