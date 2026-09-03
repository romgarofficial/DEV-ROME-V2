"use client";

import {
  DndContext,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Pencil, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { MediaUpload } from "@/components/admin/media-upload";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { Input, Label, Textarea } from "@/components/ui/fields";
import { PageHeading } from "@/components/ui/page-heading";
import { Switch } from "@/components/ui/switch";
import { isCustomSection } from "@/lib/constants";
import { idOf } from "@/lib/utils";

type SectionItem = {
  _id: string;
  key: string;
  label: string;
  visible: boolean;
  order: number;
  kind?: "system" | "custom";
  kicker?: string;
  heading?: string;
  body?: string;
  imageUrl?: string;
  imageAlt?: string;
};

type SectionForm = {
  label: string;
  kicker: string;
  heading: string;
  body: string;
  imageUrl: string;
  imageAlt: string;
};

const emptyForm: SectionForm = {
  label: "",
  kicker: "",
  heading: "",
  body: "",
  imageUrl: "",
  imageAlt: "",
};

export function SectionBoard() {
  const [items, setItems] = useState<SectionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<SectionItem | null>(null);
  const [pendingDelete, setPendingDelete] = useState<SectionItem | null>(null);
  const [deleting, setDeleting] = useState(false);
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }));

  async function reload() {
    const res = await fetch("/api/sections");
    const data = await res.json();
    setItems(data.items ?? []);
  }

  useEffect(() => {
    let cancelled = false;
    fetch("/api/sections")
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled) setItems(data.items ?? []);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  async function persist(next: SectionItem[]) {
    setItems(next);
    const res = await fetch("/api/sections", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        items: next.map((item, index) => ({
          _id: item._id,
          order: index,
          visible: item.visible,
          label: item.label,
        })),
      }),
    });
    if (!res.ok) {
      toast.error("Could not update sections");
      reload();
      return;
    }
    toast.success("Sections updated");
  }

  function onDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = items.findIndex((item) => idOf(item) === active.id);
    const newIndex = items.findIndex((item) => idOf(item) === over.id);
    persist(arrayMove(items, oldIndex, newIndex));
  }

  function toggle(id: string, visible: boolean) {
    persist(items.map((item) => (item._id === id ? { ...item, visible } : item)));
  }

  async function remove(item: SectionItem) {
    if (!isCustomSection(item)) return;
    setDeleting(true);
    const res = await fetch(`/api/sections/${item._id}`, { method: "DELETE" });
    setDeleting(false);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      toast.error(data.error || "Could not delete");
      return;
    }
    toast.success("Section deleted");
    setPendingDelete(null);
    reload();
  }

  return (
    <div className="space-y-6">
      <PageHeading
        kicker="Site"
        title="Sections"
        description="Add custom pages of content, then drag to reorder. Built-in sections stay structured — hide them if you do not need them. Hidden sections do not render on the public site."
        action={
          <Button
            onClick={() => {
              setEditing(null);
              setOpen(true);
            }}
          >
            <Plus className="h-4 w-4" />
            Add section
          </Button>
        }
      />
      <Card className="overflow-hidden">
        {loading ? (
          <p className="p-6 text-sm text-muted">Loading…</p>
        ) : (
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
            <SortableContext items={items.map(idOf)} strategy={verticalListSortingStrategy}>
              <ul className="divide-y divide-border">
                {items.map((item) => (
                  <SectionRow
                    key={item._id}
                    item={item}
                    onToggle={toggle}
                    onEdit={() => {
                      setEditing(item);
                      setOpen(true);
                    }}
                    onDelete={() => setPendingDelete(item)}
                  />
                ))}
              </ul>
            </SortableContext>
          </DndContext>
        )}
      </Card>

      <SectionDialog
        key={`${open}-${editing?._id ?? "new"}`}
        open={open}
        item={editing}
        onOpenChange={setOpen}
        onSaved={() => {
          setOpen(false);
          reload();
        }}
      />

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title="Delete section"
        description={`Delete “${pendingDelete?.label}”? This cannot be undone.`}
        busy={deleting}
        onOpenChange={(open) => {
          if (!open && !deleting) setPendingDelete(null);
        }}
        onConfirm={() => {
          if (pendingDelete) remove(pendingDelete);
        }}
      />
    </div>
  );
}

