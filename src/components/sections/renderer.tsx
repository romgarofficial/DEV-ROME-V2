import { AboutSection } from "@/components/sections/about";
import { AffiliationsSection } from "@/components/sections/affiliations";
import { CertificatesSection } from "@/components/sections/certificates";
import { ContactForm } from "@/components/sections/contact";
import { CustomSection } from "@/components/sections/custom";
import { EducationSection } from "@/components/sections/education";
import { ExperienceSection } from "@/components/sections/experience";
import { HeroSection } from "@/components/sections/hero";
import { ProjectsSection } from "@/components/sections/projects";
import { SkillsSection } from "@/components/sections/skills";
import { TrainingsSection } from "@/components/sections/trainings";
import { isCustomSection, isSystemSectionKey } from "@/lib/constants";
import type { PortfolioData, SectionDoc } from "@/types";

function pad(n: number) {
  return String(n).padStart(2, "0");
}

export function SectionRenderer({ data }: { data: PortfolioData }) {
  const body = data.sections.filter((section) => section.key !== "hero");
  const indexes = Object.fromEntries(body.map((section, i) => [section.key, pad(i + 1)]));

  function renderBody(section: SectionDoc, index: string) {
    if (isCustomSection(section) || !isSystemSectionKey(section.key)) {
      return <CustomSection section={section} index={index} />;
    }

    switch (section.key) {
      case "about":
        return <AboutSection profile={data.profile} index={index} />;
      case "experience":
        return <ExperienceSection items={data.experience} index={index} />;
      case "education":
        return <EducationSection items={data.education} index={index} />;
      case "affiliations":
        return <AffiliationsSection items={data.affiliations} index={index} />;
      case "certificates":
        return <CertificatesSection items={data.certificates} index={index} />;
      case "trainings":
        return <TrainingsSection items={data.trainings} index={index} />;
      case "projects":
        return <ProjectsSection items={data.projects} index={index} />;
      case "skills":
        return <SkillsSection items={data.skills} index={index} />;
      case "contact":
        return <ContactForm profile={data.profile} index={index} />;
      case "hero":
        return null;
      default:
        return <CustomSection section={section} index={index} />;
    }
  }

  return (
    <>
      {data.sections.some((section) => section.key === "hero") ? (
        <HeroSection profile={data.profile} skills={data.skills} nextId={body[0]?.key} />
      ) : null}
      {body.map((section) => (
        <div key={section._id || section.key}>{renderBody(section, indexes[section.key] ?? "01")}</div>
      ))}
    </>
  );
}
