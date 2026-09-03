"use client";

import { Eye, EyeOff, Check } from "lucide-react";
import { useMemo, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input, Label } from "@/components/ui/fields";
import { PageHeading } from "@/components/ui/page-heading";
import {
  PASSWORD_RULES,
  passwordMeetsRequirements,
  passwordStrength,
  unmetPasswordRules,
} from "@/lib/password";
import { cn } from "@/lib/utils";

export function AccountForm({
  initial,
}: {
  initial: { email: string; name: string };
}) {
  const router = useRouter();
  const [name, setName] = useState(initial.name);
  const [email, setEmail] = useState(initial.email);
  const [savedEmail, setSavedEmail] = useState(initial.email);
  const [identityPassword, setIdentityPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [savingIdentity, setSavingIdentity] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  const emailChanged = email.trim().toLowerCase() !== savedEmail;
  const strength = useMemo(() => passwordStrength(newPassword), [newPassword]);
  const started = newPassword.length > 0;
  const matches = confirmPassword.length > 0 && newPassword === confirmPassword;
  const differentFromCurrent = currentPassword.length > 0 && newPassword !== currentPassword;
  const passwordReady =
    passwordMeetsRequirements(newPassword) &&
    matches &&
    differentFromCurrent &&
    currentPassword.length > 0;

  async function saveIdentity(event: FormEvent) {
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
    if (emailChanged && !identityPassword) {
      toast.error("Enter your current password to change email");
      return;
    }

    setSavingIdentity(true);
    const res = await fetch("/api/auth/account", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: nextName,
        email: nextEmail,
        currentPassword: identityPassword,
      }),
    });
    const data = await res.json().catch(() => ({}));
    setSavingIdentity(false);
    if (!res.ok) {
      toast.error(data.error || "Could not update account");
      return;
    }
    setIdentityPassword("");
    if (typeof data.email === "string") {
      setEmail(data.email);
      setSavedEmail(data.email);
    }
    if (typeof data.name === "string") setName(data.name);
    toast.success("Login details saved");
    router.refresh();
  }

  async function savePassword(event: FormEvent) {
    event.preventDefault();
    const unmet = unmetPasswordRules(newPassword);
    if (unmet.length) {
      toast.error(`Password needs: ${unmet[0]?.label.toLowerCase()}`);
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }
    if (newPassword === currentPassword) {
      toast.error("New password must be different from the current password");
      return;
    }

    setSavingPassword(true);
    const res = await fetch("/api/auth/account", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        currentPassword,
        newPassword,
      }),
    });
    const data = await res.json().catch(() => ({}));
    setSavingPassword(false);
    if (!res.ok) {
      toast.error(data.error || "Could not update password");
      return;
    }
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    toast.success("Password updated");
    router.refresh();
  }

  return (
    <div className="space-y-6">
      <PageHeading
        kicker="Admin"
        title="Account"
        description="Dashboard login only. The public profile email on the site is separate."
      />
      <div className="grid items-start gap-6 xl:grid-cols-2">
        <Card className="p-6 sm:p-8">
          <p className="text-[11px] tracking-[0.2em] text-muted uppercase">Login</p>
          <h2 className="font-display mt-1 text-2xl tracking-tight">Details</h2>
          <p className="mt-1 text-sm text-muted">Name and email used to sign in to admin.</p>
          <form onSubmit={saveIdentity} className="mt-6 grid gap-4">
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
            {emailChanged ? (
              <PasswordField
                id="admin-identity-password"
                label="Current password"
                autoComplete="current-password"
                value={identityPassword}
                onChange={setIdentityPassword}
                hint="Required to change your login email."
              />
            ) : null}
            <div className="mt-2 flex justify-end">
              <Button type="submit" disabled={savingIdentity}>
                {savingIdentity ? "Saving…" : "Save details"}
              </Button>
            </div>
          </form>
        </Card>

        <Card className="p-6 sm:p-8">
          <p className="text-[11px] tracking-[0.2em] text-muted uppercase">Security</p>
          <h2 className="font-display mt-1 text-2xl tracking-tight">Password</h2>
          <p className="mt-1 text-sm text-muted">Leave this blank if you only want to update your name or email.</p>
          <form onSubmit={savePassword} className="mt-6 grid gap-4">
            <PasswordField
              id="admin-current-password"
              label="Current password"
              autoComplete="current-password"
              value={currentPassword}
              onChange={setCurrentPassword}
            />
            <PasswordField
              id="admin-new-password"
              label="New password"
              autoComplete="new-password"
              value={newPassword}
              onChange={setNewPassword}
              describedBy="password-rules"
            />
            <PasswordField
              id="admin-confirm-password"
              label="Confirm new password"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={setConfirmPassword}
            />
            {confirmPassword && !matches ? (
              <p className="-mt-2 text-xs text-accent">Passwords do not match yet.</p>
            ) : null}

            <div id="password-rules" className="rounded-2xl bg-foreground/[0.04] p-4">
              <div className="flex items-center justify-between gap-3">
                <p className="text-[11px] tracking-[0.16em] text-muted uppercase">Requirements</p>
                {started && strength.label ? (
                  <p className={cn("text-xs font-medium", strength.score >= 4 ? "text-accent" : "text-muted")}>
                    {strength.label}
                  </p>
                ) : null}
              </div>
              <div className="mt-2.5 grid grid-cols-5 gap-1" aria-hidden>
                {PASSWORD_RULES.map((rule, index) => (
                  <span
                    key={rule.id}
                    className={cn(
                      "h-1 rounded-full transition-colors",
                      started && index < strength.score ? "bg-accent" : "bg-foreground/10",
                    )}
                  />
                ))}
              </div>
              <ul className="mt-3 grid gap-1.5">
                {PASSWORD_RULES.map((rule) => (
                  <RequirementRow key={rule.id} ok={started && rule.test(newPassword)} label={rule.label} />
                ))}
                <RequirementRow ok={matches} label="Passwords match" />
                <RequirementRow ok={differentFromCurrent} label="Different from current password" />
              </ul>
            </div>

            <div className="mt-2 flex justify-end">
              <Button type="submit" disabled={savingPassword || !passwordReady}>
                {savingPassword ? "Updating…" : "Update password"}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}

