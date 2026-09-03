"use client";

import { useMemo, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/fields";
import { SocialIcon } from "@/components/site/social-icon";
import {
  SOCIAL_CATEGORY_LABELS,
  SOCIAL_PLATFORMS,
  socialKey,
  type SocialCategory,
  type SocialPlatform,
} from "@/lib/social-platforms";
import { cn } from "@/lib/utils";

const CATEGORY_ORDER: SocialCategory[] = [
  "social",
  "professional",
  "developer",
  "messaging",
  "creative",
  "media",
];

export function SocialPickerDialog({
  open,
  usedSlugs,
  onOpenChange,
  onSelect,
}: {
  open: boolean;
  usedSlugs: string[];
  onOpenChange: (open: boolean) => void;
  onSelect: (platform: SocialPlatform) => void;
}) {
  const [query, setQuery] = useState("");
  const used = useMemo(() => new Set(usedSlugs.map(socialKey)), [usedSlugs]);
  const needle = query.trim().toLowerCase();

  const grouped = useMemo(() => {
    const matches = SOCIAL_PLATFORMS.filter((platform) => {
      if (!needle) return true;
      return (
        platform.label.toLowerCase().includes(needle) ||
        platform.slug.includes(needle.replace(/[^a-z0-9]/g, ""))
      );
    });
    return CATEGORY_ORDER.map((category) => ({
      category,
      items: matches.filter((platform) => platform.category === category),
    })).filter((group) => group.items.length > 0);
  }, [needle]);

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        onOpenChange(next);
        if (!next) setQuery("");
      }}
    >
      <DialogContent className="w-[min(720px,calc(100%-2rem))]">
        <DialogTitle className="font-display pr-8 text-2xl tracking-tight">Add a platform</DialogTitle>
        <DialogDescription className="mt-1 text-sm text-muted">
          Pick a network, then paste your profile URL.
        </DialogDescription>
        <Input
          className="mt-4"
          value={query}
          placeholder="Search Instagram, GitHub, LinkedIn…"
          onChange={(event) => setQuery(event.target.value)}
          autoFocus
        />
        <div className="mt-4 max-h-[min(28rem,55vh)] space-y-5 overflow-y-auto pr-1">
          {grouped.length ? (
            grouped.map((group) => (
              <div key={group.category}>
                <p className="mb-2 px-1 text-[11px] tracking-[0.16em] text-muted uppercase">
                  {SOCIAL_CATEGORY_LABELS[group.category]}
                </p>
                <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-3">
                  {group.items.map((platform) => {
                    const added = used.has(socialKey(platform.slug));
                    return (
                      <button
                        key={platform.slug}
                        type="button"
                        disabled={added}
                        onClick={() => {
                          onSelect(platform);
                          setQuery("");
                          onOpenChange(false);
                        }}
                        className={cn(
                          "flex items-center gap-2.5 rounded-2xl px-3 py-2.5 text-left text-sm transition-colors",
                          added
                            ? "cursor-not-allowed text-muted opacity-50"
                            : "hover:bg-foreground/8",
                        )}
                      >
                        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-foreground/8">
                          <SocialIcon name={platform.slug} className="h-4 w-4" />
                        </span>
                        <span className="min-w-0">
                          <span className="block truncate">{platform.label}</span>
                          {added ? <span className="text-[11px] text-muted">Already added</span> : null}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))
          ) : (
            <p className="py-8 text-center text-sm text-muted">No platforms match that search.</p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
