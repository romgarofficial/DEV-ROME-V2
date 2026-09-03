import * as simpleIcons from "simple-icons";
import type { SimpleIcon } from "simple-icons";

const bySlug = new Map<string, SimpleIcon>();

function isIcon(value: unknown): value is SimpleIcon {
  return Boolean(value && typeof value === "object" && "slug" in value && "path" in value);
}

function indexIcons() {
  if (bySlug.size) return;
  for (const value of Object.values(simpleIcons)) {
    if (isIcon(value)) bySlug.set(value.slug, value);
  }
}

export function getSimpleIcon(slug?: string | null): SimpleIcon | null {
  if (!slug) return null;
  indexIcons();
  const needle = slug.toLowerCase().replace(/[^a-z0-9]/g, "");
  return bySlug.get(needle) ?? bySlug.get(slug.toLowerCase().replace(/\s+/g, "")) ?? null;
}
