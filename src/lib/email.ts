/**
 * Email service — uses Resend when API key is available,
 * falls back to console logging in development.
 */

type EmailPayload = {
  from: string;
  to: string;
  subject: string;
  html: string;
};

const FROM = process.env.EMAIL_FROM ?? "VOID <noreply@void.dev>";

async function sendEmail(payload: EmailPayload): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    // Development fallback — log to console
    if (process.env.NODE_ENV !== "production") {
      console.log("\n📧 [EMAIL - DEV MODE]");
      console.log(`To: ${payload.to}`);
      console.log(`Subject: ${payload.subject}`);
      console.log("(Set RESEND_API_KEY to send real emails)\n");
    }
    return;
  }

  try {
    const { Resend } = await import("resend");
    const resend = new Resend(apiKey);
    await resend.emails.send(payload);
  } catch (err) {
    console.error("Email send failed:", err);
    // Don't throw — email failures shouldn't break the app
  }
}

const emailTemplate = (content: string) => `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <style>
      body { background: #0a0a0f; color: #e2e8f0; font-family: 'JetBrains Mono', monospace; margin: 0; padding: 40px 20px; }
      .container { max-width: 480px; margin: 0 auto; }
      .logo { font-size: 28px; font-weight: 900; color: #a78bfa; letter-spacing: -2px; margin-bottom: 28px; }
      .card { background: #111118; border: 1px solid #1e1e2e; border-radius: 12px; padding: 28px; }
      h1 { font-size: 18px; margin: 0 0 12px; color: #f8fafc; }
      p { color: #94a3b8; font-size: 14px; line-height: 1.6; margin: 0 0 16px; }
      .btn { display: inline-block; background: #a78bfa; color: #0a0a0f; padding: 11px 22px; border-radius: 8px; text-decoration: none; font-weight: 700; font-size: 14px; }
      .footer { margin-top: 20px; font-size: 11px; color: #475569; }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="logo">VOID</div>
      <div class="card">${content}</div>
    </div>
  </body>
</html>
`;

export async function sendMagicLink(email: string, url: string): Promise<void> {
  await sendEmail({
    from: FROM,
    to: email,
    subject: "Sign in to VOID",
    html: emailTemplate(`
      <h1>Your sign-in link</h1>
      <p>Click the button below to sign in to VOID. This link expires in 10 minutes.</p>
      <a href="${url}" class="btn">Sign in to VOID →</a>
      <div class="footer">
        <p>If you didn't request this, you can safely ignore this email.</p>
      </div>
    `),
  });
}

export async function sendTransactionUpdate(
  email: string,
  subject: string,
  message: string
): Promise<void> {
  await sendEmail({
    from: FROM,
    to: email,
    subject,
    html: emailTemplate(`<p>${message}</p>`),
  });
}

export async function sendNotificationEmail(
  email: string,
  title: string,
  body: string,
  link?: string
): Promise<void> {
  await sendEmail({
    from: FROM,
    to: email,
    subject: title,
    html: emailTemplate(`
      <h1>${title}</h1>
      <p>${body}</p>
      ${link ? `<a href="${link}" class="btn">View →</a>` : ""}
    `),
  });
}
