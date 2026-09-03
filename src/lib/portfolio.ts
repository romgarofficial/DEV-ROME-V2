import { isCustomSection, type ItemCollection } from "@/lib/constants";
import { dbConnect, hasMongoUri } from "@/lib/db";
import { ensureSeeded } from "@/lib/seed";
import { serialize } from "@/lib/utils";
import {
  Affiliation,
  Certificate,
  CustomItem,
  Education,
  Experience,
  Profile,
  Project,
  Section,
  Skill,
  Training,
  ContactMessage,
} from "@/models";
import type { CustomItemDoc, PortfolioData, ProjectDoc } from "@/types";

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
  customItems: {},
};

function groupCustomItems(items: CustomItemDoc[]) {
  const grouped: Record<string, CustomItemDoc[]> = {};
  for (const item of items) {
    const key = item.sectionKey;
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(item);
  }
  return grouped;
}

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
      customItemDocs,
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
      CustomItem.find(published).sort({ order: 1, createdAt: -1 }).lean(),
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
      customItems: groupCustomItems(customItemDocs as unknown as CustomItemDoc[]),
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

export async function getCustomAdminNav(): Promise<{ key: string; label: string }[]> {
  if (!hasMongoUri()) return [];
  try {
    await dbConnect();
    await ensureSeeded();
    const sections = await Section.find().sort({ order: 1 }).select("key label kind").lean();
    return serialize(
      sections
        .filter((section) => isCustomSection(section))
        .map((section) => ({ key: section.key, label: section.label })),
    );
  } catch {
    return [];
  }
}

export async function getInboxUnreadCount(): Promise<number> {
  if (!hasMongoUri()) return 0;
  try {
    await dbConnect();
    return ContactMessage.countDocuments({ status: "unread" });
  } catch {
    return 0;
  }
}

export async function getCustomSectionCounts(): Promise<Record<string, number>> {
  if (!hasMongoUri()) return {};
  try {
    await dbConnect();
    const rows = await CustomItem.aggregate<{ _id: string; n: number }>([
      { $group: { _id: "$sectionKey", n: { $sum: 1 } } },
    ]);
    return Object.fromEntries(rows.map((row) => [row._id, row.n]));
  } catch {
    return {};
  }
}
