"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { PageShell, PageHeader } from "@/components/twilight/Page";
import { NewUserForm } from "../../_components/NewUserForm";

export default function NewMemberPage() {
  return (
    <PageShell>
      <div>
        <Button variant="ghost" size="sm" asChild className="mb-2">
          <Link href="/admin/members"><ChevronRight className="h-4 w-4" aria-hidden /> بازگشت</Link>
        </Button>
        <PageHeader title="افزودن عضو جدید" subtitle="ثبت اطلاعات ورزشکار جدید" />
      </div>
      {/* Account creation stores identity only. Membership/program assignment is
          managed from the saved profile; specialty/experience have no API fields. */}
      <NewUserForm role="athlete" listHref="/admin/members" submitLabel="ثبت عضو" noun="عضو" />
    </PageShell>
  );
}
