import nodemailer from 'nodemailer';

export const fromEmail = process.env.RESEND_FROM_EMAIL || process.env.EMAIL_FROM || 'no-reply@example.com';

export const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : 587,
  secure: process.env.SMTP_SECURE === 'true' || (process.env.SMTP_PORT === '465'),
  auth: process.env.SMTP_USER && process.env.SMTP_PASS ? {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  } : undefined,
});


