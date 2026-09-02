import { Mail, MapPin } from "lucide-react";
import { Reveal, SectionBand } from "@/lib/motion";
import type { ProfileDoc } from "@/types";

export function AboutSection({
  profile,
  index,
}: {
  profile: ProfileDoc | null;
  index: string;
  align?: "start" | "end";
}) {
  if (!profile?.bio) return null;

  return (
    <SectionBand id="about" index={index} kicker="About" title="A short note">
      <Reveal>
        <p className="max-w-3xl text-lg leading-8 text-foreground/85">{profile.bio}</p>
        <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted">
          {profile.location ? (
            <p className="inline-flex items-center gap-2">
              <MapPin className="h-4 w-4 text-accent" />
              {profile.location}
            </p>
          ) : null}
          {profile.email ? (
            <a href={`mailto:${profile.email}`} data-cursor="invert" className="inline-flex items-center gap-2 hover:text-foreground">
              <Mail className="h-4 w-4 text-accent" />
              {profile.email}
            </a>
          ) : null}
        </div>
      </Reveal>
    </SectionBand>
  );
}
