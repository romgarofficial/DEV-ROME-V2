"use client";

import {
  Archive,
  ArchiveRestore,
  ArrowLeft,
  Inbox,
  MailOpen,
  Mail,
  Reply,
  SquareArrowOutUpRight,
  Trash2,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { RichEditor, type RichEditorHandle } from "@/components/admin/rich-editor";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { PageHeading } from "@/components/ui/page-heading";
import { contactEmailSubject } from "@/lib/contact-email";
import { cn, formatDateTime, idOf } from "@/lib/utils";
import type { ContactMessageDoc } from "@/types";

type Folder = "inbox" | "archived";
type MailStatus = { configured: boolean; testSender: boolean };

function mailtoReply(item: ContactMessageDoc) {
  const subject = encodeURIComponent(`Re: ${contactEmailSubject(item.name)}`);
  const quoted = item.message
    .split("\n")
    .map((line) => `> ${line}`)
    .join("\n");
  const body = encodeURIComponent(`\n\n---\nOn ${formatDateTime(item.createdAt)}, ${item.name} wrote:\n${quoted}`);
  return `mailto:${item.email}?subject=${subject}&body=${body}`;
}

export function InboxBoard() {
  const router = useRouter();
  const editorRef = useRef<RichEditorHandle>(null);
  const [folder, setFolder] = useState<Folder>("inbox");
  const [items, setItems] = useState<ContactMessageDoc[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [archivedCount, setArchivedCount] = useState(0);
  const [mail, setMail] = useState<MailStatus>({ configured: true, testSender: false });
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<ContactMessageDoc | null>(null);
  const [deleting, setDeleting] = useState(false);

  const selected = items.find((item) => idOf(item) === selectedId) ?? null;

  const load = useCallback(async (nextFolder: Folder) => {
    const res = await fetch(`/api/inbox?folder=${nextFolder}`);
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      toast.error(data.error || "Could not load inbox");
      return [];
    }
    setItems(data.items ?? []);
    setUnreadCount(data.unreadCount ?? 0);
    setArchivedCount(data.archivedCount ?? 0);
    if (data.mail) setMail(data.mail);
    return (data.items ?? []) as ContactMessageDoc[];
  }, []);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    load(folder)
      .then((next) => {
        if (cancelled) return;
        setSelectedId((current) => {
          if (current && next.some((item) => idOf(item) === current)) return current;
          return null;
        });
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [folder, load]);

  function refreshNav() {
    router.refresh();
  }

  async function patch(id: string, action: "read" | "unread" | "archive" | "unarchive") {
    const res = await fetch(`/api/inbox/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      toast.error(data.error || "Could not update the message");
      return null;
    }
    const item = data.item as ContactMessageDoc;
    const stays = folder === "archived" ? item.status === "archived" : item.status !== "archived";
    setItems((current) => {
      if (!stays) return current.filter((entry) => idOf(entry) !== id);
      return current.map((entry) => (idOf(entry) === id ? item : entry));
    });
    if (!stays) setSelectedId((current) => (current === id ? null : current));
    await load(folder);
    refreshNav();
    return item;
  }

  async function openMessage(item: ContactMessageDoc) {
    const id = idOf(item);
    setSelectedId(id);
    if (item.status === "unread") {
      await patch(id, "read");
    }
  }

  async function sendReply() {
    if (!selected) return;
    if (editorRef.current?.isEmpty()) {
      toast.error("Write a reply before sending.");
      return;
    }
    setSending(true);
    const res = await fetch(`/api/inbox/${idOf(selected)}/reply`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ html: editorRef.current?.getHtml() ?? "" }),
    });
    const data = await res.json().catch(() => ({}));
    setSending(false);
    if (!res.ok) {
      toast.error(data.error || "Could not send the reply");
      return;
    }
    editorRef.current?.clear();
    toast.success("Reply sent");
    setItems((current) =>
      current.map((entry) => (idOf(entry) === idOf(selected) ? (data.item as ContactMessageDoc) : entry)),
    );
    refreshNav();
  }

  async function confirmDelete() {
    if (!pendingDelete) return;
    setDeleting(true);
    const id = idOf(pendingDelete);
    const res = await fetch(`/api/inbox/${id}`, { method: "DELETE" });
    setDeleting(false);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      toast.error(data.error || "Could not delete the message");
      return;
    }
    setPendingDelete(null);
    setItems((current) => current.filter((entry) => idOf(entry) !== id));
    setSelectedId((current) => (current === id ? null : current));
    await load(folder);
    refreshNav();
    toast.success("Message deleted");
  }

  return (
    <div className="space-y-6">
      <PageHeading
        kicker="Mail"
        title="Inbox"
        description="Messages from the public contact form. You still get the email — this is the working copy."
      />

      {mail.testSender ? (
        <div className="rounded-3xl border border-accent/30 bg-accent/8 px-4 py-3 text-sm leading-6 text-foreground">
          Acknowledgements and inbox replies cannot reach visitors yet. Resend is still on the test sender, which only
          delivers to your Resend account. Verify a domain at{" "}
          <a href="https://resend.com/domains" target="_blank" rel="noreferrer" className="text-accent underline-offset-2 hover:underline">
            resend.com/domains
          </a>
          , then set <code className="text-xs">RESEND_FROM</code> to an address on that domain — for example{" "}
          <code className="text-xs">ROME &lt;hello@mail.dev-rome.com&gt;</code>. Until then, use “Open in mail app” to
          reply from Gmail.
        </div>
      ) : null}

      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          size="sm"
          variant={folder === "inbox" ? "default" : "outline"}
          onClick={() => {
            setFolder("inbox");
            setSelectedId(null);
          }}
        >
          <Inbox className="h-3.5 w-3.5" />
          Inbox
          {unreadCount ? (
            <span className="ml-1 rounded-full bg-accent px-1.5 py-px text-[10px] font-semibold text-accent-fg">
              {unreadCount}
            </span>
          ) : null}
        </Button>
        <Button
          type="button"
          size="sm"
          variant={folder === "archived" ? "default" : "outline"}
          onClick={() => {
            setFolder("archived");
            setSelectedId(null);
          }}
        >
          <Archive className="h-3.5 w-3.5" />
          Archived
          {archivedCount ? <span className="text-muted">({archivedCount})</span> : null}
        </Button>
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,22rem)_minmax(0,1fr)]">
        <div className={cn("glass overflow-hidden rounded-3xl ring-1 ring-border", selected && "hidden xl:block")}>
          {loading ? (
            <p className="px-5 py-10 text-sm text-muted">Loading messages…</p>
          ) : items.length === 0 ? (
            <p className="px-5 py-10 text-sm text-muted">
              {folder === "archived" ? "Nothing archived yet." : "No messages yet."}
            </p>
          ) : (
            <ul className="divide-y divide-border">
              {items.map((item) => {
                const id = idOf(item);
                const unread = item.status === "unread";
                return (
                  <li key={id}>
                    <button
                      type="button"
                      onClick={() => openMessage(item)}
                      className={cn(
                        "flex w-full items-start gap-3 px-4 py-3.5 text-left transition-colors hover:bg-foreground/5",
                        selectedId === id && "bg-foreground/6",
                      )}
                    >
                      <span
                        className={cn(
                          "mt-1.5 h-2 w-2 shrink-0 rounded-full",
                          unread ? "bg-accent shadow-[0_0_0_4px_color-mix(in_oklab,var(--accent)_22%,transparent)]" : "bg-transparent ring-1 ring-border",
                        )}
                        aria-hidden
                      />
                      <span className="min-w-0 flex-1">
                        <span className="flex items-baseline justify-between gap-3">
                          <span className={cn("truncate text-sm", unread ? "font-semibold" : "font-medium")}>
                            {item.name}
                          </span>
                          <span className="shrink-0 text-[11px] text-muted">{formatDateTime(item.createdAt)}</span>
                        </span>
                        <span className="mt-0.5 block truncate text-xs text-muted">{item.email}</span>
                        <span className="mt-1 line-clamp-2 text-xs leading-5 text-muted">{item.message}</span>
                        {item.replies?.length ? (
                          <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-foreground/6 px-2 py-0.5 text-[10px] tracking-wide text-muted uppercase">
                            <Reply className="h-3 w-3" />
                            Replied
                          </span>
                        ) : null}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <div className={cn("glass rounded-3xl p-5 ring-1 ring-border sm:p-6", !selected && "hidden xl:block")}>
          {!selected ? (
            <div className="flex min-h-72 flex-col items-center justify-center text-center">
              <Mail className="h-8 w-8 text-muted" />
              <p className="mt-3 text-sm text-muted">Select a message to read and reply.</p>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex min-w-0 items-start gap-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="xl:hidden"
                    aria-label="Back to list"
                    onClick={() => setSelectedId(null)}
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="font-display text-2xl tracking-tight">{selected.name}</h2>
                      {selected.status === "unread" ? (
                        <span className="rounded-full bg-accent px-2 py-0.5 text-[10px] font-semibold tracking-wide text-accent-fg uppercase">
                          Unread
                        </span>
                      ) : selected.status === "archived" ? (
                        <span className="rounded-full border border-border px-2 py-0.5 text-[10px] tracking-wide text-muted uppercase">
                          Archived
                        </span>
                      ) : (
                        <span className="rounded-full border border-border px-2 py-0.5 text-[10px] tracking-wide text-muted uppercase">
                          Read
                        </span>
                      )}
                    </div>
                    <a href={`mailto:${selected.email}`} className="mt-1 block truncate text-sm text-accent">
                      {selected.email}
                    </a>
                    <p className="mt-1 text-xs text-muted">{formatDateTime(selected.createdAt)}</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {selected.status === "archived" ? (
                    <Button type="button" variant="outline" size="sm" onClick={() => patch(idOf(selected), "unarchive")}>
                      <ArchiveRestore className="h-3.5 w-3.5" />
                      Unarchive
                    </Button>
                  ) : (
                    <>
                      {selected.status === "read" ? (
                        <Button type="button" variant="outline" size="sm" onClick={() => patch(idOf(selected), "unread")}>
                          <Mail className="h-3.5 w-3.5" />
                          Mark unread
                        </Button>
                      ) : (
                        <Button type="button" variant="outline" size="sm" onClick={() => patch(idOf(selected), "read")}>
                          <MailOpen className="h-3.5 w-3.5" />
                          Mark read
                        </Button>
                      )}
                      <Button type="button" variant="outline" size="sm" onClick={() => patch(idOf(selected), "archive")}>
                        <Archive className="h-3.5 w-3.5" />
                        Archive
                      </Button>
                    </>
                  )}
                  {selected.status !== "archived" ? (
                    <Button variant="outline" size="sm" asChild>
                      <a href={mailtoReply(selected)}>
                        <SquareArrowOutUpRight className="h-3.5 w-3.5" />
                        Open in mail app
                      </a>
                    </Button>
                  ) : null}
                  <Button type="button" variant="destructive" size="sm" onClick={() => setPendingDelete(selected)}>
                    <Trash2 className="h-3.5 w-3.5" />
                    Delete
                  </Button>
                </div>
              </div>

              <div className="rounded-2xl border border-border bg-background/50 px-4 py-4">
                <p className="whitespace-pre-wrap text-sm leading-7">{selected.message}</p>
              </div>

              {selected.replies?.length ? (
                <div className="space-y-3">
                  <p className="text-[11px] tracking-[0.22em] text-muted uppercase">Replies sent</p>
                  {selected.replies.map((reply, index) => (
                    <div key={`${reply.createdAt}-${index}`} className="rounded-2xl border border-border px-4 py-3">
                      <p className="text-[11px] text-muted">{formatDateTime(reply.createdAt)}</p>
                      <div
                        className="rich-html mt-2 text-sm leading-6"
                        dangerouslySetInnerHTML={{ __html: reply.html }}
                      />
                    </div>
                  ))}
                </div>
              ) : null}

              {selected.status !== "archived" ? (
                <div className="space-y-3">
                  <p className="text-[11px] tracking-[0.22em] text-muted uppercase">Reply</p>
                  <RichEditor key={idOf(selected)} ref={editorRef} placeholder="Write a reply with formatting…" />
                  <div className="flex justify-end">
                    <Button type="button" onClick={sendReply} disabled={sending}>
                      <Reply className="h-4 w-4" />
                      {sending ? "Sending…" : "Send reply"}
                    </Button>
                  </div>
                </div>
              ) : null}
            </div>
          )}
        </div>
      </div>

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title="Delete this message?"
        description="This removes it from the inbox. The original email in your mailbox is not affected."
        busy={deleting}
        onConfirm={confirmDelete}
        onOpenChange={(open) => {
          if (!open && !deleting) setPendingDelete(null);
        }}
      />
    </div>
  );
}
