import type { NextRequest } from 'next/server';
import { buildSampleEmail } from '@/emails/sample';
import { transporter, fromEmail } from '@/lib/mailer';

export async function POST(request: NextRequest) {
  try {
    const { to, subject, html, useSample, title, message } = await request.json();

    if (!to || !subject || !html) {
      return Response.json({ error: 'Missing required fields: to, subject, html' }, { status: 400 });
    }

    const recipients = Array.isArray(to)
      ? to
      : String(to)
          .split(',')
          .map((x) => x.trim())
          .filter(Boolean);

    if (recipients.length === 0) {
      return Response.json({ error: 'No valid recipients provided' }, { status: 400 });
    }

    const info = await transporter.sendMail({
      from: fromEmail,
      to: recipients.join(','),
      subject,
      html: useSample ? buildSampleEmail({ title, message, appUrl: process.env.NEXT_PUBLIC_APP_URL }) : html,
    });

    return Response.json({ id: info.messageId, to: recipients });
  } catch (error) {
    console.error('Resend API error:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET() {
  return Response.json({ message: 'Email sending API endpoint' });
}
