import { useApiMutation } from '@/hooks/useApi';

type SendEmailVars = {
  to: string[] | string;
  subject: string;
  html?: string;
  useSample?: boolean;
  title?: string;
  message?: string;
};

type SendEmailRes = {
  id?: string;
  to: string[];
  error?: string;
};

async function postEmail<T>(body: unknown): Promise<T> {
  const res = await fetch('/api/email/send', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok || data?.error) {
    throw new Error(data?.error || 'Request failed');
  }
  return data as T;
}

export function useSendEmail(options?: { onSuccess?: (data: SendEmailRes, vars: SendEmailVars) => void }) {
  return useApiMutation<SendEmailRes, SendEmailVars>(
    (vars) => postEmail<SendEmailRes>(vars),
    { onSuccess: options?.onSuccess }
  );
}


