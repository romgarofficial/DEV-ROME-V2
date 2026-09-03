import { ExternalLink } from "lucide-react";
import Link from "next/link";
import { MediaFrame } from "@/components/site/media-frame";
import { MediaReveal, Reveal, SectionBand } from "@/lib/motion";
import { itemHref } from "@/lib/item-href";
import { cn } from "@/lib/utils";
import type { ProjectDoc } from "@/types";

export function ProjectsSection({
  items,
  index,
}: {
  items: ProjectDoc[];
  index: string;
  align?: "start" | "end";
}) {
  if (!items.length) return null;

  return (
    <SectionBand id="projects" index={index} kicker="Projects" title="Selected work">
      <div className="grid gap-8 md:grid-cols-2">
        {items.map((item, i) => {
          const href = itemHref(item.liveUrl || item.url);
          const thumbs = item.images?.slice(0, 4) ?? [];

          return (
            <Reveal key={item._id} delay={i * 0.07} className={cn("h-full", i === 0 && "md:col-span-2")}>
              <Link href={`/projects/${item.slug}`} data-cursor="invert" className="group block">
                <MediaReveal>
                  <MediaFrame
                    src={item.coverUrl}
                    alt={item.title}
                    label="Project cover"
                    fit="contain"
                    padded={false}
                    className="aspect-[16/9] w-full rounded-3xl bg-black/80"
                    sizes={i === 0 ? "100vw" : "(min-width: 768px) 45vw, 100vw"}
                  />
                </MediaReveal>
                <h3 className="font-display mt-4 text-2xl tracking-tight transition-colors group-hover:text-accent md:text-3xl">
                  {item.title}
                </h3>
                {item.summary ? <p className="mt-2 text-sm leading-7 text-muted">{item.summary}</p> : null}
                {item.stack?.length ? (
                  <p className="mt-3 text-[11px] tracking-[0.16em] text-muted uppercase">{item.stack.join(" · ")}</p>
                ) : null}
              </Link>
              {thumbs.length > 0 ? (
                <div className="mt-3 flex gap-2">
                  {thumbs.map((url, j) => (
                    <Link
                      key={url}
                      href={`/projects/${item.slug}`}
                      className="relative aspect-[16/9] w-16 shrink-0 overflow-hidden rounded-lg bg-black/80 ring-1 ring-border transition-all hover:ring-foreground/30 sm:w-20"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={url} alt={`${item.title} screenshot ${j + 1}`} className="h-full w-full object-contain" />
                    </Link>
                  ))}
                  {(item.images?.length ?? 0) > 4 ? (
                    <Link
                      href={`/projects/${item.slug}`}
                      className="flex aspect-[16/9] w-16 shrink-0 items-center justify-center rounded-lg bg-foreground/5 text-xs text-muted ring-1 ring-border sm:w-20"
                    >
                      +{(item.images?.length ?? 0) - 4}
                    </Link>
                  ) : null}
                </div>
              ) : null}
              {href ? (
                <a
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  data-cursor="invert"
                  className="mt-3 inline-flex h-8 items-center gap-1.5 rounded-full bg-foreground/8 px-3 text-xs font-medium hover:bg-foreground/12"
                  onClick={(e) => e.stopPropagation()}
                >
                  Live site
                  <ExternalLink className="h-3 w-3" />
                </a>
              ) : null}
            </Reveal>
          );
        })}
      </div>
    </SectionBand>
  );
}
