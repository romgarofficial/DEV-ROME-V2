import { cn } from "@/lib/utils";

export function MediaProgress({
  label,
  percent,
  className,
}: {
  label: string;
  percent?: number | null;
  className?: string;
}) {
  const determinate = typeof percent === "number";

  return (
    <div className={cn("absolute inset-0 z-10 grid place-items-center bg-background/72 backdrop-blur-sm", className)}>
      <div className="w-[min(16rem,82%)] space-y-2 text-center">
        <p className="text-[11px] tracking-[0.16em] text-foreground uppercase">
          {label}
          {determinate ? ` ${percent}%` : ""}
        </p>
        <div className="h-1 overflow-hidden rounded-full bg-foreground/15">
          {determinate ? (
            <div
              className="h-full rounded-full bg-foreground transition-[width] duration-150"
              style={{ width: `${Math.max(4, Math.min(100, percent))}%` }}
            />
          ) : (
            <div className="media-progress-indet h-full rounded-full bg-foreground" />
          )}
        </div>
      </div>
    </div>
  );
}
