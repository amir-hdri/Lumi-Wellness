"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { PageShell, PageHeader } from "@/components/twilight/Page";
import { NewUserForm } from "../../_components/NewUserForm";
import { useAuth } from "@/components/auth/AuthProvider";

export default function NewCoachPage() {
  const { user } = useAuth();
  return (
    <PageShell>
      <div>
        <Button variant="ghost" size="sm" asChild className="mb-2">
          <Link href="/admin/coaches"><ChevronRight className="h-4 w-4" aria-hidden /> بازگشت</Link>
        </Button>
        <PageHeader title="افزودن مربی جدید" subtitle="ثبت اطلاعات مربی جدید" />
      </div>
      {/* Account creation stores identity only. Membership/program assignment is
          managed from the saved profile; specialty/experience have no API fields. */}
      {user?.role === "admin" ? <NewUserForm role="coach" listHref="/admin/coaches" submitLabel="ثبت مربی" noun="مربی" /> : <p className="text-sm text-muted-foreground">ساخت حساب مربی به دسترسی مدیریت نیاز دارد.</p>}
    </PageShell>
  );
}
