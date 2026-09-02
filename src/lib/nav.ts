import { isCustomSection } from "@/lib/constants";
import type { PortfolioData, SectionDoc } from "@/types";

export function overlaySections(sections: SectionDoc[]) {
  return sections.filter((section) => section.key !== "hero");
}

export function navSections(data: PortfolioData): SectionDoc[] {
  return data.sections.filter((section) => {
    if (isCustomSection(section)) return true;

    switch (section.key) {
      case "hero":
        return Boolean(data.profile);
      case "about":
        return Boolean(data.profile?.bio);
      case "experience":
        return data.experience.length > 0;
      case "education":
        return data.education.length > 0;
      case "affiliations":
        return data.affiliations.length > 0;
      case "certificates":
        return data.certificates.length > 0;
      case "trainings":
        return data.trainings.length > 0;
      case "projects":
        return data.projects.length > 0;
      case "skills":
        return data.skills.length > 0;
      case "contact":
        return true;
      default:
        return true;
    }
  });
}
