import path from "path";

export function uploadDir() {
  return path.join(process.cwd(), "uploads");
}
