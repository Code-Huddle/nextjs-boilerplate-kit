import type { Viewport } from 'next';
import '@/styles/global.css';
import { constructMetadata } from '@/components/Seo';
import { AppConfig } from '@/utils/AppConfig';

export const metadata = constructMetadata();

export const viewport: Viewport = {
  colorScheme: 'light dark',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#09090b' },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang={AppConfig.defaultLocale}>
      <body className="font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