function RequirementRow({ ok, label }: { ok: boolean; label: string }) {
  return (
    <li className="flex items-center gap-2 text-sm">
      <span
        className={cn(
          "flex h-5 w-5 shrink-0 items-center justify-center rounded-full transition-colors",
          ok ? "bg-accent text-accent-fg" : "bg-foreground/8 text-muted",
        )}
      >
        {ok ? <Check className="h-3 w-3" strokeWidth={3} /> : <span className="h-1.5 w-1.5 rounded-full bg-current opacity-50" />}
      </span>
      <span className={ok ? "text-foreground" : "text-muted"}>{label}</span>
    </li>
  );
}

function PasswordField({
  id,
  label,
  value,
  onChange,
  autoComplete,
  hint,
  describedBy,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  autoComplete: string;
  hint?: string;
  describedBy?: string;
}) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>{label}</Label>
      <div className="relative">
        <Input
          id={id}
          type={visible ? "text" : "password"}
          autoComplete={autoComplete}
          value={value}
          aria-describedby={describedBy}
          className="pr-12"
          onChange={(event) => onChange(event.target.value)}
        />
        <button
          type="button"
          className="absolute top-1/2 right-1.5 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-muted transition-colors hover:bg-foreground/8 hover:text-foreground"
          aria-label={visible ? `Hide ${label.toLowerCase()}` : `Show ${label.toLowerCase()}`}
          onClick={() => setVisible((current) => !current)}
        >
          {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
      {hint ? <p className="text-xs text-muted">{hint}</p> : null}
    </div>
  );
}
