"use client";

import { AmbientStage } from "@/components/site/ambient-stage";
import { BackToTop } from "@/components/site/back-to-top";
import { SiteControls } from "@/components/site/site-controls";
import type { ProfileDoc, SectionDoc } from "@/types";
import { useEffect, useState } from "react";

export function PublicChrome({
  profile,
  sections,
}: {
  profile: ProfileDoc | null;
  sections: SectionDoc[];
}) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? window.scrollY / max : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <div className="progress-line" style={{ transform: `scaleX(${progress})` }} />
      <AmbientStage />
      <SiteControls profile={profile} sections={sections} />
      <BackToTop />
    </>
  );
}
