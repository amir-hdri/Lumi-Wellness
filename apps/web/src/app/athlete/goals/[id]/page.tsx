"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronRight, Target, Calendar, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Progress } from "@/components/ui/Progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/Dialog";
import { PageShell, PageHeader, SectionTitle } from "@/components/twilight/Page";
import { TwilightCard } from "@/components/twilight/controls";
import { formatPersianNumber, formatDate, calculateProgress } from "@/lib/utils";
import { useGoal, useUpdateGoal, useDeleteGoal } from "@/hooks/use-api";
import { Loading, ErrorDisplay } from "@/components/ui/DataState";
import { GoalForm, clearGoalDraft, goalDraftKey } from "../GoalForm";

const statuses = { not_started: "شروع نشده", in_progress: "در حال انجام", achieved: "تکمیل شده", missed: "مهلت گذشته", paused: "متوقف" } as const;

export default function GoalDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const query = useGoal(id);
  const update = useUpdateGoal();
  const remove = useDeleteGoal();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteError, setDeleteError] = useState("");
  const goal = query.data?.data;
  if (query.isLoading) return <Loading />;
  if (query.isError || !goal) return <ErrorDisplay message={query.error?.message ?? "هدف یافت نشد"} onRetry={() => void query.refetch()} />;
  const progress = Math.max(0, Math.min(100, Number.isFinite(goal.progressPercentage) ? goal.progressPercentage : calculateProgress(goal.currentValue, goal.targetValue)));
  return <PageShell>
    <Button asChild variant="ghost" size="sm" className="self-start"><Link href="/athlete/goals"><ChevronRight aria-hidden className="h-4 w-4" />بازگشت به اهداف</Link></Button>
    <PageHeader title={goal.title} subtitle="پیشرفتت را ثبت کن و هدف را با مسیر امروزت هماهنگ نگه دار." action={<Badge variant={goal.status === "achieved" ? "success" : "secondary"}>{statuses[goal.status] ?? goal.status}</Badge>} />
    <TwilightCard className="space-y-4">
      <div className="flex items-center gap-3"><span aria-hidden className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blush/10 text-blush"><Target className="h-5 w-5" /></span><SectionTitle>پیشرفت ثبت‌شده</SectionTitle></div>
      <div className="flex flex-wrap items-baseline justify-between gap-3"><p className="text-sm text-muted-foreground">{formatPersianNumber(goal.currentValue)} از {formatPersianNumber(goal.targetValue)} {goal.unit}</p><span className="text-2xl font-medium tabular-nums text-blush">{formatPersianNumber(Math.round(progress))}٪</span></div>
      <Progress value={progress} aria-label="پیشرفت هدف" indicatorClassName="bg-none bg-blush-solid" />
      <p className="flex items-center gap-2 text-sm text-muted-foreground"><Calendar aria-hidden className="h-4 w-4" />مهلت: {goal.targetDate ? formatDate(goal.targetDate) : "ثبت نشده"}</p>
    </TwilightCard>
    <TwilightCard className="space-y-5">
      <SectionTitle>ویرایش هدف</SectionTitle>
      <GoalForm key={goal.id} goal={goal} pending={update.isPending || remove.isPending} onSubmit={async patch => {
        const valuesChanged = patch.currentValue !== goal.currentValue || patch.targetValue !== goal.targetValue;
        const status = valuesChanged ? patch.currentValue >= patch.targetValue ? "achieved" : "in_progress" : goal.status;
        await update.mutateAsync({ id: goal.id, data: { ...patch, status } });
        toast.success("تغییرات هدف ذخیره شد"); router.push("/athlete/goals");
      }} footer={<Button variant="destructive" disabled={update.isPending || remove.isPending} onClick={() => { setDeleteError(""); setConfirmOpen(true); }}><Trash2 aria-hidden className="h-4 w-4" />حذف هدف</Button>} />
    </TwilightCard>
    <Dialog open={confirmOpen} onOpenChange={open => { if (!remove.isPending) setConfirmOpen(open); }}>
      <DialogContent>
        <DialogHeader><DialogTitle>حذف هدف</DialogTitle><DialogDescription>هدف «{goal.title}» و پیشرفت آن حذف می‌شود. این اقدام قابل بازگشت نیست.</DialogDescription></DialogHeader>
        {deleteError && <p role="alert" className="text-sm text-destructive">{deleteError}</p>}
        <DialogFooter>
          <Button variant="outline" disabled={remove.isPending} onClick={() => setConfirmOpen(false)}>انصراف</Button>
          <Button variant="destructive" loading={remove.isPending} onClick={async () => {
            try { await remove.mutateAsync(goal.id); clearGoalDraft(goalDraftKey(goal)); toast.success("هدف حذف شد"); router.push("/athlete/goals"); }
            catch (e) { setDeleteError(e instanceof Error ? e.message : "حذف ناموفق بود؛ دوباره تلاش کنید."); }
          }}>تأیید حذف هدف</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </PageShell>;
}
