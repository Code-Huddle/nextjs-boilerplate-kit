import { buildSampleEmail } from '@/emails/sample';
import { fromEmail, transporter } from '@/lib/mailer';

export async function POST(request: Request) {
  const recipient = process.env.EMAIL_TEST_RECIPIENT;
  if (!recipient) {
    return Response.json({ error: 'EMAIL_TEST_RECIPIENT is not configured' }, { status: 503 });
  }

  try {
    const { title, message } = await request.json() as { title?: string; message?: string };
    const info = await transporter.sendMail({
      from: fromEmail,
      to: recipient,
      subject: 'Transactional email test',
      html: buildSampleEmail({
        title: title?.slice(0, 100) || 'Your app email is configured',
        message: message?.slice(0, 1000) || 'This test email was sent to the configured server-side recipient.',
        appUrl: process.env.NEXT_PUBLIC_APP_URL,
      }),
    });
    return Response.json({ id: info.messageId, to: [recipient] });
  } catch (error) {
    console.error('Email send failed:', error);
    return Response.json({ error: 'Email delivery failed' }, { status: 500 });
  }
}
