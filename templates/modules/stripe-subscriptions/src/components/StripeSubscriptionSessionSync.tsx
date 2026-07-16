'use client';

import { useEffect } from 'react';
import { storeStripeSubscriptionSessionId } from '@/hooks/useStripeSubscriptions';

type StripeSubscriptionSessionSyncProps = {
  sessionId?: string;
};

export function StripeSubscriptionSessionSync({ sessionId }: StripeSubscriptionSessionSyncProps) {
  useEffect(() => {
    if (sessionId) {
      storeStripeSubscriptionSessionId(sessionId);
    }
  }, [sessionId]);

  return null;
}
