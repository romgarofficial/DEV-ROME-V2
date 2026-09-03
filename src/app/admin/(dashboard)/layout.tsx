import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { AdminShell } from "@/components/admin/admin-shell";
import { getSession } from "@/lib/auth";
import { dbConnect } from "@/lib/db";
import { getCustomAdminNav } from "@/lib/portfolio";
import { User } from "@/models";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await getSession();
  if (!session) redirect("/admin/login");
  await dbConnect();
  const [customNav, user] = await Promise.all([
    getCustomAdminNav(),
    User.findById(session.sub).select("email name").lean(),
  ]);

  return (
    <AdminShell email={user?.email || session.email} name={user?.name} customNav={customNav}>
      {children}
    </AdminShell>
  );
}
