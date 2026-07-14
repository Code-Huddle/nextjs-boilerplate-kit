import type { NextRequest } from 'next/server';
import { stripe } from '@/lib/stripe';

export async function POST(request: NextRequest) {
  const signature = request.headers.get('stripe-signature');
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!signature || !secret) return Response.json({ error: 'Webhook is not configured' }, { status: 400 });

  try {
    const event = stripe.webhooks.constructEvent(await request.text(), signature, secret);
    // Persist fulfillment idempotently in your database before enabling production sales.
    console.info('Verified Stripe event', event.id, event.type);
    return Response.json({ received: true });
  } catch {
    return Response.json({ error: 'Invalid Stripe signature' }, { status: 400 });
  }
}
