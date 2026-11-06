"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Sheet } from "@/components/ui/Sheet";
import { ErrorDisplay, Loading } from "@/components/ui/DataState";
import { SectionTitle } from "@/components/twilight/Page";
import { useUsers } from "@/hooks/use-api";
import { NewUserForm } from "./NewUserForm";
import { UserRowActions } from "./UserRowActions";
import type { UserRole } from "@/lib/types";

/** Staff promoted from member/coach lists remain discoverable here. */
export function StaffAccounts() {
  const admins = useUsers("admin");
  const reception = useUsers("receptionist");
  const [creating, setCreating] = useState<Extract<UserRole, "admin" | "receptionist"> | null>(null);
  const users = [...(admins.data?.data ?? []), ...(reception.data?.data ?? [])];
  return (
    <section aria-label="حساب‌های کارکنان" className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <SectionTitle>حساب‌های کارکنان</SectionTitle>
        <div className="flex flex-wrap gap-2">
          <Button size="sm" onClick={() => setCreating("receptionist")}>افزودن پذیرش</Button>
          <Button size="sm" variant="outline" onClick={() => setCreating("admin")}>افزودن مدیر</Button>
        </div>
      </div>
      <p className="text-xs text-muted-foreground">حساب‌های مدیر و پذیرش، از جمله حساب‌هایی که نقش آن‌ها تغییر کرده، در این بخش مدیریت می‌شوند.</p>
      {admins.isLoading || reception.isLoading ? <Loading /> : admins.isError || reception.isError ? (
        <ErrorDisplay message="حساب‌های کارکنان بارگذاری نشد" onRetry={() => { void admins.refetch(); void reception.refetch(); }} />
      ) : (
        <ul className="divide-y divide-border rounded-2xl border border-border bg-card">
          {users.map((user) => (
            <li key={user.id} className="flex items-center gap-3 p-4">
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{user.firstName} {user.lastName}</p>
                <p dir="ltr" className="truncate text-start text-xs text-muted-foreground">{user.email}</p>
                <Badge variant="secondary" className="mt-2">{user.role === "admin" ? "مدیر" : "پذیرش"}</Badge>
                <span className="ms-2 text-xs text-muted-foreground">{({ active: "فعال", inactive: "غیرفعال", suspended: "تعلیق‌شده", pending: "در انتظار" })[user.status]}</span>
              </div>
              <UserRowActions user={user} noun="کارمند" />
            </li>
          ))}
        </ul>
      )}
      <Sheet open={creating !== null} onOpenChange={(open) => { if (!open) setCreating(null); }} title={creating === "admin" ? "افزودن مدیر" : "افزودن پذیرش"}>
        {creating && <NewUserForm key={creating} role={creating} listHref="/admin/settings" afterCreateHref="/admin/settings" onCreated={() => setCreating(null)} submitLabel="ثبت کارمند" noun="کارمند" />}
      </Sheet>
    </section>
  );
}
