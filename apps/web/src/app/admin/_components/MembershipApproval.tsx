"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useAuth } from "@/components/auth/AuthProvider";
import { apiErrorMessage } from "@/components/auth/auth-helpers";
import { useRenewMembership } from "@/hooks/use-api";
import type { Membership } from "@/lib/types";
import { Sheet } from "@/components/ui/Sheet";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export function MembershipApproval({ membership }: { membership: Membership }) {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const mutation = useRenewMembership();
  const [endDate, setEndDate] = useState("");
  const [sessions, setSessions] = useState(String(membership.sessionsTotal));
  if (user?.role !== "admin") return null;

  const confirm = async () => {
    const count = Number(sessions);
    if (!endDate || !Number.isInteger(count) || count < 0) {
      toast.error("تاریخ پایان و تعداد جلسات معتبر را وارد کنید");
      return;
    }
    try {
      await mutation.mutateAsync({ id: membership.id, endDate: `${endDate}T00:00:00Z`, sessionsTotal: count, resetSessionsUsed: true });
      toast.success("تمدید عضویت تأیید شد");
      setOpen(false);
    } catch (error) {
      toast.error(apiErrorMessage(error, "تأیید تمدید ناموفق بود"));
    }
  };
  const pending = Boolean(membership.renewalRequestedAt &&
    (!membership.renewalApprovedAt || membership.renewalRequestedAt > membership.renewalApprovedAt));
  return <>
    <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-border bg-card p-4">
      <p className="flex-1 text-sm">{pending ? "این ورزشکار درخواست تمدید عضویت دارد." : "تمدید عضویت با تأیید مدیریت انجام می‌شود."}</p>
      <Button onClick={() => setOpen(true)}>تأیید تمدید</Button>
    </div>
    <Sheet open={open} onOpenChange={setOpen} title="تأیید تمدید عضویت" description="پس از بررسی پرداخت و شرایط عضویت، دوره و جلسات جدید را تأیید کنید.">
      <div className="space-y-4">
        <Input label="تاریخ پایان جدید" type="date" value={endDate} onChange={(event) => setEndDate(event.target.value)} required />
        <Input label="تعداد جلسات دوره جدید" type="number" min={0} step={1} value={sessions} onChange={(event) => setSessions(event.target.value)} required />
        <p className="text-xs text-muted-foreground">با تأیید، شمارنده جلسات مصرف‌شده برای دوره جدید صفر می‌شود.</p>
        <Button onClick={confirm} loading={mutation.isPending}>ثبت تأیید مدیریت</Button>
      </div>
    </Sheet>
  </>;
}
