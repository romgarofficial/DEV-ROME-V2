"use client";

import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { SocialPickerDialog } from "@/components/admin/social-picker";
import { SocialIcon } from "@/components/site/social-icon";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input, Label } from "@/components/ui/fields";
import { PageHeading } from "@/components/ui/page-heading";
import { findSocialPlatform, socialLabel } from "@/lib/social-platforms";
import type { ProfileDoc, SocialLink } from "@/types";

export function ContactAdminForm({ initial }: { initial: ProfileDoc | null }) {
  const router = useRouter();
  const [email, setEmail] = useState(initial?.email ?? "");
  const [phone, setPhone] = useState(initial?.phone ?? "");
  const [socials, setSocials] = useState<SocialLink[]>(initial?.socials ?? []);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  function updateSocial(index: number, patch: Partial<SocialLink>) {
    setSocials((current) => current.map((item, i) => (i === index ? { ...item, ...patch } : item)));
  }

  async function save() {
    setSaving(true);
    const res = await fetch("/api/profile/contact", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, phone, socials }),
    });
    const data = await res.json().catch(() => ({}));
    setSaving(false);
    if (!res.ok) {
      toast.error(data.error || "Could not save contact");
      return;
    }
    if (Array.isArray(data.profile?.socials)) setSocials(data.profile.socials);
    if (typeof data.profile?.email === "string") setEmail(data.profile.email);
    if (typeof data.profile?.phone === "string") setPhone(data.profile.phone);
    toast.success("Contact saved");
    router.refresh();
  }

  return (
    <div className="space-y-6">
      <PageHeading
        kicker="Site"
        title="Contact"
        description="Public email, phone, and social links. They show in the contact section — not the footer."
      />
      <Card className="grid max-w-3xl gap-6 p-6 sm:p-8">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="contact-email">Email</Label>
            <Input
              id="contact-email"
              type="email"
              value={email}
              placeholder="hello@you.com"
              onChange={(event) => setEmail(event.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="contact-phone">Phone</Label>
            <Input
              id="contact-phone"
              type="tel"
              value={phone}
              placeholder="+63…"
              onChange={(event) => setPhone(event.target.value)}
            />
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-sm font-medium text-foreground/80">Socials</p>
              <p className="text-xs text-muted">Choose a platform, then add your profile URL.</p>
            </div>
            <Button type="button" variant="outline" size="sm" onClick={() => setPickerOpen(true)}>
              <Plus className="h-4 w-4" />
              Add platform
            </Button>
          </div>

          {socials.length ? (
            <ul className="grid gap-2">
              {socials.map((social, index) => {
                const platform = findSocialPlatform(social.platform);
                const label = socialLabel(social.platform);
                return (
                  <li
                    key={`${social.platform}-${index}`}
                    className="grid gap-2 rounded-2xl bg-foreground/[0.04] p-2 sm:grid-cols-[minmax(9rem,12rem)_minmax(0,1fr)_auto] sm:items-center"
                  >
                    <div className="flex items-center gap-2 px-2 py-1.5">
                      <span className="grid h-8 w-8 place-items-center rounded-xl bg-background ring-1 ring-border">
                        <SocialIcon name={social.platform} />
                      </span>
                      <span className="truncate text-sm">{label}</span>
                    </div>
                    <Input
                      value={social.url}
                      placeholder={platform?.placeholder || "https://"}
                      onChange={(event) => updateSocial(index, { url: event.target.value })}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      aria-label={`Remove ${label}`}
                      onClick={() => setSocials((current) => current.filter((_, i) => i !== index))}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="rounded-2xl bg-foreground/[0.04] px-4 py-6 text-sm text-muted">
              No socials yet. Add GitHub, LinkedIn, Instagram, and the rest from the picker.
            </p>
          )}
        </div>

        <div className="flex justify-end">
          <Button type="button" onClick={save} disabled={saving}>
            {saving ? "Saving…" : "Save contact"}
          </Button>
        </div>
      </Card>

      <SocialPickerDialog
        open={pickerOpen}
        usedSlugs={socials.map((item) => item.platform)}
        onOpenChange={setPickerOpen}
        onSelect={(platform) => {
          setSocials((current) => [...current, { platform: platform.slug, url: "" }]);
        }}
      />
    </div>
  );
}
