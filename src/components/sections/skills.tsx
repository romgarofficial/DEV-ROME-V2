import { Reveal, SectionBand } from "@/lib/motion";
import { getSimpleIcon } from "@/lib/simple-icon";
import type { SkillDoc } from "@/types";

export function SkillsSection({
  items,
  index,
}: {
  items: SkillDoc[];
  index: string;
  align?: "start" | "end";
}) {
  if (!items.length) return null;

  const grouped = items.reduce<Record<string, SkillDoc[]>>((acc, skill) => {
    const key = skill.category || "other";
    acc[key] ??= [];
    acc[key].push(skill);
    return acc;
  }, {});

  return (
    <SectionBand id="skills" index={index} kicker="Skills" title="Tools I reach for">
      <div className="space-y-10">
        {Object.entries(grouped).map(([category, skills], i) => (
          <Reveal key={category} delay={i * 0.05}>
            <p className="text-[11px] tracking-[0.22em] text-muted uppercase">{category}</p>
            <ul className="mt-3 flex flex-wrap gap-2">
              {skills.map((skill) => {
                const icon = getSimpleIcon(skill.iconKey || skill.name);
                return (
                  <li
                    key={skill._id}
                    data-cursor="invert"
                    className="glass inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm ring-1 ring-border"
                  >
                    {icon ? (
                      <svg role="img" viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-current" aria-hidden>
                        <path d={icon.path} />
                      </svg>
                    ) : null}
                    {skill.name}
                  </li>
                );
              })}
            </ul>
          </Reveal>
        ))}
      </div>
    </SectionBand>
  );
}
