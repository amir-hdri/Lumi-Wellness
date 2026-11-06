"use client";

import { PageShell, PageHeader } from "@/components/twilight/Page";
import { TwilightCard } from "@/components/twilight/controls";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { Avatar, AvatarFallback } from "@/components/ui/Avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import { getInitials, generateAvatarColor } from "@/lib/utils";
import { Save, Lock } from "lucide-react";

import { useProfileForm } from "@/hooks/use-profile-form";
import { Loading, ErrorDisplay } from "@/components/ui/DataState";

export default function CoachProfilePage() {
  const { profile, setProfile, password, setPassword, handleSaveProfile, handleChangePassword,
    isLoading, isError, error, isSaving, isChangingPassword } = useProfileForm();
  const fullName = `${profile.firstName} ${profile.lastName}`;
  if (isLoading) return <Loading />;
  if (isError) return <ErrorDisplay message={error?.message} />;

  return (
    <PageShell>
      <PageHeader title="پروفایل مربی" subtitle="مدیریت اطلاعات حساب شما" />

      <div className="flex flex-col items-center pt-2">
        <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border-2 border-primary bg-gradient-to-br from-secondary to-card shadow-xl">
          <Avatar className="h-full w-full">
            <AvatarFallback className={`text-3xl ${generateAvatarColor(fullName)}`}>{getInitials(fullName)}</AvatarFallback>
          </Avatar>
        </div>
        <h2 className="mt-3.5 font-serif text-2xl font-normal tracking-tight text-foreground">{fullName}</h2>
        <div className="mt-2">
          <Badge variant="secondary">مربی</Badge>
        </div>
      </div>

      <Tabs defaultValue="info" dir="rtl">
        <TabsList className="w-full justify-start overflow-x-auto rounded-xl border border-border bg-card p-1">
          <TabsTrigger value="info" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-none">اطلاعات شخصی</TabsTrigger>
          <TabsTrigger value="security" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-none">امنیت</TabsTrigger>
        </TabsList>

        <TabsContent value="info" className="mt-4">
          <TwilightCard className="!p-5">
            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <Input label="نام" value={profile.firstName} onChange={(e) => setProfile({ ...profile, firstName: e.target.value })} />
                <Input label="نام خانوادگی" value={profile.lastName} onChange={(e) => setProfile({ ...profile, lastName: e.target.value })} />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <Input label="ایمیل" type="email" value={profile.email} readOnly />
                <Input label="تلفن" value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} />
              </div>
              <div className="flex justify-end pt-2">
                <Button onClick={handleSaveProfile} disabled={isSaving}><Save className="me-2 h-4 w-4" />ذخیره تغییرات</Button>
              </div>
            </div>
          </TwilightCard>
        </TabsContent>

        <TabsContent value="security" className="mt-4">
          <TwilightCard className="!p-5">
            <div className="space-y-4">
              {(["current", "newPass", "confirm"] as const).map((field) => (
                <Input
                  key={field}
                  label={field === "current" ? "رمز عبور فعلی" : field === "newPass" ? "رمز عبور جدید" : "تکرار رمز عبور جدید"}
                  type="password"
                  value={password[field]}
                  onChange={(e) => setPassword({ ...password, [field]: e.target.value })}
                />
              ))}
              <div className="flex justify-end pt-2">
                <Button onClick={handleChangePassword} disabled={isChangingPassword}><Lock className="me-2 h-4 w-4" />تغییر رمز عبور</Button>
              </div>
            </div>
          </TwilightCard>
        </TabsContent>
      </Tabs>
    </PageShell>
  );
}
