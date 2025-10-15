export function buildSampleEmail(params: { title?: string; message?: string; appUrl?: string }) {
  const title = params.title || 'Welcome to Your App';
  const message =
    params.message ||
    'This is a sample transactional email sent via Nodemailer. You can customize this template as needed.';
  const appUrl = params.appUrl || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

  // Basic responsive email with inline styles for broad client support
  return `
  <!doctype html>
  <html>
    <head>
      <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>${escapeHtml(title)}</title>
      <style>
        @media (prefers-color-scheme: dark) {
          body { background-color: #0b1220 !important; color: #e5e7eb !important; }
        }
      </style>
    </head>
    <body style="margin:0;padding:0;background-color:#0b1220;color:#0f172a;">
      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background:#0b1220;padding:24px 0;">
        <tr>
          <td align="center">
            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="width:600px;max-width:100%;background:#0b1220;border:1px solid #1f2937;border-radius:14px;overflow:hidden;">
              <tr>
                <td style="background:linear-gradient(135deg,#111827 0%,#0f172a 100%);padding:32px;text-align:center;border-bottom:1px solid #1f2937;">
                  <div style="font-size:24px;line-height:32px;font-weight:700;color:#e5e7eb;font-family:Inter,Segoe UI,Arial,sans-serif;">${escapeHtml(
                    title
                  )}</div>
                  <div style="margin-top:8px;font-size:13px;color:#9ca3af;font-family:Inter,Segoe UI,Arial,sans-serif;">Notification from Your App</div>
                </td>
              </tr>
              <tr>
                <td style="padding:24px;background:#0b1220;">
                  <div style="font-size:14px;line-height:22px;color:#cbd5e1;font-family:Inter,Segoe UI,Arial,sans-serif;">
                    <p style="margin:0 0 12px 0;">${escapeHtml(message)}</p>
                    <p style="margin:0 0 16px 0;">You can safely edit this template at <code style="background:#111827;color:#93c5fd;padding:2px 6px;border-radius:6px;">src/emails/sample.ts</code>.</p>
                  </div>
                  <div style="margin-top:16px;text-align:center;">
                    <a href="${appUrl}"
                       style="display:inline-block;background:#6366f1;color:#fff;text-decoration:none;font-weight:600;padding:10px 16px;border-radius:10px;font-family:Inter,Segoe UI,Arial,sans-serif;">
                      Open App
                    </a>
                  </div>
                </td>
              </tr>
              <tr>
                <td style="background:#0b1220;padding:16px 24px;border-top:1px solid #1f2937;">
                  <div style="font-size:12px;color:#64748b;text-align:center;font-family:Inter,Segoe UI,Arial,sans-serif;">
                    Sent with Nodemailer • <a href="${appUrl}"
                    style="color:#93c5fd;text-decoration:none;">${escapeHtml(appUrl)}</a>
                  </div>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
  </html>`;
}

function escapeHtml(str: string) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}


