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
