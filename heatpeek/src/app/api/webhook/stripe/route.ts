import { StripeSync } from "@supabase/stripe-sync-engine";
import { NextRequest, NextResponse } from "next/server";

const sync = new StripeSync({
  databaseUrl: process.env.DATABASE_URL!,
  stripeSecretKey: process.env.STRIPE_SECRET_KEY!,
  stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET!,
  backfillRelatedEntities: true,
});

export async function POST(req: NextRequest) {
  const payload = await req.text();
  const signature = req.headers.get("stripe-signature")!;

  try {
    await sync.processWebhook(payload, signature);
    return new NextResponse("Webhook processed", { status: 200 });
  } catch (error) {
    console.error("Stripe Sync error:", error);
    return new NextResponse("Webhook error", { status: 400 });
  }
}
