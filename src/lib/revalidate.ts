import { revalidatePath } from "next/cache";

export async function revalidatePortfolio() {
  revalidatePath("/");
  revalidatePath("/projects", "layout");
  revalidatePath("/admin", "layout");
}
