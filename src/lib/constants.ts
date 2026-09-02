export const COOKIE_NAME = "rome_admin";
export const JWT_EXPIRES = "7d";

export const SECTION_KEYS = [
  "hero",
  "about",
  "experience",
  "education",
  "affiliations",
  "certificates",
  "trainings",
  "projects",
  "skills",
  "contact",
] as const;

export type SectionKey = (typeof SECTION_KEYS)[number];

export function isSystemSectionKey(key: string): key is SectionKey {
  return (SECTION_KEYS as readonly string[]).includes(key);
}

export function isCustomSection(section: { kind?: string; key: string }) {
  if (section.kind === "custom") return true;
  if (section.kind === "system") return false;
  return !isSystemSectionKey(section.key);
}

export const DEFAULT_SECTIONS: {
  key: SectionKey;
  label: string;
  order: number;
  visible: boolean;
  kind: "system";
}[] = [
  { key: "hero", label: "Hero", order: 0, visible: true, kind: "system" },
  { key: "about", label: "About", order: 1, visible: true, kind: "system" },
  { key: "experience", label: "Experience", order: 2, visible: true, kind: "system" },
  { key: "education", label: "Education", order: 3, visible: true, kind: "system" },
  { key: "affiliations", label: "Affiliations", order: 4, visible: true, kind: "system" },
  { key: "certificates", label: "Certificates", order: 5, visible: true, kind: "system" },
  { key: "trainings", label: "Trainings", order: 6, visible: true, kind: "system" },
  { key: "projects", label: "Projects", order: 7, visible: true, kind: "system" },
  { key: "skills", label: "Skills", order: 8, visible: true, kind: "system" },
  { key: "contact", label: "Contact", order: 9, visible: true, kind: "system" },
];

export const ITEM_COLLECTIONS = [
  "experience",
  "education",
  "affiliations",
  "certificates",
  "trainings",
  "projects",
  "skills",
] as const;

export type ItemCollection = (typeof ITEM_COLLECTIONS)[number];

export const SKILL_CATEGORIES = [
  "language",
  "framework",
  "database",
  "tool",
  "other",
] as const;

export const SKILL_LEVELS = ["familiar", "proficient", "expert"] as const;
