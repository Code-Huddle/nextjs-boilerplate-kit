'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { StripeSubscriptionManager } from './StripeSubscriptionManager';
import { useCreateCustomer, useCreateCheckoutSession, useSubscriptionConfig } from '@/hooks/useStripeSubscriptions';
import Calendar from 'lucide-react/dist/esm/icons/calendar';
import CreditCard from 'lucide-react/dist/esm/icons/credit-card';
import Users from 'lucide-react/dist/esm/icons/users';
import Zap from 'lucide-react/dist/esm/icons/zap';
import User from 'lucide-react/dist/esm/icons/user';

export function SubscriptionDemo() {
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'yearly'>('monthly');
  const [customerId, setCustomerId] = useState<string | null>(null);
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [isCreatingCustomer, setIsCreatingCustomer] = useState(false);
  const [showCustomerForm, setShowCustomerForm] = useState(false);
  const [customerMessage, setCustomerMessage] = useState<string | null>(null);

  const { data: config, isLoading: isConfigLoading, } = useSubscriptionConfig();

  // Load customer from localStorage on component mount
  useEffect(() => {
    const savedCustomerId = localStorage.getItem('stripe_customer_id');
    const savedCustomerEmail = localStorage.getItem('stripe_customer_email');
    const savedCustomerName = localStorage.getItem('stripe_customer_name');
    
    if (savedCustomerId) {
      setCustomerId(savedCustomerId);
      setCustomerEmail(savedCustomerEmail || '');
      setCustomerName(savedCustomerName || '');
    }
  }, []);

  const createCustomerMutation = useCreateCustomer({
    onSuccess: (data) => {
      localStorage.setItem('stripe_customer_id', data.customerId);
      localStorage.setItem('stripe_customer_email', data.email);
      if (customerName.trim()) {
        localStorage.setItem('stripe_customer_name', customerName.trim());
      }
      setCustomerId(data.customerId);
      setShowCustomerForm(false);
      setCustomerMessage('Customer created successfully.');
    },
  });

  const createCheckoutSessionMutation = useCreateCheckoutSession({
    onSuccess: (data) => {
      if (data.url) {
        window.location.href = data.url;
      }
    },
  });

  const createCustomer = async () => {
    if (!customerEmail.trim()) {
      setCustomerMessage('Please enter an email address');
      return;
    }
    setCustomerMessage(null);
    setIsCreatingCustomer(true);
    try {
      await createCustomerMutation.mutateAsync({ email: customerEmail.trim(), name: customerName.trim() || undefined });
    } catch (err) {
      setCustomerMessage(err instanceof Error ? err.message : 'Failed to create customer');
    } finally {
      setIsCreatingCustomer(false);
    }
  };

  const handleCreateCheckoutSession = async (plan: 'monthly' | 'yearly') => {
    if (!customerId) {
      setCustomerMessage('Please create a customer first using the form above.');
      return;
    }
    const priceId = plan === 'monthly' ? config?.monthly?.id : config?.yearly?.id;
    if (!priceId) {
      setCustomerMessage('Price ID is not configured. Please set STRIPE_PRICE_ID_MONTHLY and STRIPE_PRICE_ID_YEARLY in your environment.');
      return;
    }
    try {
      await createCheckoutSessionMutation.mutateAsync({
        priceId,
        customerId: customerId,
      });
    } catch (err) {
      setCustomerMessage(err instanceof Error ? err.message : 'Failed to create checkout session');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Customer Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <User className="h-5 w-5" />
            <span>Customer Management</span>
            <Badge variant="outline" className="text-xs">
              Demo
            </Badge>
          </CardTitle>
          <CardDescription>
            Create a Stripe customer to test subscription functionality
          </CardDescription>
        </CardHeader>
        <CardContent>
          {customerId ? (
            <div className="space-y-4">
              <div className="p-4 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg">
                <h3 className="font-semibold text-green-800 dark:text-green-200 mb-2">
                  ✅ Customer Created
                </h3>
                <div className="text-sm text-green-700 dark:text-green-300 space-y-1">
                  <p><strong>ID:</strong> {customerId}</p>
                  <p><strong>Email:</strong> {customerEmail}</p>
                  {customerName && <p><strong>Name:</strong> {customerName}</p>}
                </div>
              </div>
              <Button
                onClick={() => {
                  localStorage.removeItem('stripe_customer_id');
                  localStorage.removeItem('stripe_customer_email');
                  localStorage.removeItem('stripe_customer_name');
                  setCustomerId(null);
                  setCustomerEmail('');
                  setCustomerName('');
                }}
                variant="outline"
                size="sm"
              >
                Clear Customer Data
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {!showCustomerForm ? (
                <Button
                  onClick={() => setShowCustomerForm(true)}
                  variant="futuristic"
                  className="w-full"
                >
                  Create Customer
                </Button>
              ) : (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="customer-email">Email *</Label>
                    <Input
                      id="customer-email"
                      type="email"
                      placeholder="customer@example.com"
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="customer-name">Name (optional)</Label>
                    <Input
                      id="customer-name"
                      type="text"
                      placeholder="John Doe"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                    />
                  </div>
                  {customerMessage && (
                    <p className="text-sm text-muted-foreground">{customerMessage}</p>
                  )}
                  <div className="flex space-x-2">
                    <Button
                      onClick={createCustomer}
                      disabled={isCreatingCustomer || !customerEmail.trim() || createCustomerMutation.isPending}
                      variant="futuristic"
                      className="flex-1"
                    >
                      {isCreatingCustomer || createCustomerMutation.isPending ? 'Creating...' : 'Create Customer'}
                    </Button>
                    <Button
                      onClick={() => setShowCustomerForm(false)}
                      variant="outline"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Instructions and Env-based Plans */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="h-5 w-5" />
            <span>Set up your subscription products</span>
          </CardTitle>
          <CardDescription>
            In Stripe Dashboard, create a product with monthly and yearly prices. Then set <code>STRIPE_PRICE_ID_MONTHLY</code> and <code>STRIPE_PRICE_ID_YEARLY</code> in your env. We will fetch those prices below.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isConfigLoading ? (
            <div className="text-sm text-muted-foreground">Loading configuration…</div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {/* Monthly */}
              <Card className={`${selectedPlan === 'monthly' ? 'border-primary' : ''}`}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Monthly</CardTitle>
                  <CardDescription className="text-sm">
                    {config?.monthly?.product?.name || 'Your Product'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-3">
                    <div className="text-2xl font-bold">
                      {config?.monthly?.unit_amount != null ? `$${(config.monthly.unit_amount / 100).toFixed(2)}` : '—'}
                      <span className="text-sm font-normal text-muted-foreground">/month</span>
                    </div>
                  </div>
                  <Button
                    className="w-full"
                    variant={selectedPlan === 'monthly' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleCreateCheckoutSession('monthly')}
                    disabled={!config?.monthly?.id || createCheckoutSessionMutation.isPending}
                  >
                    {createCheckoutSessionMutation.isPending ? 'Processing…' : 'Subscribe Monthly'}
                  </Button>
                </CardContent>
              </Card>

              {/* Yearly */}
              <Card className={`${selectedPlan === 'yearly' ? 'border-primary' : ''}`}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Yearly</CardTitle>
                  <CardDescription className="text-sm">
                    {config?.yearly?.product?.name || 'Your Product'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-3">
                    <div className="text-2xl font-bold">
                      {config?.yearly?.unit_amount != null ? `$${(config.yearly.unit_amount / 100).toFixed(2)}` : '—'}
                      <span className="text-sm font-normal text-muted-foreground">/year</span>
                    </div>
                  </div>
                  <Button
                    className="w-full"
                    variant={selectedPlan === 'yearly' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleCreateCheckoutSession('yearly')}
                    disabled={!config?.yearly?.id || createCheckoutSessionMutation.isPending}
                  >
                    {createCheckoutSessionMutation.isPending ? 'Processing…' : 'Subscribe Yearly'}
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}
          {!config?.monthly?.id && !config?.yearly?.id && (
            <p className="mt-4 text-sm text-destructive">Price IDs are not configured. Please set STRIPE_PRICE_ID_MONTHLY and STRIPE_PRICE_ID_YEARLY.</p>
          )}
        </CardContent>
      </Card>

      {/* Subscription Management Demo */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="h-5 w-5" />
            <span>Subscription Management</span>
            <Badge variant="outline" className="text-xs">
              Demo
            </Badge>
          </CardTitle>
          <CardDescription>
            Test the subscription management interface (requires an active subscription)
          </CardDescription>
        </CardHeader>
        <CardContent>
          {customerId ? (
            <StripeSubscriptionManager
              customerId={customerId}
              onSubscriptionChange={(subscription) => {
                console.log('Subscription updated:', subscription);
                // optional inline feedback here if needed
              }}
            />
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">
                Create a customer above to view subscription management
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Test Card Info */}
      <Card className="border-blue-200 bg-blue-50/50 dark:border-blue-800 dark:bg-blue-950/20">
        <CardHeader>
          <CardTitle className="text-blue-800 dark:text-blue-200 text-lg">
            💡 Test Card Numbers
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm">
            <div>
              <span className="font-medium text-green-600 dark:text-green-400">✅ Successful:</span>
              <code className="ml-2 bg-muted px-2 py-1 rounded text-xs">4242 4242 4242 4242</code>
            </div>
            <div>
              <span className="font-medium text-red-600 dark:text-red-400">❌ Declined:</span>
              <code className="ml-2 bg-muted px-2 py-1 rounded text-xs">4000 0000 0000 0002</code>
            </div>
            <p className="text-blue-700 dark:text-blue-300 text-xs">
              Use any future expiry date (e.g., 12/25) and any 3-digit CVC. Subscriptions will be created in test mode.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Important Notice */}
      <Card className="border-yellow-200 bg-yellow-50/50 dark:border-yellow-800 dark:bg-yellow-950/20">
        <CardHeader>
          <CardTitle className="text-yellow-800 dark:text-yellow-200 text-lg">
            ⚠️ Important Notice
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm text-yellow-700 dark:text-yellow-300">
            <p>
              <strong>Test Plans:</strong> The plans shown above (Starter, Professional, Enterprise) are for testing purposes only. 
              They use placeholder price IDs and will not process real payments.
            </p>
            <p>
              <strong>Real Payments:</strong> To process real payments, you need to:
            </p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Create actual products and prices in your Stripe Dashboard</li>
              <li>Update the environment variables with real price IDs</li>
              <li>Replace the test price IDs in the code with your actual ones</li>
            </ul>
            <p>
              <strong>Customer Management:</strong> We are now creating new customers programmatically, storing their customer ID in local storage, 
              and fetching their status accordingly. You can modify this logic as needed for your setup.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
