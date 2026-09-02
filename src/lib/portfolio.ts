import { dbConnect, hasMongoUri } from "@/lib/db";
import { ensureSeeded } from "@/lib/seed";
import { serialize } from "@/lib/utils";
import {
  Affiliation,
  Certificate,
  Education,
  Experience,
  Profile,
  Project,
  Section,
  Skill,
  Training,
} from "@/models";
import type { ItemCollection } from "@/lib/constants";
import type { PortfolioData, ProjectDoc } from "@/types";

const empty: Omit<PortfolioData, "dbReady"> = {
  profile: null,
  sections: [],
  experience: [],
  education: [],
  affiliations: [],
  certificates: [],
  trainings: [],
  projects: [],
  skills: [],
};

export async function getPortfolio(): Promise<PortfolioData> {
  if (!hasMongoUri()) {
    return { ...empty, dbReady: false, error: "MONGODB_URI is not set" };
  }

  try {
    await dbConnect();
    await ensureSeeded();

    const published = { published: { $ne: false } };

    const [
      profile,
      sections,
      experience,
      education,
      affiliations,
      certificates,
      trainings,
      projects,
      skills,
    ] = await Promise.all([
      Profile.findOne().lean(),
      Section.find({ visible: true }).sort({ order: 1 }).lean(),
      Experience.find(published).sort({ order: 1, createdAt: -1 }).lean(),
      Education.find(published).sort({ order: 1, createdAt: -1 }).lean(),
      Affiliation.find(published).sort({ order: 1, createdAt: -1 }).lean(),
      Certificate.find(published).sort({ order: 1, createdAt: -1 }).lean(),
      Training.find(published).sort({ order: 1, createdAt: -1 }).lean(),
      Project.find(published).sort({ order: 1, createdAt: -1 }).lean(),
      Skill.find(published).sort({ order: 1, createdAt: -1 }).lean(),
    ]);

    return serialize({
      profile,
      sections,
      experience,
      education,
      affiliations,
      certificates,
      trainings,
      projects,
      skills,
      dbReady: true,
    }) as unknown as PortfolioData;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Database error";
    return { ...empty, dbReady: false, error: message };
  }
}

export async function getProjectBySlug(slug: string): Promise<ProjectDoc | null> {
  if (!hasMongoUri()) return null;
  await dbConnect();
  const project = await Project.findOne({ slug, published: { $ne: false } }).lean();
  return project ? (serialize(project) as unknown as ProjectDoc) : null;
}

export async function getAdminCounts(): Promise<Record<ItemCollection, number>> {
  await dbConnect();
  await ensureSeeded();
  const [experience, education, affiliations, certificates, trainings, projects, skills] =
    await Promise.all([
      Experience.countDocuments(),
      Education.countDocuments(),
      Affiliation.countDocuments(),
      Certificate.countDocuments(),
      Training.countDocuments(),
      Project.countDocuments(),
      Skill.countDocuments(),
    ]);
  return { experience, education, affiliations, certificates, trainings, projects, skills };
}
