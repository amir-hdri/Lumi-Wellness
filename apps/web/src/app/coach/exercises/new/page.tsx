"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/Button";
import { PageShell, PageHeader } from "@/components/twilight/Page";
import { apiErrorMessage } from "@/components/auth/auth-helpers";
import { useCreateExercise, useExercises } from "@/hooks/use-api";
import { ExerciseForm, emptyExerciseValues, toExercisePayload, type ExerciseFormValues } from "../../_components/ExerciseForm";

export default function NewExercisePage() {
  const router = useRouter();
  const create = useCreateExercise();
  const library = useExercises();
  const exercises = library.data?.data ?? [];
  const suggestions = {
    categories: [...new Set(exercises.map((exercise) => exercise.category))],
    muscleGroups: [...new Set(exercises.map((exercise) => exercise.muscleGroup))],
    equipment: [...new Set(exercises.flatMap((exercise) => exercise.equipment ? [exercise.equipment] : []))],
  };
  const save = async (values: ExerciseFormValues) => {
    if (create.isPending) return;
    try {
      await create.mutateAsync(toExercisePayload(values));
      toast.success("حرکت جدید با موفقیت ثبت شد");
      router.push("/coach/exercises");
    } catch (error) {
      toast.error(apiErrorMessage(error, "خطا در ثبت حرکت"));
    }
  };
  return (
    <PageShell>
      <PageHeader title="افزودن حرکت جدید" subtitle="ثبت حرکت ورزشی جدید" action={
        <Button variant="ghost" size="sm" asChild><Link href="/coach/exercises"><ChevronRight className="h-4 w-4" aria-hidden />بازگشت</Link></Button>
      } />
      <ExerciseForm defaultValues={emptyExerciseValues} suggestions={suggestions} submitLabel="ذخیره حرکت" pending={create.isPending}
        onSubmit={save} onCancel={() => router.push("/coach/exercises")} />
    </PageShell>
  );
}
