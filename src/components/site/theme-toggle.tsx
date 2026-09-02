"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/components/site/theme-provider";
import { cn } from "@/lib/utils";

export function ThemeToggle({ className }: { className?: string }) {
  const { toggle } = useTheme();

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Toggle light and dark mode"
      data-cursor="invert"
      suppressHydrationWarning
      className={cn(
        "theme-toggle relative grid h-11 w-11 place-items-center rounded-full bg-foreground text-background",
        className,
      )}
    >
      <Sun className="h-4 w-4 rotate-0 scale-100 transition-transform dark:scale-75 dark:rotate-90 dark:opacity-0" />
      <Moon className="absolute h-4 w-4 scale-75 -rotate-90 opacity-0 transition-all dark:scale-100 dark:rotate-0 dark:opacity-100" />
    </button>
  );
}
