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
  Mail,
  Menu,
  Sparkles,
  UserRound,
  Users,
  BookOpen,
  X,
} from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { Toaster } from "sonner";
import { AmbientStage } from "@/components/site/ambient-stage";
import { BrandMark } from "@/components/site/brand-mark";
import { ThemeToggle } from "@/components/site/theme-toggle";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/profile", label: "Profile", icon: UserRound },
  { href: "/admin/contact", label: "Contact", icon: Mail },
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

function activeLabel(pathname: string, customNav: { key: string; label: string }[]) {
  if (pathname.startsWith("/admin/custom/")) {
    const key = pathname.slice("/admin/custom/".length);
    return customNav.find((item) => item.key === key)?.label ?? "Custom";
  }
  return NAV.find((item) => item.href === pathname)?.label ?? "Admin";
}

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
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
  }, [open]);

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.replace("/admin/login");
    router.refresh();
  }

  return (
    <div className="relative min-h-svh text-foreground">
      <AmbientStage />
      <div className="relative z-10 lg:grid lg:grid-cols-[16.5rem_1fr]">
        <header className="nav-glass sticky top-0 z-50 flex h-14 items-center justify-between gap-3 px-4 sm:px-6 lg:hidden">
          <div className="flex min-w-0 items-baseline gap-2">
            <BrandMark href="/admin" />
            <p className="truncate text-xs text-muted">{activeLabel(pathname, customNav)}</p>
          </div>
          <div className="flex shrink-0 items-center gap-1.5">
            <ThemeToggle className="h-10 w-10" />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              aria-controls="admin-nav"
              onClick={() => setOpen((current) => !current)}
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </header>

        {open ? (
          <button
            type="button"
            tabIndex={-1}
            aria-hidden
            className="fixed inset-x-0 top-14 bottom-0 z-40 bg-black/70 lg:hidden"
            onClick={() => setOpen(false)}
          />
        ) : null}

        <aside
          id="admin-nav"
          className={cn(
            "fixed top-14 bottom-0 left-0 z-50 flex w-[min(20rem,calc(100%-2.75rem))] flex-col overflow-y-auto px-5 py-6 transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] lg:sticky lg:top-0 lg:bottom-auto lg:z-10 lg:h-svh lg:w-auto lg:translate-x-0 lg:px-5 lg:py-8",
            "bg-[color-mix(in_oklab,var(--card)_92%,transparent)] shadow-2xl ring-1 ring-border backdrop-blur-xl lg:bg-transparent lg:shadow-none lg:ring-0 lg:backdrop-blur-none",
            open ? "translate-x-0" : "pointer-events-none -translate-x-full lg:pointer-events-auto",
          )}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <BrandMark href="/admin" className="hidden lg:inline-block" />
              <p className="text-[11px] tracking-[0.22em] text-muted uppercase lg:mt-1">Admin</p>
              {name ? <p className="mt-2 truncate text-sm">{name}</p> : null}
              <p className={`truncate text-xs text-muted ${name ? "mt-0.5" : "mt-2"}`}>{email}</p>
            </div>
            <ThemeToggle className="hidden lg:grid" />
          </div>

          <nav className="mt-6 grid grid-cols-1 gap-1">
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
                  <Icon className="relative z-[1] h-4 w-4 shrink-0" />
                  <span className="relative z-[1]">{item.label}</span>
                </Link>
              );
            })}
            {customNav.length ? (
              <p className="mt-3 px-3 text-[10px] tracking-[0.18em] text-muted uppercase">Custom</p>
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
          <Button variant="ghost" size="sm" className="mt-auto pt-6 rounded-full" onClick={logout}>
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
