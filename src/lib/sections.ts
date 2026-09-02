import "server-only";
import { z } from "zod";
import { isSystemSectionKey } from "@/lib/constants";
import { slugify } from "@/lib/utils";
import { Section } from "@/models";

export { isCustomSection } from "@/lib/constants";

const optionalText = (max: number) => z.string().trim().max(max).optional();

export const CustomSectionCreateSchema = z.object({
  label: z.string().trim().min(1, "Label is required").max(60),
  kicker: optionalText(80),
  heading: optionalText(120),
  body: z.string().max(20_000).optional(),
  imageUrl: optionalText(2000),
  imageAlt: optionalText(200),
  visible: z.boolean().optional(),
});

export const CustomSectionUpdateSchema = CustomSectionCreateSchema.partial();

export const SystemSectionUpdateSchema = z.object({
  label: z.string().trim().min(1).max(60).optional(),
});

export async function uniqueSectionKey(label: string) {
  const base = slugify(label) || "section";
  const root = isSystemSectionKey(base) ? `${base}-section` : base;
  let candidate = root;
  let n = 2;
  while (await Section.exists({ key: candidate })) {
    candidate = `${root}-${n}`;
    n += 1;
    if (n > 100) throw new Error("Could not allocate a unique section key");
  }
  return candidate;
}
