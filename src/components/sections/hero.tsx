import { MediaFrame } from "@/components/site/media-frame";
import { HeroCover } from "@/components/site/hero-cover";
import { MediaReveal, Reveal } from "@/lib/motion";
import { cn } from "@/lib/utils";
import type { ProfileDoc, SkillDoc } from "@/types";

export function HeroSection({
  profile,
  skills,
  nextId = "about",
}: {
  profile: ProfileDoc | null;
  skills: SkillDoc[];
  nextId?: string;
}) {
  if (!profile) return null;
  const kit = skills.slice(0, 8).map((skill) => skill.name);

  return (
    <section
      id="hero"
      className="relative isolate flex min-h-[100svh] items-center overflow-hidden px-4 py-24 sm:px-6 md:py-28"
    >
      {profile.backgroundUrl ? <HeroCover src={profile.backgroundUrl} /> : null}
      <div className="relative z-[1] mx-auto w-full max-w-7xl lg:pr-36">
        <div
          className={cn(
            "grid items-center gap-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)] lg:gap-12",
            profile.backgroundUrl && "hero-copy rounded-3xl p-6 sm:p-8 lg:p-10",
          )}
        >
          <div className="min-w-0">
            <Reveal>
              <p className="text-[11px] tracking-[0.28em] text-muted uppercase">
                {profile.availableForWork ? "Available for work" : "Currently booked"}
              </p>
              <h1 className="font-display mt-4 text-[clamp(2.6rem,6.4vw,4.6rem)] leading-[1.05] tracking-tight">
                {profile.name}
              </h1>
              <p className="mt-4 text-lg text-muted sm:mt-5 sm:text-xl">{profile.title}</p>
            </Reveal>
            {profile.headline ? (
              <Reveal delay={0.08}>
                <p className="mt-6 max-w-xl text-base leading-8 text-foreground/80 sm:mt-8 sm:text-lg">{profile.headline}</p>
              </Reveal>
            ) : null}
            <Reveal delay={0.16}>
              <div className="mt-8 flex flex-wrap items-center gap-4 sm:mt-10">
                <a
                  href={`#${nextId}`}
                  data-cursor="invert"
                  className="inline-flex h-12 items-center rounded-full bg-foreground px-6 text-sm font-medium text-background"
                >
                  See the work
                </a>
                {profile.resumeUrl ? (
                  <a href={profile.resumeUrl} data-cursor="invert" className="text-sm text-muted hover:text-foreground">
                    Resume
                  </a>
                ) : null}
                {profile.location ? <span className="text-sm text-muted">{profile.location}</span> : null}
              </div>
            </Reveal>
            {kit.length ? (
              <Reveal delay={0.22}>
                <p className="mt-10 max-w-xl text-xs tracking-[0.18em] text-muted uppercase sm:mt-12">{kit.join("  ·  ")}</p>
              </Reveal>
            ) : null}
          </div>
          <div className="relative mx-auto w-full max-w-md self-center">
            {!profile.backgroundUrl ? (
              <MediaFrame
                alt=""
                label="Background"
                className="absolute top-6 left-6 hidden aspect-[4/5] w-full opacity-40 sm:block"
              />
            ) : null}
            <MediaReveal className="relative">
              <MediaFrame
                src={profile.photoUrl}
                alt={profile.name}
                label="Portrait"
                priority
                className="aspect-[4/5] w-full"
              />
            </MediaReveal>
          </div>
        </div>
      </div>
    </section>
  );
}
