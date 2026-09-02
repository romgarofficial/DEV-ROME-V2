import * as simpleIcons from "simple-icons";
import type { SimpleIcon } from "simple-icons";

function isIcon(value: unknown): value is SimpleIcon {
  return Boolean(value && typeof value === "object" && "slug" in value && "path" in value);
}

export function getSimpleIcon(slug?: string | null): SimpleIcon | null {
  if (!slug) return null;
  const needle = slug.toLowerCase().replace(/\s+/g, "");
  for (const value of Object.values(simpleIcons)) {
    if (isIcon(value) && value.slug === needle) return value;
  }
  return null;
}
