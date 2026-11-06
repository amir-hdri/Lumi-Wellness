"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/Dialog";
import { cn, parseApiDate, formatPersianNumber } from "@/lib/utils";
import { Bell, Calendar, MessageSquare, CreditCard, Dumbbell, CheckCheck, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/components/auth/AuthProvider";
import { useNotifications, useMarkNotificationRead, useMarkAllNotificationsRead, useDeleteNotification } from "@/hooks/use-api";
import { Loading, ErrorDisplay } from "@/components/ui/DataState";
import { PageShell, PageHeader } from "@/components/twilight/Page";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/twilight/controls";

const typeIcons: Record<string, React.ReactNode> = {
  info: <Bell className="h-5 w-5 text-muted-foreground" strokeWidth={1.75} />,
  success: <Dumbbell className="h-5 w-5 text-primary" strokeWidth={1.75} />,
  warning: <CreditCard className="h-5 w-5 text-warning" strokeWidth={1.75} />,
  error: <MessageSquare className="h-5 w-5 text-destructive" strokeWidth={1.75} />,
  reminder: <Calendar className="h-5 w-5 text-primary" strokeWidth={1.75} />,
};

export default function NotificationsPage() {
  const { user } = useAuth();
  const athleteId = user?.id;
  const { data, isLoading, isError, error } = useNotifications(athleteId);
  const markRead = useMarkNotificationRead();
  const markAllRead = useMarkAllNotificationsRead();
  const deleteNotification = useDeleteNotification();
  const [pendingDelete, setPendingDelete] = useState<{ id: string; title: string } | null>(null);

  const notifications = data?.data || [];
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleMarkAllRead = () => {
    if (athleteId) {
      markAllRead.mutate(athleteId, {
        onSuccess: () => toast.success("همه اعلان‌ها به عنوان خوانده شده علامت خوردند"),
        onError: () => toast.error("خواندن اعلان‌ها ناموفق بود؛ دوباره تلاش کنید."),
      });
    }
  };

  const handleMarkRead = (id: string) => {
    markRead.mutate(id, { onError: () => toast.error("خواندن اعلان ناموفق بود؛ دوباره تلاش کنید.") });
  };

  const handleDeleteConfirm = () => {
    if (!pendingDelete) return;
    deleteNotification.mutate(pendingDelete.id, {
      onSuccess: () => {
        toast.success("اعلان حذف شد");
        setPendingDelete(null);
      },
      onError: (e) => toast.error((e as Error)?.message || "حذف اعلان ناموفق بود"),
    });
  };

  if (isLoading) return <Loading />;
  if (isError) return <ErrorDisplay message={error?.message} />;

  return (
    <PageShell>
      <PageHeader
        title="اعلان‌ها"
        subtitle="پیام‌ها و یادآوری‌ها"
        className="flex-col sm:flex-row"
        action={
          <div className="flex max-w-full flex-wrap items-center gap-3">
            {unreadCount > 0 && (
              <>
                <Badge variant="default" className="border-transparent bg-blush-solid text-blush-foreground">{formatPersianNumber(unreadCount)} اعلان خوانده‌نشده</Badge>
                <Button variant="outline" size="sm" onClick={handleMarkAllRead} loading={markAllRead.isPending}>
                  <CheckCheck className="me-2 h-4 w-4" strokeWidth={1.75} />علامت همه به عنوان خوانده شده
                </Button>
              </>
            )}
          </div>
        }
      />

      {notifications.length === 0 ? (
        <EmptyState
          icon={<Bell className="h-6 w-6" strokeWidth={1.75} />}
          title="هیچ اعلانی وجود ندارد"
        />
      ) : (
        <div className="overflow-hidden rounded-2xl border border-border bg-card divide-y divide-border">
          {notifications.map((n) => {
            const timeAgo = getRelativeTime(n.createdAt);
            return (
              <div
                key={n.id}
                className={cn(
                  "flex items-start gap-3 px-4 py-3.5",
                  !n.isRead && "bg-blush/10"
                )}
              >
                <div className="mt-2 shrink-0" aria-hidden>{typeIcons[n.type] || typeIcons.info}</div>
                <button type="button" aria-label={`${n.isRead ? "اعلان خوانده‌شده" : "خواندن اعلان"}: ${n.title}`} disabled={n.isRead || markRead.isPending} onClick={() => handleMarkRead(n.id)} className="ring-focus min-h-11 min-w-0 flex-1 rounded-xl px-1 py-1 text-start transition-colors hover:bg-secondary disabled:cursor-default">
                  <div className="flex items-start justify-between gap-2">
                    <p className={cn("min-w-0 text-sm font-medium text-foreground", !n.isRead && "text-blush")}>{n.title}</p>
                    <div className="flex shrink-0 items-center gap-2">
                      <span className="text-xs text-muted-foreground">{timeAgo}</span>
                      {!n.isRead && <span className="h-2 w-2 shrink-0 rounded-full bg-blush-solid" />}
                    </div>
                  </div>
                  <p className="mt-0.5 line-clamp-2 text-sm text-muted-foreground">{n.message}</p>
                </button>
                <button
                  type="button"
                  aria-label={`حذف اعلان: ${n.title}`}
                  title={`حذف اعلان: ${n.title}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setPendingDelete({ id: n.id, title: n.title });
                  }}
                  className="flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-xl text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <Trash2 className="h-5 w-5" strokeWidth={1.75} />
                </button>
              </div>
            );
          })}
        </div>
      )}

      <Dialog open={pendingDelete !== null} onOpenChange={(open) => { if (!open) setPendingDelete(null); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>حذف اعلان</DialogTitle>
            <DialogDescription>
              «{pendingDelete?.title}» حذف شود؟ این عمل قابل بازگشت نیست.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPendingDelete(null)} disabled={deleteNotification.isPending}>
              انصراف
            </Button>
            <Button variant="destructive" onClick={handleDeleteConfirm} loading={deleteNotification.isPending}>
              حذف اعلان
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageShell>
  );
}

function getRelativeTime(dateStr: string): string {
  const diff = Date.now() - parseApiDate(dateStr).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "چند لحظه پیش";
  if (minutes < 60) return `${formatPersianNumber(minutes)} دقیقه پیش`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${formatPersianNumber(hours)} ساعت پیش`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${formatPersianNumber(days)} روز پیش`;
  return `${formatPersianNumber(Math.floor(days / 7))} هفته پیش`;
}
