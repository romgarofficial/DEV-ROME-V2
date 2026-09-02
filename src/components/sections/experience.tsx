import { ExternalLink } from "lucide-react";
import { MediaFrame } from "@/components/site/media-frame";
import { MediaReveal, Reveal, SectionBand } from "@/lib/motion";
import { formatDateRange } from "@/lib/utils";
import type { ExperienceDoc } from "@/types";

function companyHref(url?: string) {
  const value = url?.trim();
  if (!value) return "";
  if (/^https?:\/\//i.test(value)) return value;
  return `https://${value}`;
}

export function ExperienceSection({
  items,
  index,
}: {
  items: ExperienceDoc[];
  index: string;
  align?: "start" | "end";
}) {
  if (!items.length) return null;

  return (
    <SectionBand id="experience" index={index} kicker="Experience" title="Where I’ve built">
      <ol className="space-y-6">
        {items.map((item, i) => {
          const href = companyHref(item.url);
          const company = item.organization || item.title;
          const logo = (
            <MediaFrame
              src={item.imageUrl}
              alt={company}
              label="Company"
              fit="contain"
              className="aspect-square w-full bg-white"
              sizes="120px"
            />
          );

          return (
            <Reveal key={item._id} delay={i * 0.06}>
              <article className="glass grid min-w-0 gap-5 rounded-3xl p-4 ring-1 ring-border sm:p-5 md:grid-cols-[7.5rem_1fr] md:p-6">
                <MediaReveal>
                  {href ? (
                    <a
                      href={href}
                      target="_blank"
                      rel="noreferrer"
                      data-cursor="invert"
                      aria-label={`Visit ${company}`}
                      className="block rounded-3xl transition-opacity hover:opacity-90"
                    >
                      {logo}
                    </a>
                  ) : (
                    logo
                  )}
                </MediaReveal>
                <div>
                  <p className="text-[11px] tracking-[0.2em] text-muted uppercase">
                    {formatDateRange(item.startDate, item.endDate, item.current)}
                  </p>
                  <h3 className="mt-2 text-xl">{item.title}</h3>
                  {item.organization ? <p className="mt-1 text-sm text-muted">{item.organization}</p> : null}
                  {item.location ? <p className="mt-1 text-sm text-muted">{item.location}</p> : null}
                  {item.description ? <p className="mt-3 text-sm leading-7 text-foreground/80">{item.description}</p> : null}
                  {item.highlights?.length ? (
                    <ul className="mt-3 space-y-1 text-sm text-muted">
                      {item.highlights.map((highlight) => (
                        <li key={highlight}>— {highlight}</li>
                      ))}
                    </ul>
                  ) : null}
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
      </ol>
    </SectionBand>
  );
}
