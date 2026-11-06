"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/Button";
import { PageShell, PageHeader } from "@/components/twilight/Page";
import { Loading, ErrorDisplay } from "@/components/ui/DataState";
import { apiErrorMessage } from "@/components/auth/auth-helpers";
import { useExercise, useExercises, useUpdateExercise } from "@/hooks/use-api";
import { ExerciseForm, toExerciseFormValues, toExercisePayload, type ExerciseFormValues } from "../../_components/ExerciseForm";

export default function EditExercisePage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const query = useExercise(id);
  const library = useExercises();
  const update = useUpdateExercise();
  const exercise = query.data?.data;
  const exercises = library.data?.data ?? [];
  const suggestions = {
    categories: [...new Set(exercises.map((item) => item.category))],
    muscleGroups: [...new Set(exercises.map((item) => item.muscleGroup))],
    equipment: [...new Set(exercises.flatMap((item) => item.equipment ? [item.equipment] : []))],
  };
  const save = async (values: ExerciseFormValues) => {
    if (update.isPending) return;
    try {
      // Empty optional text must clear a stored value on edit, whereas create
      // intentionally omits those fields to retain the server's defaults.
      await update.mutateAsync({ id, data: {
        ...toExercisePayload(values),
        nameEn: values.nameEn.trim(), equipment: values.equipment.trim(),
        description: values.description.trim(), instructions: values.instructions.trim(),
        tips: values.tips.trim(), videoUrl: values.videoUrl.trim(),
      } });
      toast.success("حرکت با موفقیت به‌روزرسانی شد");
      router.push("/coach/exercises");
    } catch (error) {
      toast.error(apiErrorMessage(error, "خطا در به‌روزرسانی حرکت"));
    }
  };
  if (query.isLoading) return <Loading />;
  if (query.isError) return <ErrorDisplay message={query.error?.message} onRetry={query.refetch} />;
  if (!exercise) return <ErrorDisplay message="حرکت پیدا نشد" />;
  return (
    <PageShell>
      <PageHeader title="ویرایش حرکت" subtitle={exercise.name} action={
        <Button variant="ghost" size="sm" asChild><Link href="/coach/exercises"><ChevronRight className="h-4 w-4" aria-hidden />بازگشت</Link></Button>
      } />
      <ExerciseForm key={`${exercise.id}:${exercise.updatedAt}`} defaultValues={toExerciseFormValues(exercise)} suggestions={suggestions}
        submitLabel="ذخیره" pending={update.isPending} onSubmit={save} onCancel={() => router.push("/coach/exercises")} />
    </PageShell>
  );
}
