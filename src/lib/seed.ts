import bcrypt from "bcryptjs";
import { DEFAULT_SECTIONS } from "@/lib/constants";
import { dbConnect } from "@/lib/db";
import {
  Affiliation,
  Certificate,
  ContactMessage,
  Education,
  Experience,
  Profile,
  Project,
  Section,
  Skill,
  Training,
  User,
} from "@/models";

export async function migrateSections() {
  await Section.collection.updateMany(
    { $or: [{ kind: { $exists: false } }, { kind: null }, { kind: "" }] },
    { $set: { kind: "system" } },
  );
}

export async function ensureSeeded() {
  await dbConnect();
  await migrateSections();
  const existing = await User.countDocuments();
  if (existing > 0) {
    const sectionCount = await Section.countDocuments();
    if (sectionCount === 0) {
      await Section.insertMany(DEFAULT_SECTIONS);
    }
    const profileCount = await Profile.countDocuments();
    if (profileCount === 0) {
      await Profile.create(defaultProfile());
    } else {
      await Profile.updateOne(
        { name: "Romenick" },
        { $set: { name: "Romenick Garcia", seoTitle: "Romenick Garcia — Software Engineer" } },
      );
    }
    return;
  }
  await seedAll();
}

export async function seedAll(force = false) {
  await dbConnect();

  if (force) {
    await Promise.all([
      User.deleteMany({}),
      Profile.deleteMany({}),
      Section.deleteMany({}),
      Experience.deleteMany({}),
      Education.deleteMany({}),
      Affiliation.deleteMany({}),
      Certificate.deleteMany({}),
      Training.deleteMany({}),
      Project.deleteMany({}),
      Skill.deleteMany({}),
      ContactMessage.deleteMany({}),
    ]);
  }

  const email = (process.env.ADMIN_EMAIL || "admin@example.com").toLowerCase();
  const password = process.env.ADMIN_PASSWORD || "changeme123";
  const passwordHash = await bcrypt.hash(password, 12);

  await User.findOneAndUpdate(
    { email },
    { email, passwordHash, name: "Romenick", role: "admin" },
    { upsert: true, new: true },
  );

  await Profile.findOneAndUpdate({}, defaultProfile(), { upsert: true, new: true, setDefaultsOnInsert: true });

  const sectionCount = await Section.countDocuments();
  if (sectionCount === 0 || force) {
    if (force) await Section.deleteMany({});
    await Section.insertMany(DEFAULT_SECTIONS);
  } else {
    await migrateSections();
  }

  if ((await Experience.countDocuments()) === 0 || force) {
    if (force) await Experience.deleteMany({});
    await Experience.insertMany([
      {
        title: "Software Engineer",
        organization: "Independent / Client work",
        role: "Software Engineer",
        employmentType: "Full-time",
        location: "Remote",
        startDate: "2022-01-01",
        current: true,
        description:
          "Design and ship full-stack web applications with the MERN stack — from data models and APIs to production UI.",
        highlights: [
          "Owned end-to-end features across MongoDB, Express/Node, and React",
          "Built authenticated dashboards with CRUD, uploads, and role-aware access",
          "Shipped accessible, performant interfaces instead of static brochure pages",
        ],
        featured: true,
        published: true,
        order: 0,
      },
    ]);
  }

  if ((await Education.countDocuments()) === 0 || force) {
    if (force) await Education.deleteMany({});
    await Education.insertMany([
      {
        title: "Bachelor of Science in Information Technology",
        organization: "Your University",
        degree: "B.S.",
        field: "Information Technology",
        location: "Philippines",
        startDate: "2018-06-01",
        endDate: "2022-04-01",
        description: "Replace this with your actual school, program, and notable coursework.",
        published: true,
        order: 0,
      },
    ]);
  }

  if ((await Affiliation.countDocuments()) === 0 || force) {
    if (force) await Affiliation.deleteMany({});
    await Affiliation.insertMany([
      {
        title: "Professional organization",
        organization: "Add your affiliation",
        role: "Member",
        current: true,
        description: "IEEE, ACM, local developer guilds — edit or hide this section from admin.",
        published: true,
        order: 0,
      },
    ]);
  }

  if ((await Certificate.countDocuments()) === 0 || force) {
    if (force) await Certificate.deleteMany({});
    await Certificate.insertMany([
      {
        title: "Sample certificate",
        issuer: "Issuer name",
        issueDate: "2024-01-01",
        credentialId: "ABC-123",
        description: "Upload the real badge and credential URL from the admin dashboard.",
        published: true,
        order: 0,
      },
    ]);
  }

  if ((await Training.countDocuments()) === 0 || force) {
    if (force) await Training.deleteMany({});
    await Training.insertMany([
      {
        title: "Advanced full-stack workshop",
        provider: "Training provider",
        startDate: "2024-03-01",
        hours: 40,
        description: "Replace with a course you actually completed — or hide the Trainings section.",
        published: true,
        order: 0,
      },
    ]);
  }

  if ((await Project.countDocuments()) === 0 || force) {
    if (force) await Project.deleteMany({});
    await Project.insertMany([
      {
        title: "Dynamic developer portfolio",
        slug: "dynamic-developer-portfolio",
        summary:
          "A MERN-shaped portfolio with a custom admin, Mongo-backed sections, and server-rendered pages.",
        description: `This site is the case study.

## What it is
A professional portfolio you control from \`/admin\`: education, affiliations, certificates, trainings, projects, and skills are documents — not hardcoded JSX.

## Stack
Next.js, React, MongoDB, Mongoose, Tailwind, Motion, Lenis.
`,
        stack: ["Next.js", "React", "MongoDB", "Mongoose", "Tailwind"],
        repoUrl: "",
        liveUrl: "",
        featured: true,
        published: true,
        order: 0,
      },
    ]);
  }

  if ((await Skill.countDocuments()) === 0 || force) {
    if (force) await Skill.deleteMany({});
    await Skill.insertMany([
      { name: "MongoDB", category: "database", level: "expert", iconKey: "mongodb", featured: true, published: true, order: 0 },
      { name: "Express", category: "framework", level: "expert", iconKey: "express", featured: true, published: true, order: 1 },
      { name: "React", category: "framework", level: "expert", iconKey: "react", featured: true, published: true, order: 2 },
      { name: "Node.js", category: "language", level: "expert", iconKey: "nodedotjs", featured: true, published: true, order: 3 },
      { name: "Next.js", category: "framework", level: "proficient", iconKey: "nextdotjs", featured: true, published: true, order: 4 },
      { name: "TypeScript", category: "language", level: "proficient", iconKey: "typescript", featured: true, published: true, order: 5 },
      { name: "Tailwind CSS", category: "framework", level: "proficient", iconKey: "tailwindcss", published: true, order: 6 },
      { name: "Git", category: "tool", level: "proficient", iconKey: "git", published: true, order: 7 },
    ]);
  }
}

function defaultProfile() {
  return {
    name: "Romenick Garcia",
    title: "Software Engineer",
    headline: "MERN engineer building products you can actually operate.",
    bio: "I design and ship full-stack applications with MongoDB, Express/Node, and React. This portfolio is driven by a custom admin — education, affiliations, certificates, trainings, and projects are content I own, not a static template.",
    photoUrl: "",
    backgroundUrl: "",
    location: "Philippines",
    email: process.env.ADMIN_EMAIL || "hello@example.com",
    phone: "",
    socials: [
      { platform: "GitHub", url: "https://github.com" },
      { platform: "LinkedIn", url: "https://linkedin.com" },
    ],
    resumeUrl: "",
    seoTitle: "Romenick Garcia — Software Engineer",
    seoDescription:
      "Professional developer portfolio. MERN stack, dynamic content, and a custom admin for education, certificates, projects, and more.",
    ogImageUrl: "",
    availableForWork: true,
  };
}
