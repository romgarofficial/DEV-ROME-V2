import type { ItemCollection, SectionKey } from "@/lib/constants";

export type { ItemCollection, SectionKey };

export type SocialLink = {
  platform: string;
  url: string;
};

export type ProfileDoc = {
  _id: string;
  name: string;
  title: string;
  headline: string;
  bio: string;
  photoUrl: string;
  backgroundUrl?: string;
  location: string;
  email: string;
  phone: string;
  socials: SocialLink[];
  resumeUrl: string;
  seoTitle: string;
  seoDescription: string;
  ogImageUrl: string;
  availableForWork: boolean;
};

export type SectionKind = "system" | "custom";

export type SectionDoc = {
  _id: string;
  key: string;
  label: string;
  visible: boolean;
  order: number;
  kind?: SectionKind;
  kicker?: string;
  heading?: string;
  body?: string;
  imageUrl?: string;
  imageAlt?: string;
};

export type ItemBase = {
  _id: string;
  title: string;
  organization?: string;
  location?: string;
  startDate?: string;
  endDate?: string;
  current?: boolean;
  description?: string;
  url?: string;
  imageUrl?: string;
  featured?: boolean;
  published?: boolean;
  order: number;
};

export type ExperienceDoc = ItemBase & {
  role?: string;
  employmentType?: string;
  highlights?: string[];
};

export type EducationDoc = ItemBase & {
  degree?: string;
  field?: string;
};

export type AffiliationDoc = ItemBase & {
  role?: string;
};

export type CertificateDoc = ItemBase & {
  issuer?: string;
  issueDate?: string;
  expiryDate?: string;
  credentialId?: string;
  credentialUrl?: string;
  fileUrl?: string;
};

export type TrainingDoc = ItemBase & {
  provider?: string;
  hours?: number;
};

export type ProjectDoc = ItemBase & {
  slug: string;
  summary?: string;
  stack?: string[];
  repoUrl?: string;
  liveUrl?: string;
  coverUrl?: string;
  images?: string[];
};

export type SkillDoc = {
  _id: string;
  name: string;
  category: "language" | "framework" | "database" | "tool" | "other";
  level: "familiar" | "proficient" | "expert";
  iconKey?: string;
  featured?: boolean;
  published?: boolean;
  order: number;
};

export type PortfolioData = {
  profile: ProfileDoc | null;
  sections: SectionDoc[];
  experience: ExperienceDoc[];
  education: EducationDoc[];
  affiliations: AffiliationDoc[];
  certificates: CertificateDoc[];
  trainings: TrainingDoc[];
  projects: ProjectDoc[];
  skills: SkillDoc[];
  dbReady: boolean;
  error?: string;
};

export type FieldType =
  | "text"
  | "textarea"
  | "markdown"
  | "url"
  | "date"
  | "checkbox"
  | "number"
  | "tags"
  | "image"
  | "gallery"
  | "select";

export type FieldDef = {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  placeholder?: string;
  options?: { value: string; label: string }[];
};

export type CollectionConfig = {
  key: ItemCollection;
  title: string;
  singular: string;
  description: string;
  fields: FieldDef[];
};
