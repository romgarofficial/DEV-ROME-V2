import { z } from "zod";
import { createMailer, isSmtpConfigured, mailFrom } from "@/lib/mail";

const ContactSchema = z.object({
  name: z.string().min(2).max(120),
  email: z.email(),
  message: z.string().min(10).max(4000),
  company_website: z.string().optional(),
});

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = ContactSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ error: "Please check the form and try again." }, { status: 400 });
  }

  if (parsed.data.company_website) {
    return Response.json({ ok: true });
  }

  const to = process.env.CONTACT_TO_EMAIL || process.env.ADMIN_EMAIL;
  const from = mailFrom();

  if (!isSmtpConfigured() || !to || !from) {
    if (process.env.NODE_ENV !== "production") {
      console.info("[contact:dev]", parsed.data);
      return Response.json({ ok: true, dev: true });
    }
    return Response.json(
      { error: "Contact email is not configured yet." },
      { status: 503 },
    );
  }

  try {
    const transporter = createMailer();
    if (!transporter) {
      return Response.json({ error: "Contact email is not configured yet." }, { status: 503 });
    }

    await transporter.sendMail({
      from,
      to,
      replyTo: parsed.data.email,
      subject: `Portfolio message from ${parsed.data.name}`,
      text: `${parsed.data.message}\n\nFrom: ${parsed.data.name} <${parsed.data.email}>`,
    });

    return Response.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not send email";
    return Response.json({ error: message }, { status: 500 });
  }
}
