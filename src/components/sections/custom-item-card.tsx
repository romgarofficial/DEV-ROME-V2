"use client";

import { ExternalLink, FileText } from "lucide-react";
import { useState } from "react";
import { MediaFrame } from "@/components/site/media-frame";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { itemHref } from "@/lib/item-href";
import { formatDateRange } from "@/lib/utils";
import type { CustomItemDoc } from "@/types";

export function CustomItemCard({ item }: { item: CustomItemDoc }) {
  const [open, setOpen] = useState(false);
  const href = itemHref(item.url);
  const name = item.organization || item.title;
  const dates = formatDateRange(item.startDate, item.endDate, item.current);
  const meta = [item.organization, item.location, dates].filter(Boolean).join(" · ");
  const image = (
    <MediaFrame
      src={item.imageUrl}
      alt={name}
      label={item.title}
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
          {item.organization ? <p className="text-sm text-muted">{item.organization}</p> : null}
          <p className="mt-1 text-[11px] tracking-[0.16em] text-muted uppercase">
            {[item.location, dates].filter(Boolean).join(" · ")}
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
          {meta ? <DialogDescription className="mt-1 text-sm text-muted">{meta}</DialogDescription> : null}
          {item.imageUrl ? (
            <div className="mt-5 overflow-hidden rounded-2xl ring-1 ring-border">
              <MediaFrame
                src={item.imageUrl}
                alt={name}
                label={item.title}
                fit="contain"
                padded={false}
                className="aspect-[16/9] w-full rounded-none bg-white"
                sizes="640px"
              />
            </div>
          ) : null}
          <dl className="mt-5 grid gap-3 text-sm">
            {item.organization ? (
              <div>
                <dt className="text-[11px] tracking-[0.16em] text-muted uppercase">Host / organizer</dt>
                <dd className="mt-0.5">{item.organization}</dd>
              </div>
            ) : null}
            {item.location ? (
              <div>
                <dt className="text-[11px] tracking-[0.16em] text-muted uppercase">Location</dt>
                <dd className="mt-0.5">{item.location}</dd>
              </div>
            ) : null}
            {dates ? (
              <div>
                <dt className="text-[11px] tracking-[0.16em] text-muted uppercase">Dates</dt>
                <dd className="mt-0.5">{dates}</dd>
              </div>
            ) : null}
            {item.description ? (
              <div>
                <dt className="text-[11px] tracking-[0.16em] text-muted uppercase">Notes</dt>
                <dd className="mt-1 leading-7 text-foreground/85">{item.description}</dd>
              </div>
            ) : null}
          </dl>
          <div className="mt-6 flex flex-wrap gap-2">
            {item.fileUrl ? (
              <a
                href={item.fileUrl}
                target="_blank"
                rel="noreferrer"
                data-cursor="invert"
                className="inline-flex h-9 items-center gap-1.5 rounded-full bg-foreground px-3.5 text-xs font-medium text-background"
              >
                <FileText className="h-3.5 w-3.5" />
                Open PDF
              </a>
            ) : null}
            {href ? (
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
            ) : null}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
