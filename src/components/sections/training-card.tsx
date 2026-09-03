"use client";

import { ExternalLink } from "lucide-react";
import { useState } from "react";
import { MediaFrame } from "@/components/site/media-frame";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { itemHref } from "@/lib/item-href";
import { formatDateRange } from "@/lib/utils";
import type { TrainingDoc } from "@/types";

export function TrainingCard({ item }: { item: TrainingDoc }) {
  const [open, setOpen] = useState(false);
  const href = itemHref(item.url);
  const name = item.organization || item.title;
  const dates = formatDateRange(item.startDate, item.endDate);
  const meta = [item.provider, dates, item.hours ? `${item.hours}h` : ""].filter(Boolean).join(" · ");
  const image = (
    <MediaFrame
      src={item.imageUrl}
      alt={name}
      label="Training"
      fit="contain"
      className="aspect-[16/9] w-full rounded-none ring-0 bg-white"
      sizes="(min-width: 640px) 40vw, 100vw"
    />
  );

  return (
    <>
      <div className="flex h-full flex-col overflow-hidden rounded-3xl ring-1 ring-border">
        {href ? (
          <a
            href={href}
            target="_blank"
            rel="noreferrer"
            data-cursor="invert"
            aria-label={`Visit ${name}`}
            className="block transition-opacity hover:opacity-90"
          >
            {image}
          </a>
        ) : (
          image
        )}
        <div className="glass flex flex-1 flex-col p-4">
          <h3 className="font-medium">{item.title}</h3>
          <p className="text-sm text-muted">{item.provider}</p>
          <p className="mt-1 text-[11px] tracking-[0.16em] text-muted uppercase">
            {dates}
            {item.hours ? ` · ${item.hours}h` : ""}
          </p>
          <div className="mt-auto flex flex-wrap gap-2 pt-4">
            <Button type="button" size="sm" variant="secondary" onClick={() => setOpen(true)}>
              View
            </Button>
            {href ? (
              <a
                href={href}
                target="_blank"
                rel="noreferrer"
                data-cursor="invert"
                className="inline-flex h-8 items-center gap-1.5 rounded-full bg-foreground/8 px-3 text-xs font-medium hover:bg-foreground/12"
              >
                Website
                <ExternalLink className="h-3 w-3" />
              </a>
            ) : null}
          </div>
        </div>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="w-[min(640px,calc(100%-2rem))]">
          <DialogTitle className="font-display pr-8 text-2xl tracking-tight">{item.title}</DialogTitle>
          <DialogDescription className="mt-1 text-sm text-muted">{meta}</DialogDescription>
          {item.imageUrl ? (
            <div className="mt-5 overflow-hidden rounded-2xl ring-1 ring-border">
              <MediaFrame
                src={item.imageUrl}
                alt={name}
                label="Training"
                fit="contain"
                padded={false}
                className="aspect-[16/9] w-full rounded-none bg-white"
                sizes="640px"
              />
            </div>
          ) : null}
          <dl className="mt-5 grid gap-3 text-sm">
            {item.provider ? (
              <div>
                <dt className="text-[11px] tracking-[0.16em] text-muted uppercase">Provider</dt>
                <dd className="mt-0.5">{item.provider}</dd>
              </div>
            ) : null}
            {dates ? (
              <div>
                <dt className="text-[11px] tracking-[0.16em] text-muted uppercase">Dates</dt>
                <dd className="mt-0.5">{dates}</dd>
              </div>
            ) : null}
            {item.hours ? (
              <div>
                <dt className="text-[11px] tracking-[0.16em] text-muted uppercase">Hours</dt>
                <dd className="mt-0.5">{item.hours}h</dd>
              </div>
            ) : null}
            {item.description ? (
              <div>
                <dt className="text-[11px] tracking-[0.16em] text-muted uppercase">Notes</dt>
                <dd className="mt-1 leading-7 text-foreground/85">{item.description}</dd>
              </div>
            ) : null}
          </dl>
          {href ? (
            <div className="mt-6 flex flex-wrap gap-2">
              <a
                href={href}
                target="_blank"
                rel="noreferrer"
                data-cursor="invert"
                className="inline-flex h-9 items-center gap-1.5 rounded-full bg-foreground/8 px-3.5 text-xs font-medium"
              >
                Website
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </>
  );
}
