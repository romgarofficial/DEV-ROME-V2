import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function serialize<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

export function formatDateRange(
  start?: string | null,
  end?: string | null,
  current?: boolean,
) {
  const startLabel = formatDate(start);
  if (current) return startLabel ? `${startLabel} — Present` : "Present";
  const endLabel = formatDate(end);
  if (startLabel && endLabel) return startLabel === endLabel ? startLabel : `${startLabel} — ${endLabel}`;
  return startLabel || endLabel || "";
}

export function formatDate(value?: string | null) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}

export function idOf(item: { _id?: unknown; id?: unknown }) {
  return String(item._id ?? item.id ?? "");
}
