import { ExternalLink } from "lucide-react";
import { MediaFrame } from "@/components/site/media-frame";
import { MediaReveal, Reveal, SectionBand } from "@/lib/motion";
import { itemHref } from "@/lib/item-href";
import { formatDateRange } from "@/lib/utils";
import type { AffiliationDoc } from "@/types";

export function AffiliationsSection({
  items,
  index,
}: {
  items: AffiliationDoc[];
  index: string;
  align?: "start" | "end";
}) {
  if (!items.length) return null;

  return (
    <SectionBand id="affiliations" index={index} kicker="Affiliations" title="Communities">
      <ul className="grid gap-6 sm:grid-cols-2">
        {items.map((item, i) => {
          const href = itemHref(item.url);
          const org = item.organization || item.title;
          const logo = (
            <MediaFrame
              src={item.imageUrl}
              alt={org}
              label="Org"
              className="h-16 w-16 rounded-2xl"
              sizes="64px"
            />
          );

          return (
            <Reveal key={item._id} delay={i * 0.05}>
              <li className="glass flex gap-4 rounded-3xl p-4 ring-1 ring-border">
                <MediaReveal className="shrink-0">
                  {href ? (
                    <a
                      href={href}
                      target="_blank"
                      rel="noreferrer"
                      data-cursor="invert"
                      aria-label={`Visit ${org}`}
                      className="block rounded-2xl transition-opacity hover:opacity-90"
                    >
                      {logo}
                    </a>
                  ) : (
                    logo
                  )}
                </MediaReveal>
                <div>
                  <h3 className="font-medium">{item.title}</h3>
                  <p className="text-sm text-muted">{item.role}</p>
                  <p className="mt-1 text-[11px] tracking-[0.16em] text-muted uppercase">
                    {formatDateRange(item.startDate, item.endDate, item.current)}
                  </p>
                  {href ? (
                    <a
                      href={href}
                      target="_blank"
                      rel="noreferrer"
                      data-cursor="invert"
                      className="mt-2 inline-flex h-8 items-center gap-1.5 rounded-full bg-foreground/8 px-3 text-xs font-medium hover:bg-foreground/12"
                    >
                      Website
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  ) : null}
                </div>
              </li>
            </Reveal>
          );
        })}
      </ul>
    </SectionBand>
  );
}
