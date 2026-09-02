"use client";

import { useCallback, useState } from "react";
import Cropper, { type Area } from "react-easy-crop";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { MediaProgress } from "@/components/admin/media-progress";

const RATIO = {
  portrait: 4 / 5,
  cover: 16 / 9,
  square: 1,
} as const;

export function ImageCropDialog({
  src,
  aspect,
  title,
  busy = false,
  status = "",
  percent = null,
  onCancel,
  onConfirm,
}: {
  src: string;
  aspect: keyof typeof RATIO;
  title: string;
  busy?: boolean;
  status?: string;
  percent?: number | null;
  onCancel: () => void;
  onConfirm: (area: Area) => void;
}) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [area, setArea] = useState<Area | null>(null);
  const onComplete = useCallback((_cropped: Area, pixels: Area) => {
    setArea(pixels);
  }, []);

  return (
    <Dialog open onOpenChange={(open) => { if (!open && !busy) onCancel(); }}>
      <DialogContent className="w-[min(720px,calc(100%-2rem))] overflow-hidden p-5 sm:p-6">
        <DialogTitle className="font-display pr-8 text-2xl tracking-tight">Crop {title}</DialogTitle>
        <p className="mt-1 text-sm text-muted">Drag to position. Use the slider to zoom.</p>
        <div className="relative mt-4 h-[min(58vh,420px)] overflow-hidden rounded-3xl bg-black ring-1 ring-border">
          <Cropper
            image={src}
            crop={crop}
            zoom={zoom}
            aspect={RATIO[aspect]}
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
          <Button type="button" onClick={() => area && onConfirm(area)} disabled={!area || busy}>
            {busy ? (typeof percent === "number" ? `${status || "Uploading"} ${percent}%` : `${status || "Uploading"}…`) : "Use crop"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
