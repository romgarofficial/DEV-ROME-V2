import { BrandMark } from "@/components/site/brand-mark";
import { ThemeToggle } from "@/components/site/theme-toggle";

export function SiteHeader({ href = "/" }: { href?: string }) {
  return (
    <header className="site-header pointer-events-none fixed inset-x-0 top-0 z-[70] flex items-center justify-between gap-3 px-4 py-3 sm:px-6 md:px-8">
      <BrandMark href={href} className="pointer-events-auto" />
      <ThemeToggle className="pointer-events-auto" />
    </header>
  );
}