function SectionRow({
  item,
  onToggle,
  onEdit,
  onDelete,
}: {
  item: SectionItem;
  onToggle: (id: string, visible: boolean) => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: item._id,
  });
  const custom = isCustomSection(item);

  return (
    <li
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className="flex items-center gap-3 px-4 py-3 sm:px-5"
    >
      <button type="button" className="cursor-grab text-muted" {...attributes} {...listeners}>
        <GripVertical className="h-4 w-4" />
      </button>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <p className="truncate font-medium">{item.label}</p>
          <span className="rounded-full bg-foreground/8 px-2 py-0.5 text-[10px] tracking-[0.12em] text-muted uppercase">
            {custom ? "Custom" : "Built-in"}
          </span>
        </div>
        <p className="truncate text-xs text-muted">#{item.key}</p>
      </div>
      <span className="hidden text-xs text-muted sm:inline">{item.visible ? "Visible" : "Hidden"}</span>
      <Switch checked={item.visible} onCheckedChange={(value) => onToggle(item._id, value)} />
      <Button type="button" variant="ghost" size="icon" aria-label={`Edit ${item.label}`} onClick={onEdit}>
        <Pencil className="h-4 w-4" />
      </Button>
      {custom ? (
        <Button type="button" variant="ghost" size="icon" aria-label={`Delete ${item.label}`} onClick={onDelete}>
          <Trash2 className="h-4 w-4" />
        </Button>
      ) : null}
    </li>
  );
}

function SectionDialog({
  open,
  item,
  onOpenChange,
  onSaved,
}: {
  open: boolean;
  item: SectionItem | null;
  onOpenChange: (open: boolean) => void;
  onSaved: () => void;
}) {
  const custom = !item || isCustomSection(item);
  const [form, setForm] = useState<SectionForm>(
    item
      ? {
          label: item.label,
          kicker: item.kicker ?? "",
          heading: item.heading ?? "",
          body: item.body ?? "",
          imageUrl: item.imageUrl ?? "",
          imageAlt: item.imageAlt ?? "",
        }
      : emptyForm,
  );
  const [saving, setSaving] = useState(false);
  const [uploadBusy, setUploadBusy] = useState(false);

  async function save() {
    if (!form.label.trim()) {
      toast.error("Label is required");
      return;
    }
    setSaving(true);
    const isEdit = Boolean(item?._id);
    const url = isEdit ? `/api/sections/${item?._id}` : "/api/sections";
    const payload = custom
      ? form
      : { label: form.label };
    const res = await fetch(url, {
      method: isEdit ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    setSaving(false);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      toast.error(data.error || "Save failed");
      return;
    }
    toast.success(isEdit ? "Section updated" : "Section added");
    onSaved();
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogTitle className="font-display pr-8 text-2xl">
          {item ? (custom ? "Edit section" : "Rename section") : "New section"}
        </DialogTitle>
        <DialogDescription className="mt-1 text-sm text-muted">
          {custom
            ? "This appears in the sidenav and on the public site. Markdown is supported in the body."
            : "Built-in sections keep their structured content. You can only change the nav label."}
        </DialogDescription>
        <div className="mt-4 grid gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="section-label">Label</Label>
            <Input
              id="section-label"
              value={form.label}
              maxLength={60}
              placeholder="Speaking"
              onChange={(event) => setForm((current) => ({ ...current, label: event.target.value }))}
            />
          </div>
          {custom ? (
            <>
              <div className="space-y-1.5">
                <Label htmlFor="section-kicker">Kicker</Label>
                <Input
                  id="section-kicker"
                  value={form.kicker}
                  maxLength={80}
                  placeholder="Optional overline"
                  onChange={(event) => setForm((current) => ({ ...current, kicker: event.target.value }))}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="section-heading">Heading</Label>
                <Input
                  id="section-heading"
                  value={form.heading}
                  maxLength={120}
                  placeholder="Defaults to the label"
                  onChange={(event) => setForm((current) => ({ ...current, heading: event.target.value }))}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="section-body">Body</Label>
                <Textarea
                  id="section-body"
                  className="min-h-40"
                  value={form.body}
                  placeholder="Markdown is welcome — headings, lists, and links."
                  onChange={(event) => setForm((current) => ({ ...current, body: event.target.value }))}
                />
              </div>
              <MediaUpload
                label="Image"
                hint="Optional. Cropped to 16:9."
                aspect="cover"
                value={form.imageUrl}
                onBusyChange={setUploadBusy}
                onChange={(imageUrl) => setForm((current) => ({ ...current, imageUrl }))}
              />
              {form.imageUrl ? (
                <div className="space-y-1.5">
                  <Label htmlFor="section-image-alt">Image alt text</Label>
                  <Input
                    id="section-image-alt"
                    value={form.imageAlt}
                    maxLength={200}
                    placeholder="Describe the image"
                    onChange={(event) => setForm((current) => ({ ...current, imageAlt: event.target.value }))}
                  />
                </div>
              ) : null}
            </>
          ) : null}
        </div>
        <div className="mt-6 flex justify-end gap-2">
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={save} disabled={saving || uploadBusy}>
            {saving ? "Saving…" : "Save"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
