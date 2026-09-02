import { HeroCover } from "@/components/site/hero-cover";
import type { ProfileDoc } from "@/types";

export function ProfileLivePreview({
  profile,
}: {
  profile: Partial<ProfileDoc>;
}) {
  const photo = profile.photoUrl;
  const cover = profile.backgroundUrl;

  return (
    <div className="space-y-3">
      <div>
        <p className="text-[11px] tracking-[0.28em] text-muted uppercase">Live sneak peek</p>
        <p className="mt-1 text-sm text-muted">How the hero reads on the public site.</p>
      </div>
      <div className="relative isolate overflow-hidden rounded-3xl bg-background ring-1 ring-border">
        {cover ? <HeroCover src={cover} /> : null}
        <div
          className={
            cover
              ? "hero-copy relative grid gap-6 rounded-2xl p-4 sm:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] sm:items-center sm:p-5"
              : "relative grid gap-6 p-5 sm:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] sm:items-center sm:p-6"
          }
        >
          <div className="min-w-0">
            <p className="text-[10px] tracking-[0.28em] text-muted uppercase">
              {profile.availableForWork ? "Available for work" : "Currently booked"}
            </p>
            <p className="font-display mt-3 text-[1.65rem] leading-[1.05] tracking-tight sm:text-3xl">
              {profile.name || "Your name"}
            </p>
            <p className="mt-2 text-sm text-muted">{profile.title || "Your title"}</p>
            {profile.headline ? (
              <p className="mt-4 line-clamp-3 text-sm leading-6 text-foreground/80">{profile.headline}</p>
            ) : null}
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <span className="inline-flex h-9 items-center rounded-full bg-foreground px-4 text-xs font-medium text-background">
                See the work
              </span>
              {profile.location ? <span className="text-xs text-muted">{profile.location}</span> : null}
            </div>
          </div>
          <div className="relative mx-auto w-full max-w-[11.5rem]">
            {!cover ? <div className="media-ph absolute top-3 left-3 hidden aspect-[4/5] w-full rounded-2xl opacity-40 sm:block" /> : null}
            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl ring-1 ring-border">
              {photo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={photo} alt="" className="absolute inset-0 h-full w-full object-cover" />
              ) : (
                <div className="media-ph absolute inset-0 grid place-items-center">
                  <p className="text-[11px] text-muted">Portrait</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
