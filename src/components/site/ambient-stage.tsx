"use client";

import { AmbientBlobs } from "@/components/site/blobs";
import { Particles } from "@/components/site/particles";

export function AmbientStage() {
  return (
    <>
      <Particles />
      <AmbientBlobs />
      <div className="site-grain" />
    </>
  );
}
