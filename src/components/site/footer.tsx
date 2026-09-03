import type { ProfileDoc } from "@/types";

export function SiteFooter({ profile }: { profile: ProfileDoc | null }) {
  return (
    <footer className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20 lg:pr-28">
      <p data-cursor="invert" className="font-display text-3xl tracking-tight">
        {profile?.name || "Romenick Garcia"}
      </p>
      <p className="mt-2 text-sm text-muted">
        © {new Date().getUTCFullYear()} · {profile?.title || "Software Engineer"}
      </p>
      {profile?.resumeUrl ? (
        <div className="mt-6 text-sm text-muted">
          <a href={profile.resumeUrl} data-cursor="invert" className="hover:text-foreground">
            Resume
          </a>
        </div>
      ) : null}
    </footer>
  );
}
