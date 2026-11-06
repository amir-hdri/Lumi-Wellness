"use client";

import Link from "next/link";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { PageShell, PageHeader, SectionTitle } from "@/components/twilight/Page";
import { TwilightCard } from "@/components/twilight/controls";
import { useCreateGoal } from "@/hooks/use-api";
import { useAuth } from "@/components/auth/AuthProvider";
import { GoalForm } from "../GoalForm";

export default function NewGoalPage() {
  const router = useRouter();
  const { user } = useAuth();
  const create = useCreateGoal();
  return <PageShell>
    <Button asChild variant="ghost" size="sm" className="self-start"><Link href="/athlete/goals"><ChevronRight aria-hidden className="h-4 w-4" />بازگشت به اهداف</Link></Button>
    <PageHeader title="هدف جدید" subtitle="یک هدف روشن و قابل اندازه‌گیری برای مسیر تمرینت تعریف کن." />
    <TwilightCard className="space-y-5">
      <SectionTitle>اطلاعات هدف</SectionTitle>
      <GoalForm ownerId={user?.id} pending={create.isPending} onSubmit={async patch => {
        if (!user) throw new Error("برای ثبت هدف دوباره وارد شوید.");
        await create.mutateAsync({ ...patch, athleteId: user.id });
        toast.success("هدف جدید ثبت شد");
        router.push("/athlete/goals");
      }} />
    </TwilightCard>
  </PageShell>;
}
