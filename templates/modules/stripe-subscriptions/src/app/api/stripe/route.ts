import type { NextRequest } from 'next/server';
import type Stripe from 'stripe';
import { requireApiUser } from '@/lib/server-auth';
import { stripe } from '@/lib/stripe';

type Action = 'checkout' | 'portal' | 'status' | 'cancel' | 'config';

async function customerFor(user: { id: string; email: string | null }) {
  const found = await stripe.customers.search({
    query: `metadata['app_user_id']:'${user.id.replaceAll("'", '')}'`,
    limit: 1,
  });
  return found.data[0] ?? stripe.customers.create({
    email: user.email ?? undefined,
    metadata: { app_user_id: user.id },
  });
}

function serializePrice(price: Stripe.Price) {
  const product = typeof price.product === 'object' && !('deleted' in price.product) ? price.product : null;
  return {
    id: price.id,
    unit_amount: price.unit_amount,
    currency: price.currency,
    recurring: price.recurring,
    product: product ? { id: product.id, name: product.name, description: product.description } : null,
  };
}

export async function POST(request: NextRequest) {
  const auth = await requireApiUser(request);
  if (!auth.ok) return auth.response;

  try {
    const body = await request.json() as { action?: Action; plan?: 'monthly' | 'yearly' };
    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? request.nextUrl.origin;

    if (body.action === 'config') {
      const entries = await Promise.all(['monthly', 'yearly'].map(async (plan) => {
        const priceId = plan === 'monthly' ? process.env.STRIPE_PRICE_ID_MONTHLY : process.env.STRIPE_PRICE_ID_YEARLY;
        if (!priceId) return [plan, null] as const;
        const price = await stripe.prices.retrieve(priceId, { expand: ['product'] });
        return [plan, serializePrice(price)] as const;
      }));
      return Response.json({ config: Object.fromEntries(entries) });
    }

    const customer = await customerFor(auth.user);
    if (body.action === 'checkout') {
      const priceId = body.plan === 'yearly' ? process.env.STRIPE_PRICE_ID_YEARLY : process.env.STRIPE_PRICE_ID_MONTHLY;
      if (!priceId) return Response.json({ error: 'The selected server-side price is not configured' }, { status: 503 });
      const session = await stripe.checkout.sessions.create({
        mode: 'subscription',
        customer: customer.id,
        line_items: [{ price: priceId, quantity: 1 }],
        success_url: `${appUrl}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${appUrl}/payment/cancel`,
        client_reference_id: auth.user.id,
        metadata: { app_user_id: auth.user.id, plan: body.plan ?? 'monthly' },
      });
      return Response.json({ url: session.url });
    }

    if (body.action === 'portal') {
      const session = await stripe.billingPortal.sessions.create({ customer: customer.id, return_url: `${appUrl}/dashboard` });
      return Response.json({ url: session.url });
    }

    const subscriptions = await stripe.subscriptions.list({ customer: customer.id, status: 'all', limit: 1 });
    const subscription = subscriptions.data[0];
    if (body.action === 'cancel') {
      if (!subscription) return Response.json({ error: 'No subscription found' }, { status: 404 });
      const updated = await stripe.subscriptions.update(subscription.id, { cancel_at_period_end: true });
      return Response.json({ subscription: { id: updated.id, status: updated.status, cancelAtPeriodEnd: updated.cancel_at_period_end } });
    }
    if (body.action === 'status') {
      return Response.json({
        subscription: subscription
          ? { id: subscription.id, status: subscription.status, cancelAtPeriodEnd: subscription.cancel_at_period_end }
          : null,
      });
    }
    return Response.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('Stripe API error:', error);
    return Response.json({ error: 'Stripe request failed' }, { status: 500 });
  }
}
