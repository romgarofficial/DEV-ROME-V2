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
import { GalleryUpload } from "@/components/admin/gallery-upload";
import { MediaUpload } from "@/components/admin/media-upload";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input, Label, Textarea } from "@/components/ui/fields";
import { PageHeading } from "@/components/ui/page-heading";
import { Switch } from "@/components/ui/switch";
import type { CollectionConfig } from "@/types";
import { idOf, slugify } from "@/lib/utils";

type Item = Record<string, unknown> & { _id?: string };

function apiPath(config: CollectionConfig, id?: string) {
  const base = config.apiBase ?? `/api/items/${config.key}`;
  return id ? `${base}/${id}` : base;
}

export function EntityManager({ config }: { config: CollectionConfig }) {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Item | null>(null);
  const [pendingDelete, setPendingDelete] = useState<Item | null>(null);
  const [deleting, setDeleting] = useState(false);
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }));

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetch(apiPath(config))
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
  }, [config.key, config.apiBase]);

  async function reload() {
    const res = await fetch(apiPath(config));
    const data = await res.json();
    setItems(data.items ?? []);
  }

  async function onDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = items.findIndex((item) => idOf(item) === active.id);
    const newIndex = items.findIndex((item) => idOf(item) === over.id);
    const next = arrayMove(items, oldIndex, newIndex);
    setItems(next);
    await fetch(apiPath(config), {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids: next.map((item) => idOf(item)) }),
    });
  }

  async function remove(item: Item) {
    setDeleting(true);
    const res = await fetch(apiPath(config, idOf(item)), { method: "DELETE" });
    setDeleting(false);
    if (!res.ok) {
      toast.error("Could not delete");
      return;
    }
    toast.success("Deleted");
    setPendingDelete(null);
    reload();
  }

  async function toggle(item: Item, field: "published" | "featured", value: boolean) {
    await fetch(apiPath(config, idOf(item)), {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ [field]: value }),
    });
    reload();
  }

  return (
    <div className="space-y-6">
      <PageHeading
        kicker="Content"
        title={config.title}
        description={config.description}
        action={
          <Button
            onClick={() => {
              setEditing(null);
              setOpen(true);
            }}
          >
            <Plus className="h-4 w-4" />
            Add {config.singular}
          </Button>
        }
      />

      <Card className="overflow-hidden">
        {loading ? (
          <p className="p-6 text-sm text-muted">Loading…</p>
        ) : items.length === 0 ? (
          <p className="p-6 text-sm text-muted">Nothing here yet. Add your first {config.singular.toLowerCase()}.</p>
        ) : (
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
            <SortableContext items={items.map(idOf)} strategy={verticalListSortingStrategy}>
              <ul className="divide-y divide-border">
                {items.map((item) => (
                  <SortableRow
                    key={idOf(item)}
                    item={item}
                    onEdit={() => {
                      setEditing(item);
                      setOpen(true);
                    }}
                    onDelete={() => setPendingDelete(item)}
                    onToggle={toggle}
                  />
                ))}
              </ul>
            </SortableContext>
          </DndContext>
        )}
      </Card>

      <ItemDialog
        key={`${open}-${editing?._id ?? "new"}`}
        open={open}
        onOpenChange={setOpen}
        config={config}
        item={editing}
        onSaved={() => {
          setOpen(false);
          reload();
        }}
      />

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title={`Delete ${config.singular.toLowerCase()}`}
        description={`Delete “${String(pendingDelete?.title || pendingDelete?.name || "this item")}”? This cannot be undone.`}
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

function SortableRow({
  item,
  onEdit,
  onDelete,
  onToggle,
}: {
  item: Item;
  onEdit: () => void;
  onDelete: () => void;
  onToggle: (item: Item, field: "published" | "featured", value: boolean) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: idOf(item),
  });
  const style = { transform: CSS.Transform.toString(transform), transition };
  const title = String(item.title || item.name || "Untitled");

  return (
    <li ref={setNodeRef} style={style} className="flex items-center gap-3 px-4 py-3 sm:px-5">
      <button className="cursor-grab text-muted" {...attributes} {...listeners}>
        <GripVertical className="h-4 w-4" />
      </button>
      <div className="min-w-0 flex-1">
        <p className="truncate font-medium">{title}</p>
        <p className="truncate text-xs text-muted">
          {String(item.organization || item.issuer || item.provider || item.category || "")}
        </p>
      </div>
      <div className="hidden items-center gap-2 sm:flex">
        <span className="text-xs text-muted">Live</span>
        <Switch
          checked={item.published !== false}
          onCheckedChange={(value) => onToggle(item, "published", value)}
        />
      </div>
      <Button variant="ghost" size="icon" onClick={onEdit}>
        <Pencil className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="icon" onClick={onDelete}>
        <Trash2 className="h-4 w-4" />
      </Button>
    </li>
  );
}

