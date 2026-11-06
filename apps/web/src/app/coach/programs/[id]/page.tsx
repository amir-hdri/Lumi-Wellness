"use client";

import { useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ChevronRight, Plus, CheckCircle, Archive, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { PageShell, PageHeader } from "@/components/twilight/Page";
import { StatCard, TwilightCard } from "@/components/twilight/controls";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import { formatPersianNumber, formatDate } from "@/lib/utils";
import type { ProgramExercise, TrainingProgram } from "@/lib/types";
import { useAuth } from "@/components/auth/AuthProvider";
import { useTrainingProgram, useExercises, useAddProgramExercise, useUpdateProgramExercise, useDeleteProgramExercise, useUpdateTrainingProgram, useDeleteTrainingProgram } from "@/hooks/use-api";
import { Loading, ErrorDisplay } from "@/components/ui/DataState";
import { ProgramExerciseSheet, type ProgramExerciseDraft } from "../../_components/ProgramExerciseSheet";
import { ProgramExerciseRow } from "../../_components/ProgramExerciseRow";
import { ProgramDetailsSheet, type ProgramDetailsPatch } from "../../_components/ProgramDetailsSheet";
import { ConfirmDialog } from "../../_components/ConfirmDialog";
import { WEEK_DAYS, programStatusConfig } from "../../_meta";
import { mutationErrorMessage } from "../../_errors";

export default function ProgramDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { user } = useAuth();
  const query = useTrainingProgram(id);
  const library = useExercises();
  const add = useAddProgramExercise();
  const updateEntry = useUpdateProgramExercise();
  const removeEntry = useDeleteProgramExercise();
  const update = useUpdateTrainingProgram();
  const remove = useDeleteTrainingProgram();
  const [activeDay, setActiveDay] = useState(0);
  const [entryTarget, setEntryTarget] = useState<{ entry: ProgramExercise | null; day: number; position: number } | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [confirm, setConfirm] = useState<{ type: "entry"; entry: ProgramExercise } | { type: "archive" } | { type: "program" } | null>(null);
  const [pending, setPending] = useState(false);
  const [actionError, setActionError] = useState("");
  const writing = useRef(false);
  const program = query.data?.data;
  const canEdit = !!program && !!user && (user.role === "admin" || (user.role === "coach" && program.coachId === user.id));
  // Day identities are fixed even on an empty draft. Never replace them with
  // indices into the subset of populated days, which assigns the wrong day.
  const days = WEEK_DAYS.map((day) => ({ ...day, entries: (program?.exercises ?? [])
    .filter((entry) => entry.dayOfWeek === day.value)
    .sort((left, right) => left.order - right.order || left.id.localeCompare(right.id)) }));

  async function write(work: (saved: () => void) => Promise<void>, success: string, failure: string, refresh = true) {
    if (writing.current || !canEdit) return;
    writing.current = true;
    setPending(true);
    setActionError("");
    let savedCount = 0;
    let complete = false;
    try {
      await work(() => { savedCount += 1; });
      complete = true;
      if (refresh) await query.refetch({ throwOnError: true });
      toast.success(success);
    } catch (error) {
      const message = complete
        ? "تغییرها ذخیره شدند اما بارگذاری دوباره ناموفق بود؛ فهرست را دوباره بارگذاری کنید."
        : savedCount > 0
          ? "بخشی از تغییرها ذخیره شد؛ ترتیب یا اطلاعات برنامه کامل ثبت نشد. فهرست دوباره بررسی شود."
          : mutationErrorMessage(error, failure);
      setActionError(message);
      toast.error(message);
      // No optimistic order is displayed. Refetch after any failed batch so a
      // partially committed sequence cannot masquerade as an all-or-nothing save.
      try { if (refresh) await query.refetch({ throwOnError: true }); } catch { /* retry remains visible */ }
    } finally {
      writing.current = false;
      setPending(false);
    }
  }

  async function saveOrders(rows: ProgramExercise[], saved: () => void, skipId?: string) {
    for (const [order, row] of rows.entries()) {
      if (row.id === skipId || row.order === order) continue;
      await updateEntry.mutateAsync({ programId: id, exerciseId: row.id, data: { order } });
      saved();
    }
  }

  async function saveEntry(draft: ProgramExerciseDraft) {
    const target = entryTarget;
    if (!target || !Number.isInteger(draft.dayOfWeek) || draft.dayOfWeek < 0 || draft.dayOfWeek > 6) return;
    if (target.entry && draft.exerciseId !== target.entry.exerciseId) {
      toast.error("برای جایگزینی حرکت، ردیف قبلی را حذف و حرکت تازه‌ای اضافه کنید.");
      return;
    }
    const destination = days[draft.dayOfWeek].entries.filter((row) => row.id !== target.entry?.id);
    if (draft.position < 1 || draft.position > destination.length + 1) {
      toast.error("ترتیب حرکت خارج از محدوده این روز است");
      return;
    }
    const order = draft.position - 1;
    await write(async (saved) => {
      const data = { dayOfWeek: draft.dayOfWeek, order, sets: draft.sets, reps: draft.reps,
        weight: target.entry ? draft.weight ?? null : draft.weight, restSeconds: draft.restSeconds,
        notes: target.entry ? draft.notes ?? "" : draft.notes };
      let entryId = target.entry?.id;
      if (target.entry) {
        await updateEntry.mutateAsync({ programId: id, exerciseId: target.entry.id, data });
      } else {
        const created = await add.mutateAsync({ programId: id, data: { ...data, exerciseId: draft.exerciseId } });
        entryId = created.data?.id;
      }
      saved();
      setEntryTarget(null);
      if (!entryId) throw new Error("شناسه حرکت ذخیره‌شده برنگشت");
      const row = { ...target.entry, ...data, id: entryId, order } as ProgramExercise;
      const reordered = [...destination];
      reordered.splice(order, 0, row);
      await saveOrders(reordered, saved, entryId);
      if (target.entry && target.entry.dayOfWeek !== draft.dayOfWeek) {
        await saveOrders(days[target.entry.dayOfWeek].entries.filter((item) => item.id !== entryId), saved);
      }
      setActiveDay(draft.dayOfWeek);
    }, target.entry ? "حرکت برنامه ذخیره شد" : "حرکت به برنامه اضافه شد", "ذخیره حرکت ناموفق بود");
  }

  async function moveEntry(entry: ProgramExercise, delta: -1 | 1) {
    const rows = [...days[entry.dayOfWeek].entries];
    const index = rows.findIndex((row) => row.id === entry.id);
    const next = index + delta;
    if (index < 0 || next < 0 || next >= rows.length) return;
    [rows[index], rows[next]] = [rows[next], rows[index]];
    await write((saved) => saveOrders(rows, saved), "ترتیب حرکت‌ها ذخیره شد", "تغییر ترتیب ناموفق بود");
  }

  async function saveDetails(patch: ProgramDetailsPatch) {
    await write(async (saved) => {
      await update.mutateAsync({ id, data: { ...patch, description: patch.description ?? "" } });
      saved(); setDetailsOpen(false);
    }, "مشخصات برنامه ذخیره شد", "ذخیره مشخصات ناموفق بود");
  }

  async function setStatus(status: TrainingProgram["status"]) {
    await write(async (saved) => { await update.mutateAsync({ id, data: { status } }); saved(); setConfirm(null); },
      "وضعیت برنامه ذخیره شد", "تغییر وضعیت ناموفق بود");
  }

  async function confirmAction() {
    if (!confirm) return;
    if (confirm.type === "archive") { await setStatus("archived"); return; }
    if (confirm.type === "program") {
      await write(async (saved) => { await remove.mutateAsync(id); saved(); setConfirm(null); router.push("/coach/programs"); },
        "برنامه حذف شد", "حذف برنامه ناموفق بود", false);
      return;
    }
    const entry = confirm.entry;
    await write(async (saved) => {
      await removeEntry.mutateAsync({ programId: id, exerciseId: entry.id }); saved(); setConfirm(null);
      await saveOrders(days[entry.dayOfWeek].entries.filter((row) => row.id !== entry.id), saved);
    }, "حرکت از برنامه حذف شد", "حذف حرکت از برنامه ناموفق بود");
  }

  if (query.isLoading) return <Loading />;
  if (query.isError) return <ErrorDisplay message={query.error?.message} onRetry={query.refetch} />;
  if (!program) return <ErrorDisplay message="برنامه پیدا نشد" />;
  const athleteName = program.athlete ? `${program.athlete.firstName} ${program.athlete.lastName}` : program.athleteId;
  const status = programStatusConfig[program.status];
  return <PageShell>
    <PageHeader title={program.name} subtitle={athleteName} action={canEdit && <div className="flex flex-wrap gap-2">
      <Button variant="ghost" size="sm" disabled={pending} onClick={() => setDetailsOpen(true)}><Pencil className="h-4 w-4" aria-hidden />ویرایش مشخصات</Button>
      {program.status === "draft" && <Button variant="success" size="sm" disabled={pending} onClick={() => void setStatus("active")}><CheckCircle className="h-4 w-4" aria-hidden />فعال‌سازی</Button>}
      {program.status === "active" && <Button size="sm" disabled={pending} onClick={() => setDetailsOpen(true)}>ذخیره</Button>}
      {program.status !== "archived" && <Button variant="ghost" size="sm" disabled={pending} onClick={() => setConfirm({ type: "archive" })}><Archive className="h-4 w-4" aria-hidden />بایگانی</Button>}
      <Button variant="ghost" size="sm" disabled={pending} onClick={() => setConfirm({ type: "program" })}><Trash2 className="h-4 w-4" aria-hidden />حذف برنامه</Button>
    </div>} />
    {actionError && <div role="alert" className="rounded-xl border border-destructive p-3 text-sm">{actionError}
      <Button variant="ghost" disabled={pending} onClick={() => void query.refetch()}>بارگذاری دوباره</Button>
    </div>}
    <div className="flex items-center gap-3"><Badge variant={status?.variant ?? "outline"}>{status?.label ?? program.status}</Badge>
      <Button variant="ghost" size="sm" asChild><Link href="/coach/programs"><ChevronRight className="h-4 w-4" aria-hidden />بازگشت به برنامه‌ها</Link></Button>
    </div>
    {!canEdit && <p className="text-sm text-muted-foreground">ویرایش این برنامه فقط برای مربی صاحب برنامه یا مدیر مجاز است.</p>}
    <div className="grid grid-cols-2 gap-3">
      <StatCard label="ورزشکار" value={athleteName} /><StatCard label="تاریخ شروع" value={formatDate(program.startDate)} />
      <StatCard label="تاریخ پایان" value={formatDate(program.endDate)} /><StatCard label="تعداد جلسات" value={`${formatPersianNumber(program.frequencyPerWeek)} روز در هفته`} />
    </div>
    <Tabs value={String(activeDay)} onValueChange={(value) => setActiveDay(Number(value))} dir="rtl">
      <TabsList className="w-full justify-start overflow-x-auto rounded-xl border border-border bg-card p-1">
        {days.map((day) => <TabsTrigger key={day.value} value={String(day.value)}>{day.label}</TabsTrigger>)}
      </TabsList>
      {days.map((day) => <TabsContent key={day.value} value={String(day.value)} className="mt-4">
        <TwilightCard className="space-y-3">
          <div className="flex items-center justify-between gap-2"><h3>{day.label}</h3>
            {canEdit && <Button variant="ghost" disabled={pending || library.isLoading || library.isError} onClick={() => setEntryTarget({ entry: null, day: day.value, position: day.entries.length + 1 })}><Plus className="h-4 w-4" aria-hidden />افزودن حرکت</Button>}
          </div>
          {library.isError && <ErrorDisplay message="کتابخانه حرکت‌ها بارگذاری نشد" onRetry={library.refetch} />}
          {day.entries.length === 0 ? <p className="py-5 text-center text-sm text-muted-foreground">هیچ حرکتی برای این روز ثبت نشده است</p> :
            <ol className="space-y-3">{day.entries.map((entry, index) => <ProgramExerciseRow key={entry.id} entry={entry} position={index + 1}
              isFirst={index === 0} isLast={index === day.entries.length - 1} busy={pending || !canEdit}
              onMove={(delta) => void moveEntry(entry, delta)} onEdit={() => setEntryTarget({ entry, day: day.value, position: index + 1 })}
              onDelete={() => setConfirm({ type: "entry", entry })} />)}</ol>}
        </TwilightCard>
      </TabsContent>)}
    </Tabs>
    {entryTarget && <ProgramExerciseSheet open onOpenChange={(open) => { if (!open && !writing.current) setEntryTarget(null); }} entry={entryTarget.entry}
      dayOfWeek={entryTarget.day} position={entryTarget.position} countsByDay={days.map((day) => day.entries.length)} library={library.data?.data ?? []} pending={pending} onSubmit={saveEntry} />}
    <ProgramDetailsSheet open={detailsOpen} onOpenChange={(open) => { if (!writing.current) setDetailsOpen(open); }} program={program} pending={pending} onSubmit={saveDetails} />
    <ConfirmDialog open={!!confirm} onOpenChange={(open) => { if (!open && !writing.current) setConfirm(null); }}
      title={confirm?.type === "entry" ? "حذف حرکت از برنامه" : confirm?.type === "archive" ? "بایگانی برنامه" : "حذف برنامه"}
      description={confirm?.type === "entry" ? "فقط ردیف این برنامه حذف می‌شود؛ حرکت کتابخانه تغییر نمی‌کند." : confirm?.type === "archive" ? "برنامه بایگانی شود؟" : "برنامه و حرکت‌های آن حذف شوند؟"}
      confirmLabel={confirm?.type === "entry" ? "حذف حرکت از برنامه" : confirm?.type === "archive" ? "بایگانی برنامه" : "تأیید حذف برنامه"}
      loading={pending} onConfirm={() => void confirmAction()} />
  </PageShell>;
}
