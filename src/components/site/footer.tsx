import { SocialIcon } from "@/components/site/social-icon";
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
      <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-muted">
        {profile?.socials?.map((social) => (
          <a
            key={social.platform}
            href={social.url}
            target="_blank"
            rel="noreferrer"
            data-cursor="invert"
            className="inline-flex items-center gap-2 hover:text-foreground"
          >
            <SocialIcon name={social.platform} />
            {social.platform}
          </a>
        ))}
        {profile?.resumeUrl ? (
          <a href={profile.resumeUrl} data-cursor="invert" className="hover:text-foreground">
            Resume
          </a>
        ) : null}
      </div>
    </footer>
  );
}
