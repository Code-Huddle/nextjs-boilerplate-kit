import type { NextRequest } from 'next/server';
import { requireApiUser } from '@/lib/server-auth';
import { stripe } from '@/lib/stripe';

export async function POST(request: NextRequest) {
  const auth = await requireApiUser(request);
  if (!auth.ok) return auth.response;

  const priceId = process.env.STRIPE_ONE_TIME_PRICE_ID;
  if (!priceId) return Response.json({ error: 'STRIPE_ONE_TIME_PRICE_ID is not configured' }, { status: 503 });

  try {
    const price = await stripe.prices.retrieve(priceId);
    if (!price.active || price.type !== 'one_time' || price.unit_amount === null) {
      return Response.json({ error: 'Configured Stripe price is not an active fixed one-time price' }, { status: 500 });
    }
    const paymentIntent = await stripe.paymentIntents.create({
      amount: price.unit_amount,
      currency: price.currency,
      receipt_email: auth.user.email ?? undefined,
      automatic_payment_methods: { enabled: true },
      metadata: { app_user_id: auth.user.id, price_id: price.id },
    });
    return Response.json({
      clientSecret: paymentIntent.client_secret,
      amount: price.unit_amount,
      currency: price.currency,
    });
  } catch (error) {
    console.error('Stripe payment intent creation failed:', error);
    return Response.json({ error: 'Failed to create payment intent' }, { status: 500 });
  }
}
