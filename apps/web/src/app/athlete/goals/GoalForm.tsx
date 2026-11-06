"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Save } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/Select";
import { useUnsavedChanges } from "@/hooks/use-unsaved-changes";
import type { Goal } from "@/lib/types";

const categories = [
  { value: "weight_loss", label: "کاهش وزن" }, { value: "muscle_gain", label: "افزایش عضله" },
  { value: "strength", label: "قدرت" }, { value: "endurance", label: "استقامت" },
  { value: "flexibility", label: "انعطاف‌پذیری" }, { value: "custom", label: "هدف شخصی" },
] as const;
const numeric = (positive: boolean) => z.string().trim().min(1, "مقدار را وارد کنید").refine(v => Number.isFinite(Number(v)) && (positive ? Number(v) > 0 : Number(v) >= 0), positive ? "مقدار هدف باید عددی بزرگ‌تر از صفر باشد" : "مقدار فعلی باید عددی برابر یا بزرگ‌تر از صفر باشد");
const schema = z.object({
  title: z.string().trim().min(1, "عنوان هدف را وارد کنید").max(100, "عنوان حداکثر ۱۰۰ کاراکتر است"),
  category: z.string().trim().min(1, "دسته‌بندی را انتخاب کنید").max(50, "دسته‌بندی طولانی است"),
  current: numeric(false), target: numeric(true), unit: z.string().trim().min(1, "واحد را وارد کنید").max(30, "واحد طولانی است"),
  deadline: z.string().refine(v => /^\d{4}-\d{2}-\d{2}$/.test(v) && Number.isFinite(Date.parse(v)) && new Date(v).toISOString().slice(0, 10) === v, "تاریخ معتبر انتخاب کنید"),
  notes: z.string().max(2000, "یادداشت حداکثر ۲۰۰۰ کاراکتر است"),
});
type Values = z.infer<typeof schema>;
export type GoalFormPatch = Pick<Goal, "title" | "category" | "currentValue" | "targetValue" | "unit" | "targetDate" | "description">;

export const goalDraftKey = (goal?: Goal, ownerId?: string) => `lumi:goal-draft:v1:${ownerId ?? goal?.athleteId ?? "anonymous"}:${goal?.id ?? "new"}`;
export function clearGoalDraft(key: string) { try { sessionStorage.removeItem(key); } catch { /* Storage may be unavailable. */ } }

export function GoalForm({ goal, ownerId, pending, onSubmit, footer }: { goal?: Goal; ownerId?: string; pending: boolean; onSubmit: (patch: GoalFormPatch) => Promise<void>; footer?: React.ReactNode }) {
  // The API also accepts legacy free-text categories; keep them selectable.
  const options = goal?.category && !categories.some(c => c.value === goal.category) ? [...categories, { value: goal.category, label: goal.category }] : categories;
  const [error, setError] = useState("");
  const draftKey = goalDraftKey(goal, ownerId);
  const restored = useRef(false);
  const saved = useRef(false);
  const { register, handleSubmit, watch, setValue, reset, formState: { errors, isDirty, isSubmitting } } = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: { title: goal?.title ?? "", category: goal?.category ?? "custom", current: String(goal?.currentValue ?? 0), target: String(goal?.targetValue ?? 10), unit: goal?.unit ?? "کیلوگرم", deadline: goal?.targetDate?.slice(0, 10) ?? "", notes: goal?.description ?? "" },
  });
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(draftKey);
      const draft = raw ? JSON.parse(raw) : null;
      const keys = ["title", "category", "current", "target", "unit", "deadline", "notes"];
      if (draft && keys.every(key => typeof draft[key] === "string" && draft[key].length <= 2000)) {
        restored.current = true;
        reset(draft, { keepDefaultValues: true });
      }
    } catch { /* An invalid draft does not replace API values. */ }
    const subscription = watch(values => {
      if (saved.current) return;
      try { sessionStorage.setItem(draftKey, JSON.stringify(values)); } catch { /* Unload/link guards still apply. */ }
    });
    return () => subscription.unsubscribe();
  }, [draftKey, reset, watch]);
  useUnsavedChanges(isDirty);
  const busy = pending || isSubmitting;
  const submit = handleSubmit(async values => {
    setError("");
    try {
      await onSubmit({ title: values.title, category: values.category as Goal["category"], currentValue: Number(values.current), targetValue: Number(values.target), unit: values.unit, targetDate: values.deadline, description: values.notes.trim() });
      saved.current = true; clearGoalDraft(draftKey);
    }
    catch (e) { setError(e instanceof Error ? e.message : "ذخیره ناموفق بود؛ دوباره تلاش کنید."); }
  });
  return (
    <form onSubmit={submit} className="space-y-5" noValidate aria-busy={busy}>
      {restored.current && isDirty && <p role="status" className="rounded-xl bg-muted p-3 text-xs leading-6 text-muted-foreground">پیش‌نویس این نشست بازیابی شد؛ پیش از ذخیره، تغییرها را مرور کنید.</p>}
      <fieldset disabled={busy} className="space-y-5">
        <Input label="عنوان هدف" autoComplete="off" required error={errors.title?.message} placeholder="مثلاً افزایش استقامت…" {...register("title")} />
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <label htmlFor="goal-category" className="text-xs font-medium text-muted-foreground">دسته‌بندی</label>
            <Select value={watch("category")} onValueChange={v => setValue("category", v as Values["category"], { shouldDirty: true, shouldValidate: true })} disabled={busy}>
              <SelectTrigger id="goal-category" aria-label="دسته‌بندی"><SelectValue /></SelectTrigger>
              <SelectContent>{options.map(c => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <Input label="مهلت" type="date" required error={errors.deadline?.message} {...register("deadline")} />
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          <Input label="مقدار فعلی" type="number" inputMode="decimal" min={0} step="any" required error={errors.current?.message} {...register("current")} />
          <Input label="مقدار هدف" type="number" inputMode="decimal" min={0} step="any" required error={errors.target?.message} {...register("target")} />
          <Input label="واحد" autoComplete="off" required error={errors.unit?.message} {...register("unit")} />
        </div>
        <Textarea label="یادداشت" autoComplete="off" error={errors.notes?.message} {...register("notes")} />
      </fieldset>
      {error && <p role="alert" className="rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">{error}</p>}
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
        {footer ?? <Button asChild variant="outline" disabled={busy}><Link href="/athlete/goals">انصراف</Link></Button>}
        <Button type="submit" loading={busy}><Save aria-hidden className="h-4 w-4" />{goal ? "ذخیره تغییرات" : "ثبت هدف"}</Button>
      </div>
    </form>
  );
}
