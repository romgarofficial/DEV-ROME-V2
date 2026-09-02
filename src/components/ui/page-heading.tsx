import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function PageHeading({
  kicker,
  title,
  description,
  action,
  className,
}: {
  kicker?: string;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-wrap items-end justify-between gap-4", className)}>
      <div className="min-w-0">
        {kicker ? (
          <p className="text-[11px] tracking-[0.28em] text-muted uppercase">{kicker}</p>
        ) : null}
        <h1 className="font-display mt-2 text-3xl tracking-tight md:text-4xl">{title}</h1>
        {description ? <p className="mt-2 max-w-xl text-sm leading-6 text-muted">{description}</p> : null}
      </div>
      {action}
    </div>
  );
}
