import { ExternalLink } from "lucide-react";
import { MediaFrame } from "@/components/site/media-frame";
import { MediaReveal, Reveal, SectionBand } from "@/lib/motion";
import { itemHref } from "@/lib/item-href";
import { formatDateRange } from "@/lib/utils";
import type { TrainingDoc } from "@/types";

export function TrainingsSection({
  items,
  index,
}: {
  items: TrainingDoc[];
  index: string;
  align?: "start" | "end";
}) {
  if (!items.length) return null;

  return (
    <SectionBand id="trainings" index={index} kicker="Trainings" title="Courses">
      <ul className="grid gap-6 sm:grid-cols-2">
        {items.map((item, i) => {
          const href = itemHref(item.url);
          const training = item.organization || item.title;
          const image = (
            <MediaFrame
              src={item.imageUrl}
              alt={training}
              label="Training"
              fit="contain"
              className="aspect-[16/10] w-full rounded-none ring-0 bg-white"
              sizes="(min-width: 640px) 40vw, 100vw"
            />
          );

          return (
            <Reveal key={item._id} delay={i * 0.05} className="h-full">
              <li className="flex h-full flex-col overflow-hidden rounded-3xl ring-1 ring-border">
                <MediaReveal>
                  {href ? (
                    <a
                      href={href}
                      target="_blank"
                      rel="noreferrer"
                      data-cursor="invert"
                      aria-label={`Visit ${training}`}
                      className="block transition-opacity hover:opacity-90"
                    >
                      {image}
                    </a>
                  ) : (
                    image
                  )}
                </MediaReveal>
                <div className="flex-1 p-4">
                  <h3 className="font-medium">{item.title}</h3>
                  <p className="text-sm text-muted">{item.provider}</p>
                  <p className="mt-1 text-[11px] tracking-[0.16em] text-muted uppercase">
                    {formatDateRange(item.startDate, item.endDate)}
                    {item.hours ? ` · ${item.hours}h` : ""}
                  </p>
                  {href ? (
                    <a
                      href={href}
                      target="_blank"
                      rel="noreferrer"
                      data-cursor="invert"
                      className="mt-3 inline-flex h-8 items-center gap-1.5 rounded-full bg-foreground/8 px-3 text-xs font-medium hover:bg-foreground/12"
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
