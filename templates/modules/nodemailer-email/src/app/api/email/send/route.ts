import type { NextRequest } from 'next/server';
import { buildSampleEmail } from '@/emails/sample';
import { fromEmail, transporter } from '@/lib/mailer';
import { requireApiUser } from '@/lib/server-auth';

export async function POST(request: NextRequest) {
  const auth = await requireApiUser(request);
  if (!auth.ok) return auth.response;

  const recipient = auth.user.email ?? process.env.EMAIL_TEST_RECIPIENT;
  if (!recipient) {
    return Response.json({ error: 'The authenticated user has no email address' }, { status: 400 });
  }

  try {
    const { title, message } = await request.json() as { title?: string; message?: string };
    const info = await transporter.sendMail({
      from: fromEmail,
      to: recipient,
      subject: 'Transactional email test',
      html: buildSampleEmail({
        title: title?.slice(0, 100) || 'Your app email is configured',
        message: message?.slice(0, 1000) || 'This protected test was sent to your authenticated email address.',
        appUrl: process.env.NEXT_PUBLIC_APP_URL,
      }),
    });
    return Response.json({ id: info.messageId, to: [recipient] });
  } catch (error) {
    console.error('Email send failed:', error);
    return Response.json({ error: 'Email delivery failed' }, { status: 500 });
  }
}
