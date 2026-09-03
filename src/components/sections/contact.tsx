"use client";

import { CheckCircle2, Mail, Phone } from "lucide-react";
import { useState, type FormEvent } from "react";
import { SocialIcon } from "@/components/site/social-icon";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { Input, Label, Textarea } from "@/components/ui/fields";
import { ContactSchema, contactFieldErrors } from "@/lib/contact-schema";
import { itemHref } from "@/lib/item-href";
import { SectionBand } from "@/lib/motion";
import { socialLabel } from "@/lib/social-platforms";
import { cn } from "@/lib/utils";
import type { ProfileDoc } from "@/types";

type FieldName = "name" | "email" | "message";
type FieldErrors = Partial<Record<FieldName, string>>;

const EMPTY = { name: "", email: "", message: "" };

export function ContactForm({
  profile,
  index,
}: {
  profile: ProfileDoc | null;
  index: string;
  align?: "start" | "end";
}) {
  const [values, setValues] = useState(EMPTY);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<"idle" | "sending">("idle");
  const [formError, setFormError] = useState("");
  const [successEmail, setSuccessEmail] = useState("");
  const [successOpen, setSuccessOpen] = useState(false);
  const socials = (profile?.socials ?? []).filter((social) => social.platform && social.url);
  const remaining = 4000 - values.message.length;

  function setField(field: FieldName, value: string) {
    setValues((current) => ({ ...current, [field]: value }));
    if (errors[field]) {
      setErrors((current) => {
        const next = { ...current };
        delete next[field];
        return next;
      });
    }
  }

  function validateField(field: FieldName, value: string) {
    const schema =
      field === "name"
        ? ContactSchema.shape.name
        : field === "email"
          ? ContactSchema.shape.email
          : ContactSchema.shape.message;
    const parsed = schema.safeParse(value);
    setErrors((current) => {
      const next = { ...current };
      if (parsed.success) delete next[field];
      else next[field] = parsed.error.issues[0]?.message || "Invalid";
      return next;
    });
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const parsed = ContactSchema.safeParse({
      ...values,
      company_website: (event.currentTarget.elements.namedItem("company_website") as HTMLInputElement | null)
        ?.value,
    });
    if (!parsed.success) {
      setErrors(contactFieldErrors(parsed.error));
      return;
    }

    setStatus("sending");
    setFormError("");
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(parsed.data),
    });
    const json = await res.json().catch(() => ({}));
    setStatus("idle");
    if (!res.ok) {
      setErrors(json.fieldErrors ?? {});
      setFormError(json.error || "Could not send");
      return;
    }
    setSuccessEmail(parsed.data.email);
    setSuccessOpen(true);
    setValues(EMPTY);
    setErrors({});
  }

  return (
    <SectionBand id="contact" index={index} kicker="Contact" title="Let’s talk">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:items-start">
        <div>
          <p className="max-w-md text-muted">
            {profile?.email
              ? `Write here or mail ${profile.email}. I read every note and reply by email.`
              : "Send a note and I’ll get back to you by email."}
          </p>
          <div className="mt-6 flex flex-col gap-2 text-sm">
            {profile?.email ? (
              <a
                href={`mailto:${profile.email}`}
                data-cursor="invert"
                className="inline-flex items-center gap-2 text-muted hover:text-foreground"
              >
                <Mail className="h-4 w-4 text-accent" />
                {profile.email}
              </a>
            ) : null}
            {profile?.phone ? (
              <a
                href={`tel:${profile.phone.replace(/\s+/g, "")}`}
                data-cursor="invert"
                className="inline-flex items-center gap-2 text-muted hover:text-foreground"
              >
                <Phone className="h-4 w-4 text-accent" />
                {profile.phone}
              </a>
            ) : null}
          </div>
          {socials.length ? (
            <ul className="mt-8 flex flex-wrap gap-2">
              {socials.map((social) => {
                const href = itemHref(social.url);
                const label = socialLabel(social.platform);
                return (
                  <li key={social.platform}>
                    <a
                      href={href || social.url}
                      target="_blank"
                      rel="noreferrer"
                      data-cursor="invert"
                      className="glass inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm ring-1 ring-border hover:ring-accent/40"
                    >
                      <SocialIcon name={social.platform} />
                      {label}
                    </a>
                  </li>
                );
              })}
            </ul>
          ) : null}
        </div>

        <form
          onSubmit={onSubmit}
          noValidate
          className="glass relative overflow-hidden rounded-[2rem] p-6 ring-1 ring-border sm:p-8"
        >
          <div className="absolute inset-x-0 top-0 h-1 bg-accent" aria-hidden />
          <p className="text-[11px] tracking-[0.28em] text-muted uppercase">Send a message</p>
          <p className="mt-2 text-sm text-muted">I’ll reply to the email you leave below.</p>
          <input type="text" name="company_website" className="hidden" tabIndex={-1} autoComplete="off" />
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                autoComplete="name"
                value={values.name}
                onChange={(event) => setField("name", event.target.value)}
                onBlur={(event) => validateField("name", event.target.value)}
                aria-invalid={Boolean(errors.name)}
                className={cn(errors.name && "ring-2 ring-accent")}
              />
              {errors.name ? <p className="text-xs text-accent">{errors.name}</p> : null}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                inputMode="email"
                autoComplete="email"
                value={values.email}
                onChange={(event) => setField("email", event.target.value)}
                onBlur={(event) => validateField("email", event.target.value)}
                aria-invalid={Boolean(errors.email)}
                placeholder="you@studio.com"
                className={cn(errors.email && "ring-2 ring-accent")}
              />
              {errors.email ? <p className="text-xs text-accent">{errors.email}</p> : null}
            </div>
          </div>
          <div className="mt-4 space-y-1.5">
            <div className="flex items-baseline justify-between gap-3">
              <Label htmlFor="message">Message</Label>
              <span className={cn("text-[11px] text-muted", remaining < 0 && "text-accent")}>
                {remaining.toLocaleString()} left
              </span>
            </div>
            <Textarea
              id="message"
              name="message"
              rows={6}
              value={values.message}
              onChange={(event) => setField("message", event.target.value)}
              onBlur={(event) => validateField("message", event.target.value)}
              aria-invalid={Boolean(errors.message)}
              placeholder="What are you working on?"
              className={cn("min-h-36", errors.message && "ring-2 ring-accent")}
            />
            {errors.message ? <p className="text-xs text-accent">{errors.message}</p> : null}
          </div>
          <Button type="submit" className="mt-6 w-full sm:w-auto" disabled={status === "sending"} data-cursor="invert">
            {status === "sending" ? "Sending…" : "Send message"}
          </Button>
          {formError ? <p className="mt-3 text-sm text-accent">{formError}</p> : null}
        </form>
      </div>

      <Dialog open={successOpen} onOpenChange={setSuccessOpen}>
        <DialogContent className="w-[min(480px,calc(100%-2rem))] p-6 sm:p-8">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/12 text-accent">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <DialogTitle className="font-display mt-4 pr-8 text-3xl tracking-tight">Message received</DialogTitle>
          <DialogDescription className="mt-3 space-y-3 text-sm leading-6 text-muted">
            <span className="block">
              I’ve got your note and I’ll get back to you as soon as I can
              {successEmail ? (
                <>
                  {" "}
                  at <span className="text-foreground">{successEmail}</span>
                </>
              ) : null}
              .
            </span>
            <span className="block">I’ll reply by email as soon as I can.</span>
            <span className="block">Thanks for writing.</span>
          </DialogDescription>
          <div className="mt-6 flex justify-end">
            <Button type="button" onClick={() => setSuccessOpen(false)} data-cursor="invert">
              Got it
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </SectionBand>
  );
}
