import { Mail } from "lucide-react";

export function SocialIcon({ name }: { name: string }) {
  const key = name.toLowerCase();
  if (key.includes("git")) {
    return (
      <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden>
        <path d="M12 .3a12 12 0 00-3.8 23.4c.6.1.8-.3.8-.6v-2.2c-3.3.7-4-1.6-4-1.6-.5-1.4-1.3-1.8-1.3-1.8-1.1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1.1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.8-1.6-2.7-.3-5.5-1.3-5.5-6 0-1.3.5-2.4 1.2-3.2-.1-.3-.5-1.6.1-3.2 0 0 1-.3 3.3 1.2a11.5 11.5 0 016 0c2.3-1.5 3.3-1.2 3.3-1.2.6 1.6.2 2.8.1 3.2.8.8 1.2 1.9 1.2 3.2 0 4.6-2.8 5.7-5.5 6 .4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6A12 12 0 0012 .3z" />
      </svg>
    );
  }
  if (key.includes("linked")) {
    return (
      <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden>
        <path d="M4.98 3.5A2.5 2.5 0 112.5 6a2.5 2.5 0 012.48-2.5zM3 8.98h3.96V21H3zM9.5 8.98H13v1.64h.05c.49-.93 1.7-1.9 3.5-1.9 3.74 0 4.43 2.46 4.43 5.66V21h-3.96v-5.54c0-1.32-.02-3.02-1.84-3.02-1.84 0-2.12 1.44-2.12 2.92V21H9.5z" />
      </svg>
    );
  }
  if (key.includes("mail") || key.includes("email")) return <Mail className="h-4 w-4" />;
  return <span className="text-[10px] font-medium">{name.slice(0, 2)}</span>;
}
