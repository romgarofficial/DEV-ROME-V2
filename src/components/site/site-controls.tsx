"use client";

import { LayoutGroup, motion } from "motion/react";
import { useLenis } from "lenis/react";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { SiteHeader } from "@/components/site/site-header";
import type { ProfileDoc, SectionDoc } from "@/types";

function navLabel(item: SectionDoc) {
  return item.key === "hero" ? "Home" : item.label;
}

export function SiteControls({
  profile,
  sections,
}: {
  profile?: ProfileDoc | null;
  sections: SectionDoc[];
}) {
  const lenis = useLenis();
  const pathname = usePathname();
  const onHome = pathname === "/";
  const items = sections;
  const [active, setActive] = useState(items[0]?.key ?? "hero");
  const [mounted, setMounted] = useState(false);
  const ids = useMemo(() => items.map((item) => item.key), [items]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    function update() {
      const marker = window.innerHeight * 0.3;
      let current = ids[0];
      for (const id of ids) {
        const el = document.getElementById(id);
        if (!el) continue;
        if (el.getBoundingClientRect().top <= marker) current = id;
      }
      const last = [...ids].reverse().find((id) => document.getElementById(id));
      const doc = document.documentElement;
      if (last && window.scrollY + window.innerHeight >= doc.scrollHeight - 96) {
        current = last;
      }
      setActive((prev) => (prev === current ? prev : current));
    }

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    lenis?.on("scroll", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      lenis?.off("scroll", update);
    };
  }, [ids, lenis]);

  useEffect(() => {
    const root = document.querySelector(".public-root");
    if (!root) return;
    root.classList.toggle("has-sidenav", onHome);
    return () => root.classList.remove("has-sidenav");
  }, [onHome]);

  function go(id: string) {
    if (lenis) {
      lenis.scrollTo(`#${id}`, { offset: -24 });
      return;
    }
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  }

  const mobileNav = (
    <nav aria-label="Sections" className="nav-glass mobile-nav lg:hidden">
      <LayoutGroup>
        <ul className="flex w-full min-w-0 items-center gap-px">
          {items.map((item) => {
            const isActive = active === item.key;
            return (
              <li key={item.key}>
                <button
                  type="button"
                  aria-label={navLabel(item)}
                  aria-current={isActive ? "true" : undefined}
                  onClick={() => go(item.key)}
                  className="sidenav-item"
                >
                  {isActive ? (
                    <motion.span
                      layoutId="nav-active-mobile"
                      className="sidenav-active"
                      transition={{ type: "tween", duration: 0.14, ease: [0.22, 1, 0.36, 1] }}
                    />
                  ) : null}
                  <span className="sidenav-dot relative z-[1]" />
                  {isActive ? (
                    <span className="relative z-[1] max-w-[4.5rem] truncate">{navLabel(item)}</span>
                  ) : null}
                </button>
              </li>
            );
          })}
        </ul>
      </LayoutGroup>
    </nav>
  );

  return (
    <>
      <SiteHeader />

      {onHome ? (
        <>
          <nav
            aria-label="Sections"
            className="pointer-events-none fixed inset-y-0 right-4 z-[70] hidden items-center lg:flex xl:right-6"
          >
            <LayoutGroup>
              <div className="nav-glass pointer-events-auto rounded-3xl p-1.5">
                <ul className="flex min-w-[11.5rem] max-h-[78vh] flex-col gap-0.5 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {items.map((item) => {
                  const isActive = active === item.key;
                  return (
                    <li key={item.key}>
                      <button
                        type="button"
                        onClick={() => go(item.key)}
                        data-cursor="invert"
                        aria-current={isActive ? "true" : undefined}
                        className="sidenav-item"
                      >
                        {isActive ? (
                          <motion.span
                            layoutId="nav-active"
                            className="sidenav-active"
                            transition={{ type: "tween", duration: 0.14, ease: [0.22, 1, 0.36, 1] }}
                          />
                        ) : null}
                        <span className="relative z-[1]">{navLabel(item)}</span>
                        <span className="sidenav-dot relative z-[1]" />
                      </button>
                    </li>
                  );
                })}
                </ul>
              </div>
            </LayoutGroup>
          </nav>

          {mounted ? createPortal(mobileNav, document.body) : mobileNav}
        </>
      ) : null}
    </>
  );
}
