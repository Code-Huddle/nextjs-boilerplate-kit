import { NextRequest } from 'next/server';
import { stripe } from '@/lib/stripe';
import Stripe from 'stripe';

export async function POST(request: NextRequest) {
  try {
    const { action, ...data } = await request.json();

    switch (action) {
      case 'create-checkout-session':
        return await createCheckoutSession(data);
      case 'create-portal-session':
        return await createPortalSession(data);
      case 'create-subscription':
        return await createSubscription(data);
      case 'cancel-subscription':
        return await cancelSubscription(data);
      case 'create-customer':
        return await createCustomer(data);
      case 'get-subscription-status':
        return await getSubscriptionStatus(data);
      case 'get-subscription-config':
        return await getSubscriptionConfig();
      default:
        return Response.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('Stripe API error:', error);
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

async function createCheckoutSession(data: any) {
  const { priceId, customerId, successUrl, cancelUrl } = data;

  if (!priceId) {
    return Response.json({ error: 'Price ID is required' }, { status: 400 });
  }

  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    customer: customerId,
    success_url: successUrl || `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/payment/success`,
    cancel_url: cancelUrl || `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/payment/cancel`,
    metadata: {
      type: 'subscription',
    },
  });

  return Response.json({ sessionId: session.id, url: session.url });
}

async function createPortalSession(data: any) {
  const { customerId, returnUrl } = data;

  if (!customerId) {
    return Response.json({ error: 'Customer ID is required' }, { status: 400 });
  }

  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: returnUrl || `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard`,
  });

  return Response.json({ url: session.url });
}

async function createSubscription(data: any) {
  const { customerId, priceId, paymentMethodId } = data;

  if (!customerId || !priceId) {
    return Response.json({ error: 'Customer ID and Price ID are required' }, { status: 400 });
  }

  const subscription = await stripe.subscriptions.create({
    customer: customerId,
    items: [{ price: priceId }],
    payment_behavior: 'default_incomplete',
    payment_settings: { save_default_payment_method: 'on_subscription' },
    expand: ['latest_invoice.payment_intent'],
    metadata: {
      type: 'subscription',
    },
  });

  return Response.json({
    subscriptionId: subscription.id,
    clientSecret: (subscription.latest_invoice as Stripe.Invoice)?.payment_intent?.client_secret,
  });
}

async function cancelSubscription(data: any) {
  const { subscriptionId } = data;

  if (!subscriptionId) {
    return Response.json({ error: 'Subscription ID is required' }, { status: 400 });
  }

  const subscription = await stripe.subscriptions.update(subscriptionId, {
    cancel_at_period_end: true,
  });

  return Response.json({
    subscriptionId: subscription.id,
    status: subscription.status,
    cancelAtPeriodEnd: subscription.cancel_at_period_end,
  });
}

async function createCustomer(data: any) {
  const { email, name } = data;

  if (!email) {
    return Response.json({ error: 'Email is required' }, { status: 400 });
  }

  const customer = await stripe.customers.create({
    email,
    name: name || undefined,
    metadata: {
      created_via: 'subscription_demo',
    },
  });

  return Response.json({
    customerId: customer.id,
    email: customer.email,
  });
}

async function getSubscriptionStatus(data: any) {
  const { customerId } = data;

  if (!customerId) {
    return Response.json({ error: 'Customer ID is required' }, { status: 400 });
  }

  try {
    // Get all subscriptions for the customer
    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      status: 'all',
      limit: 1,
    });

    if (subscriptions.data.length === 0) {
      return Response.json({ subscription: null });
    }

    const subscription = subscriptions.data[0];
    
    return Response.json({
      subscription: {
        id: subscription.id,
        status: subscription.status,
        current_period_end: subscription.current_period_end,
        cancel_at_period_end: subscription.cancel_at_period_end,
        items: {
          data: subscription.items.data.map(item => ({
            price: {
              id: item.price.id,
              nickname: item.price.nickname,
              unit_amount: item.price.unit_amount,
              currency: item.price.currency,
              recurring: item.price.recurring,
            },
          })),
        },
      },
    });
  } catch (error) {
    console.error('Error fetching subscription status:', error);
    return Response.json({ error: 'Failed to fetch subscription status' }, { status: 500 });
  }
}

export async function GET() {
  return Response.json({ message: 'Stripe subscriptions API endpoint' });
}

async function getSubscriptionConfig() {
  try {
    const monthlyId = process.env.STRIPE_PRICE_ID_MONTHLY;
    const yearlyId = process.env.STRIPE_PRICE_ID_YEARLY;

    const result: any = { monthly: null, yearly: null };

    if (monthlyId) {
      const price = await stripe.prices.retrieve(monthlyId, { expand: ['product'] });
      result.monthly = serializePrice(price);
    }

    if (yearlyId) {
      const price = await stripe.prices.retrieve(yearlyId, { expand: ['product'] });
      result.yearly = serializePrice(yearlyId ? await stripe.prices.retrieve(yearlyId, { expand: ['product'] }) : (null as any));
    }

    return Response.json({ config: result });
  } catch (error) {
    console.error('Error fetching subscription config:', error);
    return Response.json({ error: 'Failed to fetch subscription configuration' }, { status: 500 });
  }
}

function serializePrice(price: Stripe.Price | null) {
  if (!price) return null;
  const product = price.product as Stripe.Product | null;
  return {
    id: price.id,
    unit_amount: price.unit_amount,
    currency: price.currency,
    recurring: price.recurring,
    product: product
      ? {
          id: product.id,
          name: product.name,
          description: product.description,
        }
      : null,
  };
}
