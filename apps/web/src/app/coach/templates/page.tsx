"use client";

import { usePagination } from "@/hooks/use-pagination";
import { Pagination } from "@/components/ui/Pagination";

import { useUrlState } from "@/hooks/use-url-state";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { PageShell, PageHeader } from "@/components/twilight/Page";
import { TwilightCard, SearchInput, EmptyState } from "@/components/twilight/controls";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Loading, ErrorDisplay } from "@/components/ui/DataState";
import { formatPersianNumber } from "@/lib/utils";
import { apiErrorMessage } from "@/components/auth/auth-helpers";
import { useAuth } from "@/components/auth/AuthProvider";
import { useTrainingPrograms, useUsers, useCreateTrainingProgram, useAddProgramExercise, useDeleteTrainingProgram } from "@/hooks/use-api";
import { toast } from "sonner";
import { Plus, Copy, Clock, Dumbbell, LayoutTemplate } from "lucide-react";
import type { TrainingProgram } from "@/lib/types";
import { CloneProgramSheet, type CloneProgramValues } from "../_components/CloneProgramSheet";

export default function TemplatesPage() {
  const router = useRouter();
  const { user } = useAuth();
  const programs = useTrainingPrograms();
  const athletes = useUsers("athlete");
  const create = useCreateTrainingProgram();
  const add = useAddProgramExercise();
  const remove = useDeleteTrainingProgram();
  const [search, setSearch] = useUrlState<string>("q", "");
  const [source, setSource] = useState<TrainingProgram | null>(null);
  const [pending, setPending] = useState(false);
  const copying = useRef(false);
  const [progress, setProgress] = useState<{ done: number; total: number } | null>(null);
  const [incompleteId, setIncompleteId] = useState<string | null>(null);
  const athleteRows = athletes.data?.data ?? [];
  // Saved programs are the available blueprints; there is no separate template
  // model. The API/mock list can contain other coaches' rows, so scope here too.
  const owned = (programs.data?.data ?? []).filter((program) => program.coachId === user?.id);
  const filtered = owned.filter((program) => `${program.name} ${program.description ?? ""}`.includes(search.trim()));
  const pagination = usePagination(filtered.length);

  const clone = async (values: CloneProgramValues) => {
    if (copying.current || !source || !user || user.role !== "coach") return;
    if (!athleteRows.some((athlete) => athlete.id === values.athleteId)) {
      toast.error("ورزشکار معتبر را انتخاب کنید");
      return;
    }
    copying.current = true;
    setPending(true);
    setIncompleteId(null);
    const prescriptions = [...source.exercises];
    setProgress({ done: 0, total: prescriptions.length });
    let createdId: string | undefined;
    try {
      const created = await create.mutateAsync({
        athleteId: values.athleteId, coachId: user.id, name: values.name,
        description: source.description, startDate: values.startDate, endDate: values.endDate,
        frequencyPerWeek: source.frequencyPerWeek, status: "draft",
      });
      createdId = created.data?.id;
      if (!createdId) throw new Error("شناسه برنامه تازه برنگشت؛ فهرست برنامه‌ها را بررسی کنید");
      for (const [index, exercise] of prescriptions.entries()) {
        // Explicit whitelist: history, joined exercise rows, completion and
        // actual performance belong to the source athlete and must never copy.
        await add.mutateAsync({ programId: createdId, data: {
          exerciseId: exercise.exerciseId, dayOfWeek: exercise.dayOfWeek, order: exercise.order,
          sets: exercise.sets, reps: exercise.reps, weight: exercise.weight,
          restSeconds: exercise.restSeconds, notes: exercise.notes,
        } });
        setProgress({ done: index + 1, total: prescriptions.length });
      }
      toast.success("برنامه تازه با همه حرکت‌ها ساخته شد");
      setSource(null);
      router.push(`/coach/programs/${createdId}`);
    } catch (error) {
      if (createdId) {
        try {
          // Only this transaction's new draft is removed; the blueprint stays.
          await remove.mutateAsync(createdId);
          toast.error(apiErrorMessage(error, "کپی حرکت‌ها ناموفق بود") + "؛ برنامه ناقص حذف شد.");
        } catch {
          setIncompleteId(createdId);
          setSource(null);
          toast.error("کپی حرکت‌ها و حذف برنامه ناقص ناموفق بود؛ برنامه ناقص را بررسی کنید.");
        }
      } else {
        toast.error(apiErrorMessage(error, "ساخت برنامه از الگو ناموفق بود"));
      }
    } finally {
      copying.current = false;
      setPending(false);
      setProgress(null);
    }
  };

  if (programs.isLoading) return <Loading />;
  if (programs.isError) return <ErrorDisplay message={programs.error?.message} onRetry={programs.refetch} />;
  return (
    <PageShell>
      <PageHeader title="الگوهای برنامه" subtitle="از برنامه‌های ذخیره‌شده خود برای شاگرد دیگر استفاده کنید" action={
        <Button asChild className="w-auto"><Link href="/coach/programs/new"><Plus className="h-4 w-4" aria-hidden />برنامه جدید</Link></Button>
      } />
      {incompleteId && <div role="alert" className="rounded-2xl border border-destructive p-4 text-sm">
        برنامه تازه کامل کپی نشد و حذف آن هم ناموفق بود. پیش از تلاش دوباره آن را بررسی کنید.
        <Link className="ms-2 underline" href={`/coach/programs/${incompleteId}`}>بررسی برنامه ناقص</Link>
      </div>}
      <SearchInput value={search} onChange={setSearch} placeholder="جستجوی الگو..." className="max-w-md" />
      {filtered.length === 0 ? <EmptyState tone="blush" icon={<LayoutTemplate className="h-6 w-6" aria-hidden />}
        title="الگویی یافت نشد" description={owned.length ? "برنامه‌ای با جست‌وجوی شما وجود ندارد" : "ابتدا برنامه‌ای بسازید تا بتوانید حرکت‌های آن را دوباره استفاده کنید"} /> :
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filtered.slice(pagination.from, pagination.to).map((program) => <TwilightCard key={program.id} className="flex flex-col gap-4">
            <div className="flex items-start justify-between gap-3">
              <h3 className="min-w-0 flex-1 break-words font-serif text-lg font-normal leading-snug text-foreground">{program.name}</h3>
              <Badge variant="outline">{program.status === "draft" ? "پیش‌نویس" : program.status === "active" ? "فعال" : program.status === "completed" ? "تکمیل‌شده" : "بایگانی"}</Badge>
            </div>
            {program.description && <p className="text-sm text-muted-foreground">{program.description}</p>}
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5"><Clock className="h-4 w-4" aria-hidden />{formatPersianNumber(program.frequencyPerWeek)} روز در هفته</span>
              <span className="flex items-center gap-1.5"><Dumbbell className="h-4 w-4" aria-hidden />{formatPersianNumber(program.exercises.length)} حرکت</span>
            </div>
            <div className="mt-auto flex flex-wrap gap-2">
              <Button variant="ghost" onClick={() => setSource(program)} disabled={pending}><Copy className="h-4 w-4" aria-hidden />استفاده برای شاگرد</Button>
              <Button variant="ghost" asChild><Link href={`/coach/programs/${program.id}`}>مشاهده</Link></Button>
            </div>
          </TwilightCard>)}
        </div>}
      {source && <CloneProgramSheet open onOpenChange={(open) => { if (!open && !copying.current) setSource(null); }} source={source}
        athletes={athleteRows} athletesLoading={athletes.isLoading} pending={pending} progress={progress} onSubmit={clone} />}
      <Pagination view={pagination} total={filtered.length} unit="الگو" />
    </PageShell>
  );
}
