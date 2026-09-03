import { Resend } from "resend";
import {
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

export function isResendTestSender() {
  return /@resend\.dev\b/i.test(mailFrom());
}

export function mailStatus() {
  return {
    configured: isMailConfigured(),
    testSender: isResendTestSender(),
  };
}

export function mailErrorMessage(error: unknown, fallback = "Could not send email") {
  if (!error) return fallback;
  if (typeof error === "string" && error.trim()) return error;
  if (error instanceof Error && error.message.trim()) return error.message;
  if (typeof error === "object") {
    const record = error as Record<string, unknown>;
    if (typeof record.message === "string" && record.message.trim()) return record.message;
  }
  return fallback;
}

export function explainSendFailure(error: unknown) {
  const raw = mailErrorMessage(error);
  if (/only send testing emails/i.test(raw) || isResendTestSender()) {
    return "Resend is using the test sender (onboarding@resend.dev), so mail can only go to your Resend account. Verify a domain at resend.com/domains, then set RESEND_FROM to an address on that domain — for example ROME <hello@mail.dev-rome.com>.";
  }
  return raw;
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

function throwIfResendError(error: unknown, fallback: string): void {
  if (!error) return;
  throw new Error(explainSendFailure(error instanceof Error ? error : mailErrorMessage(error, fallback)));
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
  throwIfResendError(error, "Could not send email");
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
  throwIfResendError(error, "Could not send reply");
}
