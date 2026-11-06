"use client";

import { useState } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/Table";
import { formatPersianNumber, cn } from "@/lib/utils";
import { SearchInput, FilterChips, EmptyState } from "@/components/twilight/controls";
import { PageShell, PageHeader } from "@/components/twilight/Page";
import { Plus, Dumbbell, Pencil, Trash2 } from "lucide-react";
import { useExercises, useDeleteExercise } from "@/hooks/use-api";
import { toast } from "sonner";
import { apiErrorMessage, httpStatusOf } from "@/components/auth/auth-helpers";
import type { Exercise } from "@/lib/types";
import { ConfirmDialog } from "../_components/ConfirmDialog";
import { Loading, ErrorDisplay } from "@/components/ui/DataState";
import { DIFFICULTIES, difficultyLabels } from "../_meta";

const muscles = ["همه", "سینه", "پشت", "پاها", "بازو", "شکم", "سرشانه"];
const difficulties = ["all", ...DIFFICULTIES.map((item) => item.value)];
const difficultyChipLabels = { all: "همه", ...difficultyLabels };

const chipLabels = (opts: string[]): Record<string, string> =>
  Object.fromEntries(opts.map((o) => [o, o]));

export default function ExerciseLibraryPage() {
  const [search, setSearch] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<Exercise | null>(null);
  const remove = useDeleteExercise();
  const [muscleFilter, setMuscleFilter] = useState("همه");
  const [difficultyFilter, setDifficultyFilter] = useState("all");
  const { data, isLoading, isError, error, refetch } = useExercises();

  const deleteExercise = async () => {
    if (!deleteTarget || remove.isPending) return;
    try {
      await remove.mutateAsync(deleteTarget.id);
      toast.success("حرکت حذف شد");
      setDeleteTarget(null);
    } catch (error) {
      const conflict = httpStatusOf(error) === 409 || (error instanceof Error && /referenc|program|برنامه/i.test(error.message));
      toast.error(conflict ? "این حرکت در برنامه تمرینی استفاده شده است؛ ابتدا آن را از برنامه‌ها حذف کنید." : apiErrorMessage(error, "حذف حرکت ناموفق بود"));
    }
  };

  if (isLoading) return <Loading />;
  if (isError) return <ErrorDisplay message={error?.message} onRetry={refetch} />;

  const exercisesData = data?.data || [];

  const filtered = exercisesData.filter((ex) => {
    const matchSearch = ex.name.includes(search);
    const matchMuscle = muscleFilter === "همه" || ex.muscleGroup === muscleFilter;
    const matchDifficulty = difficultyFilter === "all" || ex.difficulty === difficultyFilter;
    return matchSearch && matchMuscle && matchDifficulty;
  });

  const difficultyColor: Record<string, "default" | "secondary" | "destructive" | "info"> = {
    beginner: "default", intermediate: "secondary", advanced: "destructive",
    مبتدی: "default", متوسط: "secondary", پیشرفته: "destructive",
  };

  return (
    <PageShell>
      <PageHeader
        title="کتابخانه تمرینات"
        subtitle="مدیریت حرکات ورزشی"
        action={
          <Button variant="default" asChild className="w-auto">
            <Link href="/coach/exercises/new">
              <Plus className="ml-2 h-4 w-4" />
              افزودن حرکت جدید
            </Link>
          </Button>
        }
      />

      <div className="flex flex-col gap-3">
        <SearchInput value={search} onChange={setSearch} placeholder="جستجوی حرکت..." />
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <span className="w-16 shrink-0 text-[11px] font-semibold text-muted-foreground">عضله هدف</span>
          <FilterChips
            pillId="coach-exercises-muscle"
            options={muscles}
            value={muscleFilter}
            onChange={setMuscleFilter}
            labels={chipLabels(muscles)}
          />
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <span className="w-16 shrink-0 text-[11px] font-semibold text-muted-foreground">سطح</span>
          <FilterChips
            pillId="coach-exercises-difficulty"
            options={difficulties}
            value={difficultyFilter}
            onChange={setDifficultyFilter}
            labels={difficultyChipLabels}
          />
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-border">
              <TableHead className="w-12 text-[11px] font-semibold text-muted-foreground">ردیف</TableHead>
              <TableHead className="text-[11px] font-semibold text-muted-foreground">نام حرکت</TableHead>
              <TableHead className="text-[11px] font-semibold text-muted-foreground">عضله هدف</TableHead>
              <TableHead className="text-[11px] font-semibold text-muted-foreground">وسیله</TableHead>
              <TableHead className="text-[11px] font-semibold text-muted-foreground">سطح</TableHead>
              <TableHead className="w-28 text-[11px] font-semibold text-muted-foreground">عملیات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((ex, idx) => (
              <TableRow key={ex.id} className={cn("border-t border-border hover:bg-secondary")}>
                <TableCell className="tabular-nums text-foreground">{formatPersianNumber(idx + 1)}</TableCell>
                <TableCell className="font-medium text-foreground">{ex.name}</TableCell>
                <TableCell><Badge variant="outline">{ex.muscleGroup}</Badge></TableCell>
                <TableCell>
                  <span className="flex items-center gap-1 text-foreground">
                    <Dumbbell className="h-3.5 w-3.5 text-muted-foreground" strokeWidth={1.75} />
                    {ex.equipment || "–"}
                  </span>
                </TableCell>
                <TableCell>
                  <Badge variant={difficultyColor[ex.difficulty] || difficultyColor["متوسط"]}>
                    {difficultyLabels[ex.difficulty] ?? ex.difficulty}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/coach/exercises/${ex.id}`}><Pencil className="h-4 w-4" aria-hidden />ویرایش</Link>
                    </Button>
                    <Button variant="ghost" size="sm" className="text-destructive" onClick={() => setDeleteTarget(ex)}>
                      <Trash2 className="h-4 w-4" />
                      حذف
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {filtered.length === 0 && (
          <div className="border-t border-border p-6">
            <EmptyState
              tone="blush"
              title="هیچ حرکتی یافت نشد"
              description="حرکتی با فیلترهای انتخاب شده وجود ندارد"
            />
          </div>
        )}
      </div>
      <ConfirmDialog open={!!deleteTarget} onOpenChange={(open) => { if (!open && !remove.isPending) setDeleteTarget(null); }}
        title="حذف حرکت" description={`حرکت «${deleteTarget?.name ?? ""}» حذف شود؟ حرکت‌های استفاده‌شده در برنامه قابل حذف نیستند.`}
        confirmLabel="حذف حرکت" loading={remove.isPending} onConfirm={deleteExercise} />
    </PageShell>
  );
}
