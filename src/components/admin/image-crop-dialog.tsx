"use client";

import { useCallback, useEffect, useState } from "react";
import Cropper, { type Area } from "react-easy-crop";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { MediaProgress } from "@/components/admin/media-progress";
import { cn } from "@/lib/utils";

export const CROP_RATIO = {
  portrait: 4 / 5,
  cover: 16 / 9,
  square: 1,
} as const;

export type CropAspect = keyof typeof CROP_RATIO;

const SHAPE_OPTIONS: { id: CropAspect; label: string }[] = [
  { id: "cover", label: "Landscape" },
  { id: "square", label: "Square" },
];

export function ImageCropDialog({
  src,
  aspect,
  title,
  busy = false,
  status = "",
  percent = null,
  selectable = false,
  onCancel,
  onConfirm,
}: {
  src: string;
  aspect: CropAspect;
  title: string;
  busy?: boolean;
  status?: string;
  percent?: number | null;
  selectable?: boolean;
  onCancel: () => void;
  onConfirm: (area: Area, aspect: CropAspect) => void;
}) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [area, setArea] = useState<Area | null>(null);
  const [shape, setShape] = useState<CropAspect>(aspect);

  useEffect(() => {
    setShape(aspect);
    setZoom(1);
    setCrop({ x: 0, y: 0 });
    setArea(null);
  }, [src, aspect]);

  const onComplete = useCallback((_cropped: Area, pixels: Area) => {
    setArea(pixels);
  }, []);

  return (
    <Dialog open onOpenChange={(open) => { if (!open && !busy) onCancel(); }}>
      <DialogContent className="w-[min(720px,calc(100%-2rem))] overflow-hidden p-5 sm:p-6">
        <DialogTitle className="font-display pr-8 text-2xl tracking-tight">Crop {title}</DialogTitle>
        <p className="mt-1 text-sm text-muted">
          {selectable ? "Choose a shape, then drag to position." : "Drag to position. Use the slider to zoom."}
        </p>
        {selectable ? (
          <div className="mt-3 flex gap-2">
            {SHAPE_OPTIONS.map((option) => (
              <button
                key={option.id}
                type="button"
                disabled={busy}
                onClick={() => {
                  setShape(option.id);
                  setArea(null);
                }}
                className={cn(
                  "h-8 rounded-full px-3 text-xs font-medium ring-1 transition-colors",
                  shape === option.id
                    ? "bg-foreground text-background ring-foreground"
                    : "bg-transparent text-muted ring-border hover:text-foreground",
                )}
              >
                {option.label}
              </button>
            ))}
          </div>
        ) : null}
        <div className="relative mt-4 h-[min(58vh,420px)] overflow-hidden rounded-3xl bg-black ring-1 ring-border">
          <Cropper
            image={src}
            crop={crop}
            zoom={zoom}
            aspect={CROP_RATIO[shape]}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onComplete}
          />
          {busy ? <MediaProgress label={status || "Uploading"} percent={percent} /> : null}
        </div>
        <label className="mt-4 flex items-center gap-3 text-sm text-muted">
          Zoom
          <input
            type="range"
            min={1}
            max={3}
            step={0.05}
            value={zoom}
            disabled={busy}
            onChange={(event) => setZoom(Number(event.target.value))}
            className="w-full accent-foreground"
          />
        </label>
        <div className="mt-5 flex justify-end gap-2">
          <Button type="button" variant="ghost" onClick={onCancel} disabled={busy}>
            Cancel
          </Button>
          <Button type="button" onClick={() => area && onConfirm(area, shape)} disabled={!area || busy}>
            {busy ? (typeof percent === "number" ? `${status || "Uploading"} ${percent}%` : `${status || "Uploading"}…`) : "Use crop"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
