import { MediaReveal, Reveal, SectionBand } from "@/lib/motion";
import { CertificateCard } from "@/components/sections/certificate-card";
import type { CertificateDoc } from "@/types";

export function CertificatesSection({
  items,
  index,
}: {
  items: CertificateDoc[];
  index: string;
  align?: "start" | "end";
}) {
  if (!items.length) return null;

  return (
    <SectionBand id="certificates" index={index} kicker="Certificates" title="Credentials">
      <ul className="grid gap-6 sm:grid-cols-2">
        {items.map((item, i) => (
          <Reveal key={item._id} delay={i * 0.05} className="h-full">
            <li className="h-full">
              <MediaReveal className="h-full">
                <CertificateCard item={item} />
              </MediaReveal>
            </li>
          </Reveal>
        ))}
      </ul>
    </SectionBand>
  );
}
