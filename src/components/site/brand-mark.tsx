import Link from "next/link";
import { cn } from "@/lib/utils";

export function BrandMark({
  href = "/",
  className,
}: {
  href?: string;
  className?: string;
}) {
  return (
    <Link href={href} data-cursor="invert" className={cn("font-display text-lg tracking-tight", className)}>
      ROME
    </Link>
  );
}
