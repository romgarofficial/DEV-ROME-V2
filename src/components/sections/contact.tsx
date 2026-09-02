"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input, Label, Textarea } from "@/components/ui/fields";
import { SectionBand } from "@/lib/motion";
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
      <p className="text-muted">
        {profile?.email ? `Write here or mail ${profile.email}.` : "Send a note and I’ll get back to you."}
      </p>
      <form onSubmit={onSubmit} className="glass mt-8 max-w-xl space-y-4 rounded-3xl p-6 ring-1 ring-border">
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
    </SectionBand>
  );
}
