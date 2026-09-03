"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input, Label } from "@/components/ui/fields";
import { PageHeading } from "@/components/ui/page-heading";

export function AccountForm({
  initial,
}: {
  initial: { email: string; name: string };
}) {
  const router = useRouter();
  const [name, setName] = useState(initial.name);
  const [email, setEmail] = useState(initial.email);
  const [savedEmail, setSavedEmail] = useState(initial.email);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [saving, setSaving] = useState(false);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    const nextName = name.trim();
    const nextEmail = email.trim().toLowerCase();
    if (!nextName) {
      toast.error("Name is required");
      return;
    }
    if (!nextEmail) {
      toast.error("Email is required");
      return;
    }
    if (newPassword && newPassword.length < 8) {
      toast.error("New password must be at least 8 characters");
      return;
    }
    if (newPassword && newPassword !== confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }
    const emailChanged = nextEmail !== savedEmail;
    if ((emailChanged || newPassword) && !currentPassword) {
      toast.error("Enter your current password to change email or password");
      return;
    }

    setSaving(true);
    const res = await fetch("/api/auth/account", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: nextName,
        email: nextEmail,
        currentPassword,
        newPassword,
      }),
    });
    const data = await res.json().catch(() => ({}));
    setSaving(false);
    if (!res.ok) {
      toast.error(data.error || "Could not update account");
      return;
    }

    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    if (typeof data.email === "string") {
      setEmail(data.email);
      setSavedEmail(data.email);
    }
    if (typeof data.name === "string") setName(data.name);
    toast.success("Account updated");
    router.refresh();
  }

  return (
    <div className="space-y-6">
      <PageHeading
        kicker="Admin"
        title="Account"
        description="This is your login for the dashboard. It is separate from the public profile email on the site."
      />
      <Card className="max-w-xl p-6 sm:p-8">
        <form onSubmit={onSubmit} className="grid gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="admin-name">Name</Label>
            <Input
              id="admin-name"
              autoComplete="name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="admin-email">Login email</Label>
            <Input
              id="admin-email"
              type="email"
              autoComplete="username"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="admin-current-password">Current password</Label>
            <Input
              id="admin-current-password"
              type="password"
              autoComplete="current-password"
              value={currentPassword}
              onChange={(event) => setCurrentPassword(event.target.value)}
            />
            <p className="text-xs text-muted">Required only when changing email or password.</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="admin-new-password">New password</Label>
              <Input
                id="admin-new-password"
                type="password"
                autoComplete="new-password"
                value={newPassword}
                onChange={(event) => setNewPassword(event.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="admin-confirm-password">Confirm password</Label>
              <Input
                id="admin-confirm-password"
                type="password"
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
              />
            </div>
          </div>
          <p className="text-xs text-muted">Leave the new password blank to keep the current one. Minimum 8 characters.</p>
          <div className="mt-2 flex justify-end">
            <Button type="submit" disabled={saving}>
              {saving ? "Saving…" : "Save account"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
