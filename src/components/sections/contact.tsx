"use client";

import { Mail, Phone } from "lucide-react";
import { useState, type FormEvent } from "react";
import { SocialIcon } from "@/components/site/social-icon";
import { Button } from "@/components/ui/button";
import { Input, Label, Textarea } from "@/components/ui/fields";
import { itemHref } from "@/lib/item-href";
import { SectionBand } from "@/lib/motion";
import { socialLabel } from "@/lib/social-platforms";
import type { ProfileDoc } from "@/types";

export function ContactForm({
  profile,
  index,
}: {
  profile: ProfileDoc | null;
  index: string;
  align?: "start" | "end";
}) {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState("");
  const socials = (profile?.socials ?? []).filter((social) => social.platform && social.url);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    setStatus("sending");
    setError("");
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) {
      setStatus("error");
      setError(json.error || "Could not send");
      return;
    }
    setStatus("sent");
    form.reset();
  }

  return (
    <SectionBand id="contact" index={index} kicker="Contact" title="Let’s talk">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-start">
        <div>
          <p className="text-muted">
            {profile?.email ? `Write here or mail ${profile.email}.` : "Send a note and I’ll get back to you."}
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

        <form onSubmit={onSubmit} className="glass space-y-4 rounded-3xl p-6 ring-1 ring-border">
          <input type="text" name="company_website" className="hidden" tabIndex={-1} autoComplete="off" />
          <div className="space-y-1.5">
            <Label htmlFor="name">Name</Label>
            <Input id="name" name="name" required />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" required />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="message">Message</Label>
            <Textarea id="message" name="message" required minLength={10} />
          </div>
          <Button type="submit" disabled={status === "sending"} data-cursor="invert">
            {status === "sending" ? "Sending…" : status === "sent" ? "Sent" : "Send message"}
          </Button>
          {error ? <p className="text-sm text-red-400">{error}</p> : null}
        </form>
      </div>
    </SectionBand>
  );
}
