import Link from "next/link";
import { MediaFrame } from "@/components/site/media-frame";
import { MediaReveal, Reveal, SectionBand } from "@/lib/motion";
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
        {items.map((item, i) => (
          <Reveal key={item._id} delay={i * 0.07} className={cn(i === 0 && "md:col-span-2")}>
            <Link href={`/projects/${item.slug}`} data-cursor="invert" className="group block">
              <MediaReveal>
                <MediaFrame
                  src={item.coverUrl}
                  alt={item.title}
                  label="Project cover"
                  className={cn("w-full rounded-3xl", i === 0 ? "aspect-[16/10] md:aspect-[16/8]" : "aspect-[16/10]")}
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
          </Reveal>
        ))}
      </div>
    </SectionBand>
  );
}
