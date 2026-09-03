import { z } from "zod";
import { isMailConfigured, sendContactMessage } from "@/lib/mail";

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

  if (!isMailConfigured()) {
    if (process.env.NODE_ENV !== "production") {
      console.info("[contact:dev]", parsed.data);
      return Response.json({ ok: true, dev: true });
    }
    return Response.json({ error: "Contact email is not configured yet." }, { status: 503 });
  }

  try {
    await sendContactMessage({
      name: parsed.data.name,
      email: parsed.data.email,
      message: parsed.data.message,
    });
    return Response.json({ ok: true });
  } catch (error) {
    console.error("[contact]", error);
    return Response.json({ error: "Could not send the message. Try again in a moment." }, { status: 500 });
  }
}
