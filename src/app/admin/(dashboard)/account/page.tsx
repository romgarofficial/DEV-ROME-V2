import { redirect } from "next/navigation";
import { AccountForm } from "@/components/admin/account-form";
import { getSession } from "@/lib/auth";
import { dbConnect } from "@/lib/db";
import { User } from "@/models";

export const dynamic = "force-dynamic";

export default async function AccountPage() {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  await dbConnect();
  const user = await User.findById(session.sub).select("email name").lean();
  if (!user) redirect("/admin/login");

  return <AccountForm key={`${user.email}:${user.name}`} initial={{ email: user.email, name: user.name }} />;
}
