import { ContactAdminForm } from "@/components/admin/contact-form";
import { dbConnect } from "@/lib/db";
import { serialize } from "@/lib/utils";
import { Profile } from "@/models";
import type { ProfileDoc } from "@/types";

export const dynamic = "force-dynamic";

export default async function ContactAdminPage() {
  await dbConnect();
  const profile = serialize((await Profile.findOne().lean()) as ProfileDoc | null);
  return <ContactAdminForm initial={profile} />;
}
