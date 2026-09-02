import Link from "next/link";
import { AmbientStage } from "@/components/site/ambient-stage";
import { SiteHeader } from "@/components/site/site-header";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="relative flex min-h-svh flex-col items-center justify-center px-6">
      <AmbientStage />
      <SiteHeader />
      <div className="relative z-10 max-w-lg pt-16 text-center">
        <p className="text-[11px] tracking-[0.28em] text-muted uppercase">404</p>
        <h1 className="font-display mt-3 text-4xl tracking-tight md:text-5xl">Page not found</h1>
        <p className="mt-4 text-muted">That route isn’t in the portfolio. Head back to the site or the admin.</p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Button asChild>
            <Link href="/">Back home</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/admin">Admin</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
