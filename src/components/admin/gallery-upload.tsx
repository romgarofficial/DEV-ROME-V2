"use client";

import { ImagePlus, Trash2, GripVertical } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { ImageCropDialog, type CropAspect } from "@/components/admin/image-crop-dialog";
import { MediaProgress } from "@/components/admin/media-progress";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { cropFormatFor, cropToFile } from "@/lib/crop-image";
import { cn } from "@/lib/utils";
import type { Area } from "react-easy-crop";

const ACCEPT = "image/jpeg,image/png,image/webp,image/gif,image/avif";

function postMedia(file: File, onProgress: (percent: number) => void) {
  return new Promise<{ ok: boolean; url?: string; error?: string }>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/api/upload");
    xhr.upload.onprogress = (event) => {
      if (!event.lengthComputable) return;
      onProgress(Math.round((event.loaded / event.total) * 100));
    };
    xhr.onload = () => {
      try {
        const data = JSON.parse(xhr.responseText || "{}") as { url?: string; error?: string };
        resolve({ ok: xhr.status >= 200 && xhr.status < 300, url: data.url, error: data.error });
      } catch {
        resolve({ ok: false, error: "Upload failed" });
      }
    };
    xhr.onerror = () => reject(new Error("Upload failed"));
    const body = new FormData();
    body.append("file", file);
    xhr.send(body);
  });
}

export function GalleryUpload({
  value = [],
  onChange,
  label,
}: {
  value?: string[];
  onChange: (urls: string[]) => void;
  label: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [removing, setRemoving] = useState<string | null>(null);
  const [cropSrc, setCropSrc] = useState("");
  const [sourceName, setSourceName] = useState("image");
  const [status, setStatus] = useState("");
  const [percent, setPercent] = useState<number | null>(null);
  const localUrl = useRef("");
  const [dragIdx, setDragIdx] = useState<number | null>(null);
  const [pendingRemove, setPendingRemove] = useState<string | null>(null);

  function closeCrop() {
    if (localUrl.current) URL.revokeObjectURL(localUrl.current);
    localUrl.current = "";
    setCropSrc("");
    if (inputRef.current) inputRef.current.value = "";
  }

  function onFile(file?: File) {
    if (!file || busy) return;
    if (localUrl.current) URL.revokeObjectURL(localUrl.current);
    localUrl.current = URL.createObjectURL(file);
    setSourceName(file.name);
    setCropSrc(localUrl.current);
  }

  async function applyCrop(area: Area, shape: CropAspect) {
    setBusy(true);
    setStatus("Preparing");
    setPercent(null);
    try {
      const file = await cropToFile(
        cropSrc,
        area,
        sourceName,
        shape === "cover" ? 1920 : 1600,
        cropFormatFor(sourceName, shape),
      );
      setStatus("Uploading");
      setPercent(0);
      const data = await postMedia(file, setPercent);
      if (!data.ok || !data.url) {
        toast.error(data.error || "Upload failed");
        return;
      }
      onChange([...value, data.url]);
      closeCrop();
    } catch {
      toast.error("Upload failed");
    } finally {
      setBusy(false);
      setStatus("");
      setPercent(null);
    }
  }

  async function removeImage(url: string) {
    setRemoving(url);
    try {
      if (!url.startsWith("blob:")) {
        await fetch("/api/upload", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url }),
        });
      }
      onChange(value.filter((u) => u !== url));
      toast.success("Image removed");
    } catch {
      toast.error("Could not remove image");
    } finally {
      setRemoving(null);
    }
  }

  function onDragStart(idx: number) {
    setDragIdx(idx);
  }

  function onDragOver(e: React.DragEvent, idx: number) {
    e.preventDefault();
    if (dragIdx === null || dragIdx === idx) return;
    const next = [...value];
    const [moved] = next.splice(dragIdx, 1);
    next.splice(idx, 0, moved);
    onChange(next);
    setDragIdx(idx);
  }

  function onDragEnd() {
    setDragIdx(null);
  }

  return (
    <div className="space-y-2">
      <p className="text-sm font-medium text-foreground/80">{label}</p>

      {value.length > 0 ? (
        <div className="grid grid-cols-3 gap-2">
          {value.map((url, idx) => (
            <div
              key={url}
              draggable
              onDragStart={() => onDragStart(idx)}
              onDragOver={(e) => onDragOver(e, idx)}
              onDragEnd={onDragEnd}
              className={cn(
                "group relative aspect-[16/9] overflow-hidden rounded-xl bg-black/80 ring-1 ring-border",
                dragIdx === idx && "opacity-50",
              )}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={url} alt="" className="h-full w-full object-contain" />
              <div className="absolute inset-0 flex items-center justify-center gap-1 bg-black/0 opacity-0 transition-all group-hover:bg-black/40 group-hover:opacity-100">
                <button
                  type="button"
                  className="cursor-grab rounded-full bg-white/90 p-1.5 text-foreground"
                  onMouseDown={(e) => e.stopPropagation()}
                >
                  <GripVertical className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  disabled={removing === url}
                  onClick={() => setPendingRemove(url)}
                  className="rounded-full bg-white/90 p-1.5 text-red-500 hover:bg-red-50"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
              {removing === url ? <MediaProgress label="Removing" /> : null}
            </div>
          ))}
        </div>
      ) : null}

      <label
        className={cn(
          "flex h-20 cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-border text-sm text-muted transition-colors hover:border-foreground/30 hover:text-foreground",
          busy && "pointer-events-none opacity-50",
        )}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          onFile(e.dataTransfer.files?.[0]);
        }}
      >
        <ImagePlus className="h-4 w-4" />
        Add image
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPT}
          disabled={busy}
          className="hidden"
          onChange={(e) => onFile(e.target.files?.[0])}
        />
      </label>
      {busy && !cropSrc ? (
        <p className="text-xs text-muted">
          {status}
          {typeof percent === "number" ? ` ${percent}%` : "…"}
        </p>
      ) : null}

      {cropSrc ? (
        <ImageCropDialog
          src={cropSrc}
          aspect="cover"
          title="gallery image"
          busy={busy}
          status={status}
          percent={percent}
          selectable
          onCancel={closeCrop}
          onConfirm={applyCrop}
        />
      ) : null}

      <ConfirmDialog
        open={Boolean(pendingRemove)}
        title="Remove image"
        description="This image will be deleted from storage. This cannot be undone."
        confirmLabel="Remove"
        busy={Boolean(removing)}
        onOpenChange={(open) => {
          if (!open && !removing) setPendingRemove(null);
        }}
        onConfirm={() => {
          if (pendingRemove) removeImage(pendingRemove).then(() => setPendingRemove(null));
        }}
      />
    </div>
  );
}
