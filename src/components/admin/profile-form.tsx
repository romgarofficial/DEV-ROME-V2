"use client";

import { useRef, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { MediaUpload } from "@/components/admin/media-upload";
import { ProfileLivePreview } from "@/components/admin/profile-preview";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input, Label, Textarea } from "@/components/ui/fields";
import { PageHeading } from "@/components/ui/page-heading";
import { Switch } from "@/components/ui/switch";
import type { ProfileDoc, SocialLink } from "@/types";

export function ProfileForm({ initial }: { initial: ProfileDoc | null }) {
  const router = useRouter();
  const [form, setForm] = useState<Partial<ProfileDoc>>({
    name: "",
    title: "",
    headline: "",
    bio: "",
    photoUrl: "",
    backgroundUrl: "",
    location: "",
    email: "",
    phone: "",
    socials: [],
    resumeUrl: "",
    seoTitle: "",
    seoDescription: "",
    availableForWork: true,
    ...initial,
  });
  const formRef = useRef(form);
  formRef.current = form;
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(0);

  function set<K extends keyof ProfileDoc>(key: K, value: ProfileDoc[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  const socials = form.socials ?? [];

  async function save() {
    if (uploading) {
      toast.error("Wait for the image upload to finish");
      return;
    }
    setSaving(true);
    const res = await fetch("/api/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formRef.current),
    });
    const data = await res.json().catch(() => ({}));
    setSaving(false);
    if (!res.ok) {
      toast.error(data.error || "Could not save profile");
      return;
    }
    if (data.profile) setForm(data.profile);
    toast.success("Profile saved");
    router.refresh();
  }

  return (
    <div className="space-y-6">
      <PageHeading
        kicker="Identity"
        title="Profile"
        description="Global identity used by the hero, about, SEO, and contact sections."
      />
      <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(22rem,32rem)]">
        <Card className="grid gap-4 p-6 sm:p-8">
          <Field label="Name">
            <Input value={form.name ?? ""} onChange={(e) => set("name", e.target.value)} />
          </Field>
          <Field label="Title">
            <Input value={form.title ?? ""} onChange={(e) => set("title", e.target.value)} />
          </Field>
          <Field label="Headline">
            <Input value={form.headline ?? ""} onChange={(e) => set("headline", e.target.value)} />
          </Field>
          <Field label="Bio">
            <Textarea value={form.bio ?? ""} onChange={(e) => set("bio", e.target.value)} />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Email">
              <Input value={form.email ?? ""} onChange={(e) => set("email", e.target.value)} />
            </Field>
            <Field label="Phone">
              <Input value={form.phone ?? ""} onChange={(e) => set("phone", e.target.value)} />
            </Field>
            <Field label="Location">
              <Input value={form.location ?? ""} onChange={(e) => set("location", e.target.value)} />
            </Field>
            <Field label="Resume URL">
              <Input value={form.resumeUrl ?? ""} onChange={(e) => set("resumeUrl", e.target.value)} />
            </Field>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <MediaUpload
              label="Portrait"
              hint="Right side of the hero. Choose landscape or square."
              aspect="square"
              aspectSelectable
              value={form.photoUrl}
              onChange={(url) => set("photoUrl", url)}
              onBusyChange={(busy) => setUploading((count) => Math.max(0, count + (busy ? 1 : -1)))}
            />
            <MediaUpload
              label="Background / cover"
              hint="Soft full-bleed behind the hero. Choose landscape or square."
              aspect="cover"
              aspectSelectable
              value={form.backgroundUrl}
              onChange={(url) => set("backgroundUrl", url)}
              onBusyChange={(busy) => setUploading((count) => Math.max(0, count + (busy ? 1 : -1)))}
            />
          </div>
          <Field label="SEO title">
            <Input value={form.seoTitle ?? ""} onChange={(e) => set("seoTitle", e.target.value)} />
          </Field>
          <Field label="SEO description">
            <Textarea value={form.seoDescription ?? ""} onChange={(e) => set("seoDescription", e.target.value)} />
          </Field>
          <label className="flex items-center justify-between">
            <span className="text-sm">Available for work</span>
            <Switch
              checked={Boolean(form.availableForWork)}
              onCheckedChange={(value) => set("availableForWork", value)}
            />
          </label>
          <div className="space-y-3">
            <Label>Socials</Label>
            {socials.map((social, index) => (
              <div key={index} className="grid grid-cols-[1fr_2fr_auto] gap-2">
                <Input
                  placeholder="GitHub"
                  value={social.platform}
                  onChange={(e) => {
                    const next = [...socials];
                    next[index] = { ...next[index], platform: e.target.value };
                    set("socials", next);
                  }}
                />
                <Input
                  placeholder="https://"
                  value={social.url}
                  onChange={(e) => {
                    const next = [...socials];
                    next[index] = { ...next[index], url: e.target.value };
                    set("socials", next);
                  }}
                />
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => set("socials", socials.filter((_, i) => i !== index))}
                >
                  Remove
                </Button>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => set("socials", [...socials, { platform: "", url: "" } as SocialLink])}
            >
              Add social
            </Button>
          </div>
          <div className="flex justify-end">
            <Button onClick={save} disabled={saving || uploading > 0}>
              {uploading > 0 ? "Working…" : saving ? "Saving…" : "Save profile"}
            </Button>
          </div>
        </Card>
        <div className="xl:sticky xl:top-24">
          <Card className="p-5 sm:p-6">
            <ProfileLivePreview profile={form} />
          </Card>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      {children}
    </div>
  );
}
