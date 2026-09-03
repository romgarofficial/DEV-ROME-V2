import { MediaReveal, Reveal, SectionBand } from "@/lib/motion";
import { TrainingCard } from "@/components/sections/training-card";
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
          <Reveal key={item._id} delay={i * 0.05} className="h-full">
            <li className="h-full">
              <MediaReveal className="h-full">
                <TrainingCard item={item} />
              </MediaReveal>
            </li>
          </Reveal>
        ))}
      </ul>
    </SectionBand>
  );
}
