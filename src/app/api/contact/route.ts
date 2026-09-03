import { ContactSchema, contactFieldErrors } from "@/lib/contact-schema";
import { dbConnect } from "@/lib/db";
import { isMailConfigured, sendContactMessage } from "@/lib/mail";
import { ContactMessage } from "@/models";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = ContactSchema.safeParse(body);
  if (!parsed.success) {
    const fields = contactFieldErrors(parsed.error);
    return Response.json(
      {
        error: fields.email || fields.name || fields.message || "Please check the form and try again.",
        fieldErrors: fields,
      },
      { status: 400 },
    );
  }

  if (parsed.data.company_website) {
    return Response.json({ ok: true });
  }

  const payload = {
    name: parsed.data.name,
    email: parsed.data.email,
    message: parsed.data.message,
  };

  try {
    await dbConnect();
    await ContactMessage.create({
      ...payload,
      status: "unread",
      replies: [],
    });
  } catch (error) {
    console.error("[contact] save", error);
    return Response.json({ error: "Could not send the message. Try again in a moment." }, { status: 500 });
  }

  if (!isMailConfigured()) {
    if (process.env.NODE_ENV !== "production") {
      console.info("[contact:dev]", payload);
      return Response.json({ ok: true, dev: true });
    }
    return Response.json({ error: "Contact email is not configured yet." }, { status: 503 });
  }

  try {
    await sendContactMessage(payload);
    return Response.json({ ok: true });
  } catch (error) {
    console.error("[contact]", error);
    return Response.json({ error: "Could not send the message. Try again in a moment." }, { status: 500 });
  }
}
