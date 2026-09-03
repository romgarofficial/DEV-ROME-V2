import { cn } from "@/lib/utils";

export function CoverMedia({
  src,
  alt,
  className,
}: {
  src: string;
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
}) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} className={cn("absolute inset-0 h-full w-full object-cover", className)} />
  );
}

export function MediaFrame({
  src,
  alt,
  label,
  className,
  fit = "cover",
  padded = true,
}: {
  src?: string | null;
  alt: string;
  label: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
  fit?: "cover" | "contain";
  padded?: boolean;
}) {
  return (
    <div
      data-cursor="invert"
      className={cn("relative overflow-hidden rounded-3xl ring-1 ring-border", className)}
    >
      {src ? (
        <CoverMedia
          src={src}
          alt={alt}
          className={fit === "contain" ? cn("object-contain", padded && "p-[12%]") : undefined}
        />
      ) : (
        <div className="media-ph absolute inset-0 grid place-items-center">
          <div className="px-4 text-center">
            <p className="font-display text-sm tracking-tight">{label}</p>
            <p className="mt-1 text-[11px] text-muted">Add from admin</p>
          </div>
        </div>
      )}
    </div>
  );
}
