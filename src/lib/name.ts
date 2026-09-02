export function splitDisplayName(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return { top: parts[0], bottom: parts.slice(1).join(" ") };
  }
  return { top: parts[0] || "ROME", bottom: "" };
}
