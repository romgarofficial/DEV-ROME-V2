import { MediaFrame } from "@/components/site/media-frame";
import { MediaReveal, Reveal, SectionBand } from "@/lib/motion";
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
        {items.map((item, i) => (
          <Reveal key={item._id} delay={i * 0.06}>
            <article className="grid min-w-0 items-start gap-5 sm:gap-6 md:grid-cols-[13rem_1fr]">
              <MediaReveal>
                <MediaFrame
                  src={item.imageUrl}
                  alt={item.organization || item.title}
                  label="School"
                  className="aspect-[4/3] w-full"
                  sizes="220px"
                />
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
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </SectionBand>
  );
}
