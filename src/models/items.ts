import { Schema } from "mongoose";
import { getModel } from "@/lib/model";

const itemFields = {
  title: { type: String, required: true },
  organization: { type: String, default: "" },
  location: { type: String, default: "" },
  startDate: { type: String, default: "" },
  endDate: { type: String, default: "" },
  current: { type: Boolean, default: false },
  description: { type: String, default: "" },
  url: { type: String, default: "" },
  imageUrl: { type: String, default: "" },
  featured: { type: Boolean, default: false },
  published: { type: Boolean, default: true },
  order: { type: Number, default: 0 },
};

export type ExperienceRecord = {
  title: string;
  organization: string;
  role: string;
  location: string;
  employmentType: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
  highlights: string[];
  url: string;
  imageUrl: string;
  featured: boolean;
  published: boolean;
  order: number;
};

const ExperienceSchema = new Schema<ExperienceRecord>(
  {
    ...itemFields,
    role: { type: String, default: "" },
    employmentType: { type: String, default: "Full-time" },
    highlights: { type: [String], default: [] },
  },
  { timestamps: true },
);

export const Experience = getModel<ExperienceRecord>("Experience", ExperienceSchema);

export type EducationRecord = {
  title: string;
  organization: string;
  degree: string;
  field: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
  url: string;
  imageUrl: string;
  featured: boolean;
  published: boolean;
  order: number;
};

const EducationSchema = new Schema<EducationRecord>(
  {
    ...itemFields,
    degree: { type: String, default: "" },
    field: { type: String, default: "" },
  },
  { timestamps: true },
);

export const Education = getModel<EducationRecord>("Education", EducationSchema);

export type AffiliationRecord = {
  title: string;
  organization: string;
  role: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
  url: string;
  imageUrl: string;
  featured: boolean;
  published: boolean;
  order: number;
};

const AffiliationSchema = new Schema<AffiliationRecord>(
  {
    ...itemFields,
    role: { type: String, default: "" },
  },
  { timestamps: true },
);

export const Affiliation = getModel<AffiliationRecord>("Affiliation", AffiliationSchema);

export type CertificateRecord = {
  title: string;
  organization: string;
  issuer: string;
  issueDate: string;
  expiryDate: string;
  credentialId: string;
  credentialUrl: string;
  fileUrl: string;
  description: string;
  imageUrl: string;
  featured: boolean;
  published: boolean;
  order: number;
};

const CertificateSchema = new Schema<CertificateRecord>(
  {
    title: { type: String, required: true },
    organization: { type: String, default: "" },
    issuer: { type: String, default: "" },
    issueDate: { type: String, default: "" },
    expiryDate: { type: String, default: "" },
    credentialId: { type: String, default: "" },
    credentialUrl: { type: String, default: "" },
    fileUrl: { type: String, default: "" },
    description: { type: String, default: "" },
    imageUrl: { type: String, default: "" },
    featured: { type: Boolean, default: false },
    published: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true },
);

export const Certificate = getModel<CertificateRecord>("Certificate", CertificateSchema);

export type TrainingRecord = {
  title: string;
  organization: string;
  provider: string;
  startDate: string;
  endDate: string;
  hours: number;
  description: string;
  url: string;
  imageUrl: string;
  featured: boolean;
  published: boolean;
  order: number;
};

const TrainingSchema = new Schema<TrainingRecord>(
  {
    ...itemFields,
    provider: { type: String, default: "" },
    hours: { type: Number, default: 0 },
  },
  { timestamps: true },
);

export const Training = getModel<TrainingRecord>("Training", TrainingSchema);

export type ProjectRecord = {
  title: string;
  slug: string;
  summary: string;
  description: string;
  stack: string[];
  repoUrl: string;
  liveUrl: string;
  coverUrl: string;
  images: string[];
  featured: boolean;
  published: boolean;
  order: number;
};

const ProjectSchema = new Schema<ProjectRecord>(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    summary: { type: String, default: "" },
    description: { type: String, default: "" },
    stack: { type: [String], default: [] },
    repoUrl: { type: String, default: "" },
    liveUrl: { type: String, default: "" },
    coverUrl: { type: String, default: "" },
    images: { type: [String], default: [] },
    featured: { type: Boolean, default: false },
    published: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true },
);

export const Project = getModel<ProjectRecord>("Project", ProjectSchema);

export type SkillRecord = {
  name: string;
  category: "language" | "framework" | "database" | "tool" | "other";
  level: "familiar" | "proficient" | "expert";
  iconKey: string;
  featured: boolean;
  published: boolean;
  order: number;
};

const SkillSchema = new Schema<SkillRecord>(
  {
    name: { type: String, required: true },
    category: {
      type: String,
      enum: ["language", "framework", "database", "tool", "other"],
      default: "other",
    },
    level: {
      type: String,
      enum: ["familiar", "proficient", "expert"],
      default: "proficient",
    },
    iconKey: { type: String, default: "" },
    featured: { type: Boolean, default: false },
    published: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true },
);

export const Skill = getModel<SkillRecord>("Skill", SkillSchema);
