import { MediaFrame } from "@/components/site/media-frame";
import { MarkdownBody } from "@/components/site/markdown-body";
import { MediaReveal, Reveal, SectionBand } from "@/lib/motion";
import type { SectionDoc } from "@/types";

export function CustomSection({ section, index }: { section: SectionDoc; index: string }) {
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
    </SectionBand>
  );
}
