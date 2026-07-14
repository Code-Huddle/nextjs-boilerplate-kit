'use client';

import { useState } from 'react';
import { StripeOneTimePayment } from './StripeOneTimePayment';

export function PaymentDemo() {
  const [message, setMessage] = useState<string | null>(null);
  return (
    <div className="mx-auto max-w-md space-y-4">
      <p className="text-sm text-muted-foreground">
        The browser cannot choose the amount or currency. Configure STRIPE_ONE_TIME_PRICE_ID on the server.
      </p>
      {message && <p className="text-sm text-destructive">{message}</p>}
      <StripeOneTimePayment onMessage={setMessage} />
    </div>
  );
}
