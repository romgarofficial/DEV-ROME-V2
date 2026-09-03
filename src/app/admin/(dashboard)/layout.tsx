import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { AdminShell } from "@/components/admin/admin-shell";
import { getSession } from "@/lib/auth";
import { getCustomAdminNav } from "@/lib/portfolio";

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
  const customNav = await getCustomAdminNav();

  return (
    <AdminShell email={session.email} customNav={customNav}>
      {children}
    </AdminShell>
  );
}
