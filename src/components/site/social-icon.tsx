import { cn } from "@/lib/utils";
import { socialIconPath, socialMark } from "@/lib/social-platforms";

export function SocialIcon({
  name,
  className,
}: {
  name: string;
  className?: string;
}) {
  const path = socialIconPath(name);
  if (path) {
    return (
      <svg viewBox="0 0 24 24" className={cn("h-4 w-4 fill-current", className)} aria-hidden>
        <path d={path} />
      </svg>
    );
  }

  return (
    <span
      className={cn(
        "grid h-4 w-4 place-items-center rounded-[3px] bg-current/10 text-[8px] font-bold leading-none",
        className,
      )}
      aria-hidden
    >
      {socialMark(name)}
    </span>
  );
}
