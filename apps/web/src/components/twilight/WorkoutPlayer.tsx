"use client";

import { useEffect, useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { Sheet } from "@/components/ui/Sheet";
import { Button } from "@/components/ui/Button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/Dialog";
import { Progress } from "@/components/ui/Progress";
import { useCompleteProgramExercise } from "@/hooks/use-api";
import { formatPersianNumber } from "@/lib/utils";
import type { ProgramExercise } from "@/lib/types";

const REST_SOUND_KEY = "workout-rest-sound";

function readRestSoundPreference(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return window.localStorage.getItem(REST_SOUND_KEY) === "1";
  } catch {
    return false;
  }
}

export function WorkoutPlayer({
  programId,
  name,
  exercises,
}: {
  programId: string;
  name: string;
  exercises: ProgramExercise[];
}) {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const [restUntil, setRestUntil] = useState<number | null>(null);
  const [rest, setRest] = useState(0);
  const [sound, setSound] = useState<boolean>(() => readRestSoundPreference());
  const [confirmRestart, setConfirmRestart] = useState(false);
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const complete = useCompleteProgramExercise();
  const exercise = exercises[index];
  const done = exercises.filter((e) => e.isCompleted).length;
  const finishedSession = exercises.length > 0 && done === exercises.length;

  useEffect(() => {
    if (!open || !startedAt || finishedSession) return;
    const timer = setInterval(
      () => setElapsed(Math.floor((Date.now() - startedAt) / 1000)),
      1000,
    );
    return () => clearInterval(timer);
  }, [open, startedAt, finishedSession]);

  useEffect(() => {
    if (!restUntil || !open) return;
    const timer = setInterval(() => {
      const seconds = Math.max(0, Math.ceil((restUntil - Date.now()) / 1000));
      setRest(seconds);
      if (seconds) return;
      setRestUntil(null);
      if (sound && typeof AudioContext !== "undefined") {
        const ctx = new AudioContext();
        const tone = ctx.createOscillator();
        const volume = ctx.createGain();
        tone.connect(volume);
        volume.connect(ctx.destination);
        volume.gain.value = 0.08;
        tone.frequency.value = 440;
        tone.start();
        tone.stop(ctx.currentTime + 0.4);
        tone.onended = () => {
          void ctx.close();
        };
      }
    }, 250);
    return () => clearInterval(timer);
  }, [restUntil, open, sound]);

  function toggleSound() {
    setSound((current) => {
      const next = !current;
      try {
        window.localStorage.setItem(REST_SOUND_KEY, next ? "1" : "0");
      } catch {
        // Private mode or blocked storage — the toggle still works for this session.
      }
      return next;
    });
  }

  function clearRest() {
    setRest(0);
    setRestUntil(null);
  }

  async function recordSet() {
    if (!exercise || complete.isPending) return;
    const sets = Math.min(exercise.sets, (exercise.actualSets ?? 0) + 1);
    const finished = sets >= exercise.sets;
    try {
      await complete.mutateAsync({
        programId,
        exerciseId: exercise.id,
        completed: finished,
        data: {
          actualSets: sets,
          actualReps: exercise.reps,
          actualWeight: exercise.weight ?? 0,
        },
      });
      if (finished) {
        const following = exercises.findIndex(
          (e, i) => i > index && !e.isCompleted,
        );
        const next =
          following >= 0
            ? following
            : exercises.findIndex((e, i) => i !== index && !e.isCompleted);
        if (next < 0) {
          toast.success("تمرین‌های این جلسه ثبت شد");
          clearRest();
          return;
        }
        setIndex(next);
      }
      setRest(exercise.restSeconds);
      setRestUntil(Date.now() + exercise.restSeconds * 1000);
    } catch {
      toast.error("ست ذخیره نشد؛ دوباره امتحان کنید");
    }
  }

  function confirmRestartExercise() {
    if (!exercise) return;
    complete.mutate(
      {
        programId,
        exerciseId: exercise.id,
        completed: false,
        data: { actualSets: 0 },
      },
      {
        onSuccess: () => {
          setConfirmRestart(false);
          clearRest();
          toast.success("شمارش ست‌ها از اول شروع شد");
        },
        onError: () => toast.error("شروع دوباره ذخیره نشد"),
      },
    );
  }

  return (
    <>
      <Button
        onClick={() => {
          setIndex(
            Math.max(
              0,
              exercises.findIndex((e) => !e.isCompleted),
            ),
          );
          clearRest();
          setStartedAt(Date.now());
          setElapsed(0);
          setOpen(true);
        }}
        disabled={!exercises.length}
        className="w-full rounded-xl px-5 text-sm sm:w-auto"
      >
        شروع جلسه تمرین
      </Button>
      <Sheet
        open={open}
        onOpenChange={setOpen}
        title={name}
        description="اجرای تمرین و ثبت ست‌ها"
        className="sm:max-w-lg"
      >
        {exercise && (
          <div className="flex flex-col gap-5 py-1">
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-3 text-xs text-muted-foreground">
                <span>حرکت {formatPersianNumber(index + 1)} از {formatPersianNumber(exercises.length)}</span>
                <span className="tabular-nums" aria-label="زمان جلسه" dir="ltr">
                  {formatPersianNumber(Math.floor(elapsed / 60))}:{formatPersianNumber(elapsed % 60).padStart(2, "۰")}
                </span>
              </div>
              <Progress value={exercises.length ? done / exercises.length * 100 : 0} aria-label="پیشرفت جلسه تمرین" className="h-1" indicatorClassName="bg-none bg-blush-solid" />
            </div>
            <div>
              <h2 className="break-words font-serif text-2xl font-medium leading-relaxed text-foreground">
                {exercise.exercise?.name ?? "حرکت تمرینی"}
              </h2>
              <p className="mt-2 text-sm leading-7 text-muted-foreground">
                {exercise.notes ||
                  exercise.exercise?.tips ||
                  "حرکت را با کنترل و مطابق برنامه مربی اجرا کنید."}
              </p>
            </div>
            <div className="grid grid-cols-3 gap-3 rounded-2xl bg-muted/50 p-4">
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground">ست جاری</p>
                <p className="mt-2 text-base font-medium leading-7 text-foreground">
                  ست{" "}
                  {formatPersianNumber(
                    Math.min((exercise.actualSets ?? 0) + 1, exercise.sets),
                  )}{" "}
                  از {formatPersianNumber(exercise.sets)}
                </p>
              </div>
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground">تکرار هدف</p>
                <p className="mt-2 text-lg font-medium leading-7 text-foreground" dir="ltr">{exercise.reps}</p>
              </div>
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground">وزنه</p>
                <p className="mt-2 text-base font-medium leading-7 text-foreground">{exercise.weight ? `${formatPersianNumber(exercise.weight)} کیلو` : "بدون وزنه"}</p>
              </div>
            </div>
            {rest > 0 && (
              <div className="space-y-3 rounded-2xl border border-border bg-muted/40 p-4">
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <p className="text-xs font-semibold">
                      زمان استراحت و تنفس عمیق
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      آب بنوشید و برای ست بعد آماده شوید
                    </p>
                  </div>
                  <span className="shrink-0 text-xl font-medium tabular-nums text-foreground">
                    {formatPersianNumber(rest)} ثانیه
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <button
                    aria-label={restUntil ? "توقف تایمر" : "ادامه تایمر"}
                    onClick={() =>
                      setRestUntil(restUntil ? null : Date.now() + rest * 1000)
                    }
                    className="ring-focus inline-flex min-h-11 items-center rounded-xl border border-border bg-card px-4 text-xs"
                  >
                    {restUntil ? "توقف تایمر" : "ادامه تایمر"}
                  </button>
                  <button
                    onClick={clearRest}
                    aria-label="رد کردن استراحت"
                    className="ring-focus flex min-h-11 items-center rounded-lg px-3 py-2 text-xs"
                  >
                    رد کردن استراحت
                  </button>
                </div>
              </div>
            )}
            {finishedSession ? (
              <div className="flex flex-col items-center gap-2.5 rounded-2xl border border-blush-solid/40 bg-card p-5 text-center">
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-blush-solid text-blush-foreground" aria-hidden="true">
                  <CheckCircle2 className="h-7 w-7" />
                </span>
                <h3 className="text-lg">جلسه تمرین تکمیل شد</h3>
                <p className="text-xs text-muted-foreground">
                  تمام حرکت‌ها در برنامه شما ذخیره شده‌اند.
                </p>
                <Button onClick={() => setOpen(false)} className="w-full">
                  پایان جلسه
                </Button>
              </div>
            ) : (
              <Button
                className="w-full rounded-xl text-sm"
                onClick={recordSet}
                loading={complete.isPending}
                disabled={exercise.isCompleted || rest > 0}
              >
                {exercise.isCompleted ? "حرکت تکمیل شد" : "ثبت ست انجام‌شده"}
              </Button>
            )}
            <div className="grid grid-cols-3 items-center gap-2 border-t border-border pt-3 text-xs">
              <button
                onClick={() => {
                  setIndex(Math.max(0, index - 1));
                  clearRest();
                }}
                disabled={index === 0}
                aria-label="حرکت قبلی"
                className="ring-focus flex min-h-11 items-center justify-center rounded-xl border border-border px-2 py-2 disabled:opacity-40"
              >
                حرکت قبلی
              </button>
              <button
                onClick={toggleSound}
                aria-label={sound ? "قطع صدای تایمر" : "فعال کردن صدای تایمر"}
                aria-pressed={sound}
                className="ring-focus flex min-h-11 items-center justify-center rounded-xl border border-border px-2 py-2 text-muted-foreground"
              >
                {sound ? "صدا روشن" : "صدا خاموش"}
              </button>
              <button
                onClick={() => {
                  setIndex(Math.min(exercises.length - 1, index + 1));
                  clearRest();
                }}
                disabled={index >= exercises.length - 1}
                aria-label="حرکت بعدی"
                className="ring-focus flex min-h-11 items-center justify-center rounded-xl border border-border px-2 py-2 disabled:opacity-40"
              >
                حرکت بعدی
              </button>
            </div>
            <p className="text-center text-xs leading-6 text-muted-foreground" aria-live="polite">
              {sound ? "صدای پایان استراحت روشن است" : "صدای پایان استراحت خاموش است — فقط روی همین دستگاه ذخیره می‌شود"}
            </p>
            {exercise.isCompleted && (
              <button
                disabled={complete.isPending}
                onClick={() => setConfirmRestart(true)}
                aria-label="شروع دوباره این حرکت"
                className="ring-focus mx-auto flex min-h-11 items-center gap-2 rounded-xl px-3 py-2 text-xs text-muted-foreground"
              >
                شروع دوباره این حرکت
              </button>
            )}
          </div>
        )}
      </Sheet>
      <Dialog open={confirmRestart} onOpenChange={setConfirmRestart}>
        <DialogContent className="@sm:max-w-md">
          <DialogHeader>
            <DialogTitle>ست‌های ثبت‌شده پاک شود؟</DialogTitle>
            <DialogDescription>
              شروع دوباره، شمارش ست‌های همین حرکت را صفر می‌کند و در سامانه ذخیره می‌شود.
              این کار قابل بازگشت نیست.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 @sm:gap-2">
            <Button
              variant="outline"
              onClick={() => setConfirmRestart(false)}
              disabled={complete.isPending}
            >
              انصراف
            </Button>
            <Button
              variant="destructive"
              onClick={confirmRestartExercise}
              loading={complete.isPending}
            >
              پاک کردن و شروع دوباره
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
