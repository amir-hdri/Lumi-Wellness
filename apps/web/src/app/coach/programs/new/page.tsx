"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ChevronRight, Save } from "lucide-react";
import { Loading } from "@/components/ui/DataState";
import { PageShell, PageHeader } from "@/components/twilight/Page";
import { TwilightCard } from "@/components/twilight/controls";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select";
import { toast } from "sonner";
import { useUsers, useCreateTrainingProgram } from "@/hooks/use-api";
import { useAuth } from "@/components/auth/AuthProvider";
import { apiErrorMessage } from "@/components/auth/auth-helpers";
import { fromDateInputValue } from "../../_dates";

const frequencies = ["۱ روز در هفته", "۲ روز در هفته", "۳ روز در هفته", "۴ روز در هفته", "۵ روز در هفته", "۶ روز در هفته", "۷ روز در هفته"];

export default function NewProgramPage() {
  return <Suspense fallback={<Loading />}><NewProgramForm /></Suspense>;
}

function NewProgramForm() {
  const requestedAthlete = useSearchParams().get("athleteId");
  const router = useRouter();
  const { user } = useAuth();
  const create = useCreateTrainingProgram();
  const [title, setTitle] = useState("");
  const [selectedAthlete, setAthlete] = useState<string | null>(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [frequency, setFrequency] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { data: athletesData, isLoading: athletesLoading } = useUsers("athlete");
  const athletes = athletesData?.data || [];
  // URL selection is used only when it exists in the server-provided options.
  const athlete = selectedAthlete ?? (athletes.some((item) => item.id === requestedAthlete) ? requestedAthlete! : "");

  const handleSave = async () => {
    if (!title.trim() || !athlete || !startDate || !endDate || !frequency) {
      toast.error("لطفاً تمام فیلدها را پر کنید");
      return;
    }
    if (isSubmitting) return;
    if (title.trim().length > 100 || endDate < startDate) {
      toast.error("عنوان باید حداکثر ۱۰۰ کاراکتر و تاریخ پایان بعد از شروع باشد");
      return;
    }
    const weekly = Number(frequency);
    if (!user || user.role !== "coach" || !athletes.some((item) => item.id === athlete) || !Number.isInteger(weekly) || weekly < 1 || weekly > 7) {
      toast.error("مربی و ورزشکار معتبر را انتخاب کنید");
      return;
    }
    setIsSubmitting(true);
    try {
      const saved = await create.mutateAsync({
        name: title.trim(), athleteId: athlete, coachId: user.id,
        startDate: fromDateInputValue(startDate), endDate: fromDateInputValue(endDate),
        frequencyPerWeek: weekly, status: "draft",
      });
      if (!saved.data?.id) throw new Error("شناسه برنامه برنگشت؛ فهرست برنامه‌ها را بررسی کنید");
      toast.success("برنامه با موفقیت ایجاد شد");
      router.push(`/coach/programs/${saved.data.id}`);
    } catch (error) {
      toast.error(apiErrorMessage(error, "خطا در ایجاد برنامه"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageShell>
      <PageHeader
        title="برنامه جدید"
        subtitle="ایجاد برنامه تمرینی جدید برای شاگرد"
        action={
          <Button variant="ghost" size="sm" asChild>
            <Link href="/coach/programs">
              <ChevronRight className="h-4 w-4" />
              بازگشت
            </Link>
          </Button>
        }
      />

      <TwilightCard className="mx-auto w-full max-w-2xl !p-5">
        <div className="space-y-4">
          <Input
            label="عنوان برنامه"
            placeholder="مثال: برنامه حجیم‌سازی"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <div className="space-y-1.5">
            <Label htmlFor="program-athlete">ورزشکار</Label>
            <Select value={athlete} onValueChange={setAthlete} disabled={athletesLoading}>
              <SelectTrigger id="program-athlete">
                <SelectValue placeholder={athletesLoading ? "در حال بارگذاری..." : "انتخاب ورزشکار"} />
              </SelectTrigger>
              <SelectContent>
                {athletes.map((a) => {
                  const name = `${a.firstName} ${a.lastName}`;
                  return <SelectItem key={a.id} value={a.id}>{name}</SelectItem>;
                })}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="تاریخ شروع"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
            <Input
              label="تاریخ پایان"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="program-frequency">تعداد جلسات در هفته</Label>
            <Select value={frequency} onValueChange={setFrequency}>
              <SelectTrigger id="program-frequency">
                <SelectValue placeholder="انتخاب کنید" />
              </SelectTrigger>
              <SelectContent>
                {frequencies.map((f, index) => (
                  <SelectItem key={f} value={String(index + 1)}>{f}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end pt-2">
            <Button onClick={handleSave} loading={isSubmitting}>
              <Save className="ml-2 h-4 w-4" />
              ذخیره برنامه
            </Button>
          </div>
        </div>
      </TwilightCard>
    </PageShell>
  );
}
