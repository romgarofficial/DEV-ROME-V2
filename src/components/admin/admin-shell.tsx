"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Award,
  Briefcase,
  FolderGit2,
  GraduationCap,
  KeyRound,
  LayoutDashboard,
  LayoutList,
  Layers3,
  LogOut,
  Sparkles,
  UserRound,
  Users,
  BookOpen,
} from "lucide-react";
import type { ReactNode } from "react";
import { Toaster } from "sonner";
import { AmbientStage } from "@/components/site/ambient-stage";
import { BrandMark } from "@/components/site/brand-mark";
import { ThemeToggle } from "@/components/site/theme-toggle";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/profile", label: "Profile", icon: UserRound },
  { href: "/admin/account", label: "Account", icon: KeyRound },
  { href: "/admin/sections", label: "Sections", icon: Layers3 },
  { href: "/admin/experience", label: "Experience", icon: Briefcase },
  { href: "/admin/education", label: "Education", icon: GraduationCap },
  { href: "/admin/affiliations", label: "Affiliations", icon: Users },
  { href: "/admin/certificates", label: "Certificates", icon: Award },
  { href: "/admin/trainings", label: "Trainings", icon: BookOpen },
  { href: "/admin/projects", label: "Projects", icon: FolderGit2 },
  { href: "/admin/skills", label: "Skills", icon: Sparkles },
];

export function AdminShell({
  email,
  name,
  customNav = [],
  children,
}: {
  email: string;
  name?: string;
  customNav?: { key: string; label: string }[];
  children: ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.replace("/admin/login");
    router.refresh();
  }

  return (
    <div className="relative min-h-svh text-foreground">
      <AmbientStage />
      <div className="relative z-10 lg:grid lg:grid-cols-[16.5rem_1fr]">
        <aside className="px-4 py-5 sm:px-6 lg:sticky lg:top-0 lg:h-svh lg:overflow-y-auto lg:px-5 lg:py-8">
          <div className="flex items-start justify-between gap-3 lg:block">
            <div>
              <BrandMark href="/admin" />
              <p className="mt-1 text-[11px] tracking-[0.22em] text-muted uppercase">Admin</p>
              {name ? <p className="mt-2 truncate text-sm">{name}</p> : null}
              <p className={`truncate text-xs text-muted ${name ? "mt-0.5" : "mt-2"}`}>{email}</p>
            </div>
            <ThemeToggle className="lg:mt-5" />
          </div>
          <nav className="mt-6 grid grid-cols-2 gap-1 sm:grid-cols-3 lg:grid-cols-1">
            {NAV.map((item) => {
              const active = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "relative flex items-center gap-2 rounded-full px-3 py-2.5 text-sm text-muted transition-colors hover:text-foreground",
                    active && "text-accent",
                  )}
                >
                  {active ? <span className="sidenav-active" /> : null}
                  <Icon className="relative z-[1] h-4 w-4" />
                  <span className="relative z-[1]">{item.label}</span>
                </Link>
              );
            })}
            {customNav.length ? (
              <p className="col-span-full mt-3 px-3 text-[10px] tracking-[0.18em] text-muted uppercase">
                Custom
              </p>
            ) : null}
            {customNav.map((item) => {
              const href = `/admin/custom/${item.key}`;
              const active = pathname === href;
              return (
                <Link
                  key={item.key}
                  href={href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "relative flex items-center gap-2 rounded-full px-3 py-2.5 text-sm text-muted transition-colors hover:text-foreground",
                    active && "text-accent",
                  )}
                >
                  {active ? <span className="sidenav-active" /> : null}
                  <LayoutList className="relative z-[1] h-4 w-4 shrink-0" />
                  <span className="relative z-[1] truncate">{item.label}</span>
                </Link>
              );
            })}
          </nav>
          <Button variant="ghost" size="sm" className="mt-6 rounded-full" onClick={logout}>
            <LogOut className="h-4 w-4" />
            Log out
          </Button>
        </aside>
        <main className="px-4 py-8 sm:px-8 lg:px-12 lg:py-12">{children}</main>
      </div>
      <Toaster richColors />
    </div>
  );
}
