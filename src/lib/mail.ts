import { Resend } from "resend";

export function mailFrom() {
  return (process.env.RESEND_FROM || "").trim();
}

export function mailTo() {
  return (process.env.CONTACT_TO_EMAIL || process.env.ADMIN_EMAIL || "").trim();
}

export function isMailConfigured() {
  return Boolean(process.env.RESEND_API_KEY && mailFrom() && mailTo());
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

export async function sendContactMessage(input: {
  name: string;
  email: string;
  message: string;
}) {
  const to = mailTo();
  const from = mailFrom();
  const key = process.env.RESEND_API_KEY;
  if (!key || !to || !from) {
    throw new Error("Contact email is not configured yet.");
  }

  const resend = new Resend(key);
  const safeName = escapeHtml(input.name);
  const safeEmail = escapeHtml(input.email);
  const safeMessage = escapeHtml(input.message).replaceAll("\n", "<br />");

  const { error } = await resend.emails.send({
    from,
    to,
    replyTo: input.email,
    subject: `Portfolio message from ${input.name}`,
    text: `${input.message}\n\nFrom: ${input.name} <${input.email}>`,
    html: `
      <div style="font-family:system-ui,sans-serif;line-height:1.6;color:#121214">
        <p style="margin:0 0 16px;letter-spacing:0.16em;text-transform:uppercase;font-size:11px;color:#6d6a66">ROME contact</p>
        <p style="margin:0 0 8px"><strong>${safeName}</strong> &lt;${safeEmail}&gt;</p>
        <p style="margin:0;white-space:pre-wrap">${safeMessage}</p>
      </div>
    `,
  });

  if (error) {
    throw new Error(error.message || "Could not send email");
  }
}
