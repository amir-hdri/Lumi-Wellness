"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useAuth } from "@/components/auth/AuthProvider";
import { apiErrorMessage } from "@/components/auth/auth-helpers";
import { useProfile, useUpdateProfile, useChangePassword } from "./use-api";

type ProfileFields = { firstName: string; lastName: string; phone: string; email: string };

/** Keep drafts separate from the fetched account so async loads do not erase edits. */
export function useProfileForm() {
  const { user, updateUser, logout } = useAuth();
  const query = useProfile();
  const update = useUpdateProfile();
  const change = useChangePassword();
  const [draft, setDraft] = useState<Partial<ProfileFields>>({});
  const [password, setPassword] = useState({ current: "", newPass: "", confirm: "" });
  const source = query.data?.data ?? user;
  const profile: ProfileFields = {
    firstName: source?.firstName ?? "", lastName: source?.lastName ?? "",
    phone: source?.phone ?? "", ...draft, email: source?.email ?? "",
  };

  const setProfile = (next: ProfileFields) => setDraft({
    firstName: next.firstName, lastName: next.lastName, phone: next.phone,
  });

  const handleSaveProfile = async () => {
    if (!source || update.isPending) return;
    const data = { firstName: profile.firstName.trim(), lastName: profile.lastName.trim(), phone: profile.phone.trim() };
    if (!data.firstName || !data.lastName) {
      toast.error("نام و نام خانوادگی را وارد کنید");
      return;
    }
    try {
      const result = await update.mutateAsync(data);
      if (result.data) updateUser(result.data);
      setDraft({});
      toast.success("پروفایل با موفقیت به‌روزرسانی شد");
    } catch (error) {
      toast.error(apiErrorMessage(error, "ذخیره پروفایل ناموفق بود"));
    }
  };

  const handleChangePassword = async () => {
    if (!password.current || !password.newPass || change.isPending) return;
    if (password.newPass !== password.confirm) {
      toast.error("رمز عبور و تکرار آن یکسان نیستند");
      return;
    }
    try {
      await change.mutateAsync({ currentPassword: password.current, newPassword: password.newPass });
      setPassword({ current: "", newPass: "", confirm: "" });
      toast.success("رمز عبور تغییر کرد؛ با رمز جدید وارد شوید");
      logout();
    } catch (error) {
      toast.error(apiErrorMessage(error, "تغییر رمز عبور ناموفق بود"));
    }
  };

  return { profile, setProfile, password, setPassword, handleSaveProfile, handleChangePassword,
    isLoading: query.isLoading, isError: query.isError, error: query.error,
    isSaving: update.isPending, isChangingPassword: change.isPending };
}
