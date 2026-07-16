import type Stripe from 'stripe';
import { stripe } from '@/lib/stripe';

type Action = 'checkout' | 'portal' | 'status' | 'cancel' | 'config';

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

type RequestBody = {
  action?: Action;
  plan?: 'monthly' | 'yearly';
  sessionId?: string;
};

async function getCheckoutSession(sessionId: string) {
  return stripe.checkout.sessions.retrieve(sessionId, {
    expand: ['customer', 'subscription'],
  });
}

async function requireCompletedCheckoutSession(sessionId: string | undefined) {
  if (!sessionId) {
    return Response.json({ error: 'A completed checkout session is required' }, { status: 400 });
  }

  const session = await getCheckoutSession(sessionId);
  if (session.mode !== 'subscription' || session.status !== 'complete') {
    return Response.json({ error: 'The checkout session is not a completed subscription session' }, { status: 400 });
  }

  return session;
}

export async function POST(request: Request) {

  try {
    const body = await request.json() as RequestBody;
    const url = new URL(request.url);
    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? url.origin;

    if (body.action === 'config') {
      const entries = await Promise.all(['monthly', 'yearly'].map(async (plan) => {
        const priceId = plan === 'monthly' ? process.env.STRIPE_PRICE_ID_MONTHLY : process.env.STRIPE_PRICE_ID_YEARLY;
        if (!priceId) return [plan, null] as const;
        const price = await stripe.prices.retrieve(priceId, { expand: ['product'] });
        return [plan, serializePrice(price)] as const;
      }));
      return Response.json({ config: Object.fromEntries(entries) });
    }

    if (body.action === 'checkout') {
      const priceId = body.plan === 'yearly' ? process.env.STRIPE_PRICE_ID_YEARLY : process.env.STRIPE_PRICE_ID_MONTHLY;
      if (!priceId) return Response.json({ error: 'The selected server-side price is not configured' }, { status: 503 });
      // Subscription Checkout always creates a Stripe Customer; customer_creation is payment-mode only.
      const session = await stripe.checkout.sessions.create({
        mode: 'subscription',
        line_items: [{ price: priceId, quantity: 1 }],
        success_url: `${appUrl}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${appUrl}/payment/cancel`,
        metadata: { plan: body.plan ?? 'monthly' },
      });
      return Response.json({ url: session.url });
    }

    const session = await requireCompletedCheckoutSession(body.sessionId);
    if (session instanceof Response) return session;

    const customerId = typeof session.customer === 'string' ? session.customer : session.customer?.id;
    if (body.action === 'portal') {
      if (!customerId) return Response.json({ error: 'No customer found for this checkout session' }, { status: 404 });
      const portalSession = await stripe.billingPortal.sessions.create({ customer: customerId, return_url: `${appUrl}/dashboard` });
      return Response.json({ url: portalSession.url });
    }

    const subscriptionId = typeof session.subscription === 'string' ? session.subscription : session.subscription?.id;
    const subscription = subscriptionId ? await stripe.subscriptions.retrieve(subscriptionId) : null;
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
