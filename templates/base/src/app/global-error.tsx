'use client';

import NextError from 'next/error';
import { routing } from '@/libs/i18nNavigation';

export default function GlobalError(_props: Readonly<{
  error: Error & { digest?: string };
}>) {
  return (
    <html lang={routing.defaultLocale}>
      <body>
        {/* `NextError` is the default Next.js error page component. Its type
        definition requires a `statusCode` prop. However, since the App Router
        does not expose status codes for errors, we simply pass 0 to render a
        generic error message. */}
        <NextError statusCode={0} />
      </body>
    </html>
  );
}
