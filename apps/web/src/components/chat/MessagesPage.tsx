"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { MessageSquare, Send, User } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/components/auth/AuthProvider";
import { apiErrorMessage } from "@/components/auth/auth-helpers";
import { useConversations, useMessages, useSendMessage, useMarkConversationRead, useCreateConversation } from "@/hooks/use-messages";
import { useUsers } from "@/hooks/use-api";
import { NewConversationSheet } from "@/app/coach/_components/NewConversationSheet";
import { PageShell, PageHeader } from "@/components/twilight/Page";
import { EmptyState } from "@/components/twilight/controls";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Textarea";
import { Loading, ErrorDisplay } from "@/components/ui/DataState";
import { cn, formatRelativeTime } from "@/lib/utils";

export function MessagesPage({ role }: { role: "athlete" | "coach" }) {
  return <Suspense fallback={<Loading />}><MessagesInner role={role} /></Suspense>;
}

function MessagesInner({ role }: { role: "athlete" | "coach" }) {
  const { user } = useAuth();
  const params = useSearchParams();
  const router = useRouter();
  const conversationsQuery = useConversations(user?.id);
  const conversations = conversationsQuery.data?.data ?? [];
  const requested = params.get("c");
  const conversation = requested ? conversations.find((row) => row.id === requested) : conversations[0];
  const messagesQuery = useMessages(conversation?.id);
  const send = useSendMessage();
  const create = useCreateConversation();
  const athletes = useUsers("athlete");
  const [newOpen, setNewOpen] = useState(false);
  const { mutate: markRead } = useMarkConversationRead();
  const [body, setBody] = useState("");
  const rows = messagesQuery.data?.data ?? [];
  const unread = rows.some((row) => row.senderId !== user?.id && !row.readAt);
  const candidates = (athletes.data?.data ?? []).filter((athlete) =>
    !conversations.some((row) => row.athleteId === athlete.id));

  const startConversation = async (participantId: string) => {
    if (!user || user.role !== "coach" || create.isPending) return;
    try {
      const result = await create.mutateAsync({ participantId, userId: user.id });
      if (!result.data) throw new Error("شناسه گفت‌وگو برنگشت");
      setNewOpen(false);
      router.replace(`/coach/messages?c=${result.data.id}`, { scroll: false });
    } catch (error) {
      toast.error(apiErrorMessage(error, "ساخت گفت‌وگو ناموفق بود"));
    }
  };

  useEffect(() => {
    if (conversation && user && unread) markRead({ conversationId: conversation.id, userId: user.id });
  }, [conversation, user, unread, markRead]);

  const handleSend = async () => {
    if (!conversation || !user || !body.trim() || send.isPending) return;
    try {
      await send.mutateAsync({ conversationId: conversation.id, senderId: user.id, body: body.trim() });
      setBody("");
      toast.success("پیام ارسال شد");
    } catch (error) {
      toast.error(apiErrorMessage(error, "ارسال پیام ناموفق بود"));
    }
  };

  if (conversationsQuery.isLoading) return <Loading />;
  if (conversationsQuery.isError) return <ErrorDisplay message={conversationsQuery.error?.message} onRetry={conversationsQuery.refetch} />;

  const participant = conversation?.participant;
  const name = participant ? `${participant.firstName} ${participant.lastName}` : "گفت‌وگو";
  return (
    <PageShell>
      <PageHeader title="پیام‌ها" subtitle={role === "coach" ? "گفت‌وگو با شاگردان" : "گفت‌وگوی مستقیم با مربی شما"}
        action={role === "coach" ? <Button onClick={() => setNewOpen(true)}>گفت‌وگوی تازه</Button> : undefined} />
      {conversations.length === 0 ? (
        <EmptyState icon={<MessageSquare className="h-6 w-6" />} title="هنوز گفت‌وگویی ندارید" />
      ) : (
        <div className="grid min-w-0 gap-4 lg:grid-cols-3">
          <div className="flex min-w-0 flex-col gap-2 lg:col-span-1" aria-label="گفت‌وگوها">
            {conversations.map((row) => (
              <Button key={row.id} variant="ghost" className="h-auto min-w-0 justify-start whitespace-normal text-start"
                aria-pressed={row.id === conversation?.id}
                onClick={() => { setBody(""); router.replace(`/${role}/messages?c=${row.id}`, { scroll: false }); }}>
                <span className="min-w-0 break-words">
                  {row.participant ? `${row.participant.firstName} ${row.participant.lastName}` : "گفت‌وگو"}
                  {row.unreadCount > 0 && <span className="ms-2 text-xs">({row.unreadCount})</span>}
                </span>
              </Button>
            ))}
          </div>
          {!conversation ? <ErrorDisplay message="گفت‌وگو یافت نشد" /> : (
            <section className="min-w-0 overflow-hidden rounded-2xl border border-border bg-card lg:col-span-2" aria-label={name}>
              <div className="flex items-center gap-3 border-b border-border px-4 py-3.5">
                <User className="h-5 w-5" /><h2 className="text-sm font-semibold">{name}</h2>
              </div>
              <div className="space-y-4 p-4">
                {messagesQuery.isLoading ? <Loading /> : messagesQuery.isError ? (
                  <ErrorDisplay message={messagesQuery.error?.message} onRetry={messagesQuery.refetch} />
                ) : (
                  <div className="flex max-h-[28rem] flex-col gap-3 overflow-y-auto py-2" role="log" aria-live="polite" aria-label="تاریخچه گفت‌وگو">
                    {rows.length === 0 && <p className="text-xs text-muted-foreground">اولین پیام را بنویسید</p>}
                    {rows.map((message) => (
                      <div key={message.id} className={cn("flex", message.senderId === user?.id ? "justify-start" : "justify-end")}>
                        <div className={cn("max-w-[86%] rounded-2xl px-4 py-3 sm:max-w-[72%]", message.senderId === user?.id ? "bg-primary text-primary-foreground" : "border border-border bg-secondary")}>
                          <p className="break-words text-sm leading-7 [overflow-wrap:anywhere]">{message.body}</p>
                          <time dateTime={message.createdAt} className="mt-1.5 block text-xs">{formatRelativeTime(message.createdAt)}</time>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                <Textarea aria-label="متن پیام" placeholder="پیام خود را بنویسید..." value={body} onChange={(event) => setBody(event.target.value)} maxLength={2000} disabled={send.isPending} rows={3} />
                <Button onClick={handleSend} loading={send.isPending} disabled={!body.trim() || messagesQuery.isError}>
                  <Send className="h-4 w-4" />ارسال پیام
                </Button>
              </div>
            </section>
          )}
        </div>
      )}
      {role === "coach" && <NewConversationSheet open={newOpen} onOpenChange={setNewOpen}
        candidates={candidates} loading={athletes.isLoading} pending={create.isPending} onSubmit={startConversation} />}
    </PageShell>
  );
}
