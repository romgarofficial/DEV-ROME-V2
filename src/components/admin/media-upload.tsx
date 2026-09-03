"use client";

import { useEffect, useRef, useState } from "react";
import { FileText, ImagePlus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { ImageCropDialog } from "@/components/admin/image-crop-dialog";
import { MediaProgress } from "@/components/admin/media-progress";
import { Button } from "@/components/ui/button";
import { cropFormatFor, cropToFile } from "@/lib/crop-image";
import { fileLabelFromUrl } from "@/lib/item-href";
import { cn } from "@/lib/utils";
import type { Area } from "react-easy-crop";

const ACCEPT_IMAGE = "image/jpeg,image/png,image/webp,image/gif,image/avif";
const ACCEPT_FILE = "application/pdf,.pdf";

const ASPECT = {
  portrait: "aspect-[4/5]",
  cover: "aspect-[16/9]",
  square: "aspect-square",
} as const;

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
        resolve({
          ok: xhr.status >= 200 && xhr.status < 300,
          url: data.url,
          error: data.error,
        });
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

export function MediaUpload({
  value,
  onChange,
  onBusyChange,
  label,
  hint,
  aspect = "square",
  aspectSelectable = true,
  kind = "image",
}: {
  value?: string;
  onChange: (url: string) => void;
  onBusyChange?: (busy: boolean) => void;
  label: string;
  hint?: string;
  aspect?: keyof typeof ASPECT;
  aspectSelectable?: boolean;
  kind?: "image" | "file";
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [phase, setPhase] = useState<"upload" | "remove" | null>(null);
  const [status, setStatus] = useState("");
  const [percent, setPercent] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [preview, setPreview] = useState(value ?? "");
  const [cropSrc, setCropSrc] = useState("");
  const [sourceName, setSourceName] = useState("image");
  const [frameAspect, setFrameAspect] = useState<keyof typeof ASPECT>(aspect);
  const localUrl = useRef("");

  useEffect(() => {
    setPreview(value ?? "");
  }, [value]);

  useEffect(() => {
    return () => {
      if (localUrl.current) URL.revokeObjectURL(localUrl.current);
    };
  }, []);

  function startBusy(next: "upload" | "remove", nextStatus: string, nextPercent: number | null = null) {
    setBusy(true);
    setPhase(next);
    setStatus(nextStatus);
    setPercent(nextPercent);
    onBusyChange?.(true);
  }

  function stopBusy() {
    setBusy(false);
    setPhase(null);
    setStatus("");
    setPercent(null);
    onBusyChange?.(false);
  }

  function closeCrop() {
    if (localUrl.current) URL.revokeObjectURL(localUrl.current);
    localUrl.current = "";
    setCropSrc("");
    if (inputRef.current) inputRef.current.value = "";
  }

  function isPdfFile(file: File) {
    return file.type === "application/pdf" || /\.pdf$/i.test(file.name);
  }

  function onFile(file?: File) {
    if (!file || busy) return;
    setError("");
    if (kind === "file") {
      if (!isPdfFile(file)) {
        toast.error("Use a PDF file.");
        setError("Use a PDF file.");
        return;
      }
      uploadDirect(file);
      return;
    }
    if (isPdfFile(file)) {
      toast.error("PDFs belong in the PDF field — images only here.");
      setError("Use a JPG, PNG, or WEBP image.");
      return;
    }
    if (localUrl.current) URL.revokeObjectURL(localUrl.current);
    localUrl.current = URL.createObjectURL(file);
    setSourceName(file.name);
    setCropSrc(localUrl.current);
  }

  async function uploadDirect(file: File) {
    const previous = value && !value.startsWith("blob:") ? value : "";
    startBusy("upload", "Uploading", 0);
    try {
      const data = await postMedia(file, setPercent);
      if (!data.ok || typeof data.url !== "string") {
        setError(data.error || "Upload failed");
        toast.error(data.error || "Upload failed");
        return;
      }
      setPercent(100);
      if (previous && previous !== data.url) {
        setStatus("Finishing");
        setPercent(null);
        await fetch("/api/upload", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url: previous }),
        }).catch(() => undefined);
      }
      onChange(data.url);
      setPreview(data.url);
      if (inputRef.current) inputRef.current.value = "";
    } catch {
      setError("Upload failed");
      toast.error("Upload failed");
    } finally {
      stopBusy();
    }
  }

  async function removeCurrent() {
    const url = value || preview;
    startBusy("remove", "Removing");
    setError("");
    try {
      if (url && !url.startsWith("blob:")) {
        const res = await fetch("/api/upload", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url }),
        });
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          toast.error(data.error || (kind === "file" ? "Could not remove file" : "Could not remove image"));
          return;
        }
      }
      onChange("");
      setPreview("");
    } catch {
      toast.error(kind === "file" ? "Could not remove file" : "Could not remove image");
    } finally {
      stopBusy();
    }
  }

  async function applyCrop(area: Area, nextAspect: keyof typeof ASPECT) {
    startBusy("upload", "Preparing");
    setError("");
    const previous = value && !value.startsWith("blob:") ? value : "";
    try {
      const file = await cropToFile(
        cropSrc,
        area,
        sourceName,
        nextAspect === "cover" ? 1920 : 1600,
        cropFormatFor(sourceName, nextAspect),
      );
      setStatus("Uploading");
      setPercent(0);
      const data = await postMedia(file, setPercent);
      if (!data.ok || typeof data.url !== "string" || data.url.startsWith("blob:")) {
        setError(data.error || "Upload failed");
        toast.error(data.error || "Upload failed");
        return;
      }
      setPercent(100);
      if (previous && previous !== data.url) {
        setStatus("Finishing");
        setPercent(null);
        await fetch("/api/upload", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url: previous }),
        }).catch(() => undefined);
      }
      onChange(data.url);
      setPreview(data.url);
      setFrameAspect(nextAspect);
      closeCrop();
    } catch {
      setError("Upload failed");
      toast.error("Upload failed");
    } finally {
      stopBusy();
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex items-end justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-foreground/80">{label}</p>
          {hint ? <p className="mt-0.5 text-[11px] text-muted">{hint}</p> : null}
        </div>
        {preview ? (
          <Button type="button" variant="ghost" size="sm" onClick={removeCurrent} disabled={busy}>
            <Trash2 className="h-3.5 w-4" />
            {phase === "remove" ? "Removing…" : "Remove"}
          </Button>
        ) : null}
      </div>
      <label
        className={cn(
          "relative flex cursor-pointer overflow-hidden rounded-3xl ring-1 ring-border transition-colors",
          kind === "file" ? "min-h-24 items-center px-4 py-4" : ASPECT[frameAspect],
          "bg-background/50 hover:ring-foreground/30",
          busy && "pointer-events-none",
        )}
        onDragOver={(event) => event.preventDefault()}
        onDrop={(event) => {
          event.preventDefault();
          onFile(event.dataTransfer.files?.[0]);
        }}
      >
        {kind === "file" ? (
          preview ? (
            <div className="flex min-w-0 items-center gap-3">
              <FileText className="h-5 w-5 shrink-0 text-muted" />
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">{fileLabelFromUrl(preview)}</p>
                <p className="text-[11px] text-muted">PDF uploaded</p>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3 text-sm text-muted">
              <FileText className="h-5 w-5" />
              Drop a PDF or click to upload
            </div>
          )
        ) : preview ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={preview}
            alt=""
            className={cn(
              "absolute inset-0 h-full w-full",
              aspectSelectable || frameAspect === "cover" ? "object-contain bg-black/80" : "object-cover",
            )}
          />
        ) : (
          <div className="media-ph absolute inset-0 grid place-items-center">
            <div className="px-4 text-center">
              <ImagePlus className="mx-auto h-5 w-5 text-muted" />
              <p className="mt-2 text-sm">Drop an image or click to crop and upload</p>
            </div>
          </div>
        )}
        <input
          ref={inputRef}
          type="file"
          accept={kind === "file" ? ACCEPT_FILE : ACCEPT_IMAGE}
          disabled={busy}
          className="absolute inset-0 cursor-pointer opacity-0"
          onChange={(event) => onFile(event.target.files?.[0])}
        />
        {busy && phase === "remove" ? <MediaProgress label={status} /> : null}
      </label>
      {busy && phase === "upload" && !cropSrc ? <p className="text-xs text-muted">{status}{typeof percent === "number" ? ` ${percent}%` : "…"}</p> : null}
      {error ? <p className="text-xs text-red-400">{error}</p> : null}
      {cropSrc && kind === "image" ? (
        <ImageCropDialog
          src={cropSrc}
          aspect={aspect}
          title={label.toLowerCase()}
          busy={busy}
          status={status}
          percent={percent}
          selectable={aspectSelectable}
          onCancel={closeCrop}
          onConfirm={applyCrop}
        />
      ) : null}
    </div>
  );
}
