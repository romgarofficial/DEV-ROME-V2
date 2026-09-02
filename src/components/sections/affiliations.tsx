import { MediaFrame } from "@/components/site/media-frame";
import { MediaReveal, Reveal, SectionBand } from "@/lib/motion";
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
        {items.map((item, i) => (
          <Reveal key={item._id} delay={i * 0.05}>
            <li className="glass flex gap-4 rounded-3xl p-4 ring-1 ring-border">
              <MediaReveal className="shrink-0">
                <MediaFrame
                  src={item.imageUrl}
                  alt={item.title}
                  label="Org"
                  className="h-16 w-16 rounded-2xl"
                  sizes="64px"
                />
              </MediaReveal>
              <div>
                <h3 className="font-medium">{item.title}</h3>
                <p className="text-sm text-muted">{item.role}</p>
                <p className="mt-1 text-[11px] tracking-[0.16em] text-muted uppercase">
                  {formatDateRange(item.startDate, item.endDate, item.current)}
                </p>
              </div>
            </li>
          </Reveal>
        ))}
      </ul>
    </SectionBand>
  );
}
