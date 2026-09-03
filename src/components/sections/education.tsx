import { ExternalLink } from "lucide-react";
import { MediaFrame } from "@/components/site/media-frame";
import { MediaReveal, Reveal, SectionBand } from "@/lib/motion";
import { itemHref } from "@/lib/item-href";
import { formatDateRange } from "@/lib/utils";
import type { EducationDoc } from "@/types";

export function EducationSection({
  items,
  index,
}: {
  items: EducationDoc[];
  index: string;
  align?: "start" | "end";
}) {
  if (!items.length) return null;

  return (
    <SectionBand id="education" index={index} kicker="Education" title="Schools">
      <div className="space-y-8">
        {items.map((item, i) => {
          const href = itemHref(item.url);
          const school = item.organization || item.title;
          const logo = (
            <MediaFrame
              src={item.imageUrl}
              alt={school}
              label="School"
              className="aspect-[4/3] w-full"
              sizes="220px"
            />
          );

          return (
            <Reveal key={item._id} delay={i * 0.06}>
              <article className="grid min-w-0 items-start gap-5 sm:gap-6 md:grid-cols-[13rem_1fr]">
                <MediaReveal>
                  {href ? (
                    <a
                      href={href}
                      target="_blank"
                      rel="noreferrer"
                      data-cursor="invert"
                      aria-label={`Visit ${school}`}
                      className="block rounded-3xl transition-opacity hover:opacity-90"
                    >
                      {logo}
                    </a>
                  ) : (
                    logo
                  )}
                </MediaReveal>
                <div>
                  <h3 className="text-lg">{item.title}</h3>
                  <p className="mt-1 text-sm text-muted">
                    {[item.degree, item.field, item.organization].filter(Boolean).join(" · ")}
                  </p>
                  <p className="mt-2 text-[11px] tracking-[0.18em] text-muted uppercase">
                    {formatDateRange(item.startDate, item.endDate, item.current)}
                  </p>
                  {item.description ? <p className="mt-3 text-sm leading-7 text-foreground/80">{item.description}</p> : null}
                  {href ? (
                    <a
                      href={href}
                      target="_blank"
                      rel="noreferrer"
                      data-cursor="invert"
                      className="mt-4 inline-flex h-9 items-center gap-1.5 rounded-full bg-foreground/8 px-3.5 text-xs font-medium hover:bg-foreground/12"
                    >
                      Website
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  ) : null}
                </div>
              </article>
            </Reveal>
          );
        })}
      </div>
    </SectionBand>
  );
}
