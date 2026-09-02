import { MediaFrame } from "@/components/site/media-frame";
import { MediaReveal, Reveal, SectionBand } from "@/lib/motion";
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
        {items.map((item, i) => (
          <Reveal key={item._id} delay={i * 0.05}>
            <li className="overflow-hidden rounded-3xl ring-1 ring-border">
              <MediaReveal>
                <MediaFrame
                  src={item.imageUrl}
                  alt={item.title}
                  label="Training"
                  className="aspect-[16/10] w-full rounded-none ring-0"
                  sizes="(min-width: 640px) 40vw, 100vw"
                />
              </MediaReveal>
              <div className="p-4">
                <h3 className="font-medium">{item.title}</h3>
                <p className="text-sm text-muted">{item.provider}</p>
                <p className="mt-1 text-[11px] tracking-[0.16em] text-muted uppercase">
                  {formatDateRange(item.startDate, item.endDate)}
                  {item.hours ? ` · ${item.hours}h` : ""}
                </p>
              </div>
            </li>
          </Reveal>
        ))}
      </ul>
    </SectionBand>
  );
}