function ItemDialog({
  open,
  onOpenChange,
  config,
  item,
  onSaved,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  config: CollectionConfig;
  item: Item | null;
  onSaved: () => void;
}) {
  const [form, setForm] = useState<Item>(item ?? {});
  const [saving, setSaving] = useState(false);

  function setField(name: string, value: unknown) {
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function save() {
    setSaving(true);
    const payload = { ...form };
    if (config.key === "projects" && !payload.slug && payload.title) {
      payload.slug = slugify(String(payload.title));
    }
    const isEdit = Boolean(item?._id);
    const url = isEdit ? apiPath(config, String(item?._id)) : apiPath(config);
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
    toast.success("Saved");
    onSaved();
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogTitle className="font-display text-2xl">
          {item ? `Edit ${config.singular}` : `New ${config.singular}`}
        </DialogTitle>
        <div className="mt-4 grid gap-4">
          {config.fields.map((field) => (
            <FieldControl
              key={field.name}
              field={field}
              value={form[field.name]}
              onChange={(value) => setField(field.name, value)}
            />
          ))}
        </div>
        <div className="mt-6 flex justify-end gap-2">
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={save} disabled={saving}>
            {saving ? "Saving…" : "Save"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function FieldControl({
  field,
  value,
  onChange,
}: {
  field: CollectionConfig["fields"][number];
  value: unknown;
  onChange: (value: unknown) => void;
}) {
  if (field.type === "checkbox") {
    return (
      <label className="flex items-center justify-between gap-3">
        <span className="text-sm">{field.label}</span>
        <Switch checked={Boolean(value)} onCheckedChange={onChange} />
      </label>
    );
  }

  if (field.type === "file") {
    return (
      <MediaUpload
        kind="file"
        label={field.label}
        hint="PDF only — no crop."
        value={typeof value === "string" ? value : ""}
        onChange={onChange}
        aspectSelectable={false}
      />
    );
  }

  if (field.type === "image") {
    return (
      <MediaUpload
        label={field.label}
        value={typeof value === "string" ? value : ""}
        onChange={onChange}
        aspect={field.aspect ?? "square"}
        aspectSelectable={field.aspectSelectable ?? true}
      />
    );
  }

  if (field.type === "gallery") {
    return (
      <GalleryUpload
        label={field.label}
        value={Array.isArray(value) ? (value as string[]) : []}
        onChange={onChange}
      />
    );
  }

  if (field.type === "textarea" || field.type === "markdown") {
    return (
      <div className="space-y-1.5">
        <Label>{field.label}</Label>
        <Textarea
          value={String(value ?? "")}
          placeholder={field.placeholder}
          onChange={(event) => onChange(event.target.value)}
        />
      </div>
    );
  }

  if (field.type === "tags") {
    return (
      <div className="space-y-1.5">
        <Label>{field.label}</Label>
        <Input
          value={Array.isArray(value) ? value.join(", ") : String(value ?? "")}
          placeholder={field.placeholder}
          onChange={(event) =>
            onChange(
              event.target.value
                .split(",")
                .map((part) => part.trim())
                .filter(Boolean),
            )
          }
        />
      </div>
    );
  }

  if (field.type === "select") {
    return (
      <div className="space-y-1.5">
        <Label>{field.label}</Label>
        <select
          className="h-11 w-full rounded-2xl border border-border bg-background/70 px-3.5 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
          value={String(value ?? field.options?.[0]?.value ?? "")}
          onChange={(event) => onChange(event.target.value)}
        >
          {field.options?.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    );
  }

  return (
    <div className="space-y-1.5">
      <Label>{field.label}</Label>
      <Input
        type={field.type === "number" ? "number" : field.type === "date" ? "date" : field.type === "url" ? "url" : "text"}
        required={field.required}
        placeholder={field.placeholder}
        value={String(value ?? "")}
        onChange={(event) =>
          onChange(field.type === "number" ? Number(event.target.value) : event.target.value)
        }
      />
    </div>
  );
}
