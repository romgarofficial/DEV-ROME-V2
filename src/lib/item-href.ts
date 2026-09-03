/**
 * Normalise an optional URL string into a full href, or return empty string.
 * Shared across all public section components so logos/images are clickable
 * whenever the admin has entered a URL for the item.
 */
export function itemHref(url?: string): string {
  const value = url?.trim();
  if (!value) return "";
  if (/^https?:\/\//i.test(value)) return value;
  return `https://${value}`;
}

export function isPdfUrl(url?: string) {
  const value = url?.trim() || "";
  if (!value) return false;
  return /\.pdf($|\?)/i.test(value) || value.includes("/raw/upload/");
}

export function fileLabelFromUrl(url?: string) {
  const value = url?.trim() || "";
  if (!value) return "PDF";
  try {
    const name = decodeURIComponent(new URL(value, "http://local.invalid").pathname.split("/").pop() || "");
    return name || "PDF";
  } catch {
    return "PDF";
  }
}
