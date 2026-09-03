import { CustomItemCard } from "@/components/sections/custom-item-card";
import { MediaFrame } from "@/components/site/media-frame";
import { MarkdownBody } from "@/components/site/markdown-body";
import { MediaReveal, Reveal, SectionBand } from "@/lib/motion";
import type { CustomItemDoc, SectionDoc } from "@/types";

export function CustomSection({
  section,
  index,
  items = [],
}: {
  section: SectionDoc;
  index: string;
  items?: CustomItemDoc[];
}) {
  const title = section.heading?.trim() || section.label;
  const kicker = section.kicker?.trim() || section.label;
  const image = section.imageUrl?.trim();
  const body = section.body?.trim();

  return (
    <SectionBand id={section.key} index={index} kicker={kicker} title={title}>
      {image && body ? (
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-start">
          <MediaReveal>
            <MediaFrame
              src={image}
              alt={section.imageAlt || title}
              label={title}
              className="aspect-[16/9] w-full"
              sizes="(min-width: 1024px) 50vw, 100vw"
            />
          </MediaReveal>
          <Reveal>
            <MarkdownBody>{body}</MarkdownBody>
          </Reveal>
        </div>
      ) : image ? (
        <MediaReveal>
          <MediaFrame
            src={image}
            alt={section.imageAlt || title}
            label={title}
            className="aspect-[16/9] w-full"
            sizes="100vw"
          />
        </MediaReveal>
      ) : body ? (
        <Reveal>
          <MarkdownBody>{body}</MarkdownBody>
        </Reveal>
      ) : null}

      {items.length ? (
        <ul className={`grid gap-6 sm:grid-cols-2 ${image || body ? "mt-10" : ""}`}>
          {items.map((item, i) => (
            <Reveal key={item._id} delay={i * 0.05} className="h-full">
              <li className="h-full">
                <MediaReveal className="h-full">
                  <CustomItemCard item={item} />
                </MediaReveal>
              </li>
            </Reveal>
          ))}
        </ul>
      ) : null}
    </SectionBand>
  );
}
