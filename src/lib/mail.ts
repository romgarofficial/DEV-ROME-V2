import { Resend } from "resend";
import { contactEmailHtml, contactEmailSubject, contactEmailText } from "@/lib/contact-email";

export function mailFrom() {
  return (process.env.RESEND_FROM || "").trim();
}

export function mailTo() {
  return (process.env.CONTACT_TO_EMAIL || process.env.ADMIN_EMAIL || "").trim();
}

export function isMailConfigured() {
  return Boolean(process.env.RESEND_API_KEY && mailFrom() && mailTo());
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
  const { error } = await resend.emails.send({
    from,
    to,
    replyTo: input.email,
    subject: contactEmailSubject(input.name),
    text: contactEmailText(input),
    html: contactEmailHtml(input),
  });

  if (error) {
    throw new Error(error.message || "Could not send email");
  }
}
