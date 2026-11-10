"use client";

import { useState, useMemo } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Progress } from "@/components/ui/Progress";
import { Button } from "@/components/ui/Button";
import { formatPersianNumber, formatDate, calculateProgress } from "@/lib/utils";
import { useTrainingProgram, useCompleteProgramExercise } from "@/hooks/use-api";
import { Loading, ErrorDisplay } from "@/components/ui/DataState";
import { PageShell, PageHeader, SectionTitle, MicroLabelFa } from "@/components/twilight/Page";
import { TwilightCard, FilterChips } from "@/components/twilight/controls";
import { WorkoutPlayer } from "@/components/twilight/WorkoutPlayer";
import { WorkoutExerciseRow } from "../../WorkoutExerciseRow";
import { apiErrorMessage } from "@/components/auth/auth-helpers";
import { toast } from "sonner";

const dayNames = ["شنبه", "یکشنبه", "دوشنبه", "سه‌شنبه", "چهارشنبه", "پنج‌شنبه", "جمعه"] as const;
type DayName = (typeof dayNames)[number];

export default function ProgramDetailPage() {
  const params = useParams();
  const { data, isLoading, isError, error, refetch } = useTrainingProgram(params.id as string);
  const [activeDay, setActiveDay] = useState<DayName | null>(null);
  const complete = useCompleteProgramExercise();

  const program = data?.data;

  const weeklyProgram = useMemo(() => {
    if (!program?.exercises) return [];
    const grouped: Record<number, typeof program.exercises> = {};
    program.exercises.forEach((ex) => {
      const day = ex.dayOfWeek;
      if (!grouped[day]) grouped[day] = [];
      grouped[day].push(ex);
    });
    return dayNames.map((day, idx) => ({
      day,
      exercises: (grouped[idx] || []).toSorted((a, b) => a.order - b.order),
    }));
  }, [program]);

  if (isLoading) return <Loading />;
  if (isError) return <ErrorDisplay message={error?.message} onRetry={refetch} />;
  if (!program) return <ErrorDisplay message="برنامه یافت نشد" />;

  const totalExercises = weeklyProgram.reduce((sum, day) => sum + day.exercises.length, 0);
  const totalCompleted = program.exercises.filter((exercise) => exercise.isCompleted).length;
  const overallProgress = calculateProgress(totalCompleted, totalExercises);

  const selectedDay = activeDay ?? weeklyProgram.find((day) => day.exercises.length)?.day ?? dayNames[0];
  const activeDayData = weeklyProgram.find((day) => day.day === selectedDay);
  const activeDayCompleted = activeDayData?.exercises.filter((exercise) => exercise.isCompleted).length ?? 0;

  return (
    <PageShell>
      <Button variant="ghost" size="sm" asChild className="self-start">
        <Link href="/athlete/programs">
          <ChevronRight className="h-4 w-4" strokeWidth={1.75} /> بازگشت به برنامه‌ها
        </Link>
      </Button>

      <PageHeader
        title={program.name}
        subtitle={`${program.coach?.firstName || ""} ${program.coach?.lastName || ""} | ${formatDate(program.startDate)} - ${formatDate(program.endDate)} | ${formatPersianNumber(program.frequencyPerWeek)} روز در هفته`}
        action={
          <span className="rounded-full border border-blush/30 bg-blush/10 px-3 py-1.5 text-[11px] text-blush">
            {formatPersianNumber(Math.round(overallProgress))}٪ تکمیل
          </span>
        }
      />

      <TwilightCard>
        <div className="mb-3 flex items-center justify-between">
          <MicroLabelFa>پیشرفت کلی برنامه</MicroLabelFa>
          <span className="font-sans text-sm font-medium tabular-nums text-foreground">
            {formatPersianNumber(Math.round(overallProgress))}٪
          </span>
        </div>
        <Progress
          value={overallProgress}
          className="bg-border"
          indicatorClassName="bg-none bg-blush-solid shadow-none"
        />
      </TwilightCard>

      <FilterChips
        pillId="athlete-program-days"
        options={dayNames}
        value={selectedDay}
        onChange={setActiveDay}
        labels={Object.fromEntries(dayNames.map((d) => [d, d])) as Record<DayName, string>}
      />

      {activeDayData && (
        <section aria-label={`تمرینات ${activeDayData.day}`} className="space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <SectionTitle>تمرینات {activeDayData.day}</SectionTitle>
              <span className="text-xs text-muted-foreground">
                {formatPersianNumber(activeDayCompleted)}/{formatPersianNumber(activeDayData.exercises.length)} حرکت تکمیل شده
              </span>
            </div>
            {activeDayData.exercises.length > 0 && (
              <WorkoutPlayer key={`${program.id}:${selectedDay}`} programId={program.id}
                name={`${program.name} - ${selectedDay}`} exercises={activeDayData.exercises} />
            )}
          </div>
          <div className="flex flex-col gap-3">
            {activeDayData.exercises.length === 0 ? (
              <p className="py-6 text-center text-sm text-muted-foreground">روز استراحت و ریکاوری عضلات</p>
            ) : (
              activeDayData.exercises.map((exercise) => (
                <WorkoutExerciseRow
                  key={exercise.id}
                  exercise={exercise}
                  checked={exercise.isCompleted}
                  disabled={complete.isPending}
                  onCheckedChange={(checked) => complete.mutate({ programId: program.id, exerciseId: exercise.id, completed: checked }, {
                    onError: (error) => toast.error(apiErrorMessage(error, "ثبت تمرین ناموفق بود")),
                  })}
                />
              ))
            )}
          </div>
        </section>
      )}

    </PageShell>
  );
}
