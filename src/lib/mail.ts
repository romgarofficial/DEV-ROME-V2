import { Resend } from "resend";
import {
  acknowledgementEmailHtml,
  acknowledgementEmailSubject,
  acknowledgementEmailText,
  contactEmailHtml,
  contactEmailSubject,
  contactEmailText,
  inboxReplyEmailHtml,
  inboxReplyEmailSubject,
  inboxReplyEmailText,
} from "@/lib/contact-email";

export function mailFrom() {
  return (process.env.RESEND_FROM || "").trim();
}

export function mailTo() {
  return (process.env.CONTACT_TO_EMAIL || process.env.ADMIN_EMAIL || "").trim();
}

export function isMailConfigured() {
  return Boolean(process.env.RESEND_API_KEY && mailFrom() && mailTo());
}

function resendClient() {
  const to = mailTo();
  const from = mailFrom();
  const key = process.env.RESEND_API_KEY;
  if (!key || !to || !from) {
    throw new Error("Contact email is not configured yet.");
  }
  return { resend: new Resend(key), to, from };
}

export async function sendContactMessage(input: {
  name: string;
  email: string;
  message: string;
}) {
  const { resend, to, from } = resendClient();
  const { error } = await resend.emails.send({
    from,
    to,
    replyTo: input.email,
    subject: contactEmailSubject(input.name),
    text: contactEmailText(input),
    html: contactEmailHtml(input),
  });
  if (error) throw new Error(error.message || "Could not send email");
}

export async function sendAcknowledgement(input: {
  name: string;
  email: string;
  message: string;
}) {
  const { resend, to, from } = resendClient();
  const { error } = await resend.emails.send({
    from,
    to: input.email,
    replyTo: to,
    subject: acknowledgementEmailSubject(),
    text: acknowledgementEmailText(input),
    html: acknowledgementEmailHtml(input),
  });
  if (error) throw new Error(error.message || "Could not send acknowledgement");
}

export async function sendInboxReply(input: {
  to: string;
  name: string;
  html: string;
  text: string;
}) {
  const { resend, to: replyTo, from } = resendClient();
  const { error } = await resend.emails.send({
    from,
    to: input.to,
    replyTo,
    subject: inboxReplyEmailSubject(),
    text: inboxReplyEmailText({ name: input.name, text: input.text }),
    html: inboxReplyEmailHtml({ name: input.name, bodyHtml: input.html }),
  });
  if (error) throw new Error(error.message || "Could not send reply");
}

export async function sendContactEmails(input: {
  name: string;
  email: string;
  message: string;
}) {
  const results = await Promise.allSettled([
    sendContactMessage(input),
    sendAcknowledgement(input),
  ]);
  const failed = results.filter((result) => result.status === "rejected");
  if (failed.length) {
    const reasons = failed.map((result) =>
      result.status === "rejected" ? String(result.reason) : "",
    );
    console.error("[contact] mail", reasons.join(" | "));
    if (failed.length === results.length) {
      throw new Error("Could not send email");
    }
  }
}
