import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import AdminProfile from "./admin/profile/page";
import CoachProfile from "./coach/profile/page";

const mocks = vi.hoisted(() => ({
  update: vi.fn(), change: vi.fn(), updateUser: vi.fn(), logout: vi.fn(),
  user: { id: "member", firstName: "نام واقعی", lastName: "کاربر", email: "real@example.test", phone: "09123456789" },
}));
vi.mock("@/components/auth/AuthProvider", () => ({
  useAuth: () => ({ user: mocks.user, updateUser: mocks.updateUser, logout: mocks.logout }),
}));
vi.mock("@/hooks/use-api", () => ({
  useProfile: () => ({ data: { data: mocks.user } }),
  useUpdateProfile: () => ({ mutateAsync: mocks.update, isPending: false }),
  useChangePassword: () => ({ mutateAsync: mocks.change, isPending: false }),
  useDashboardStats: () => ({ data: { data: { totalMembers: 0, totalCoaches: 0, activeMembers: 0 } } }),
  useUsers: () => ({ data: { data: [] } }),
}));

beforeEach(() => {
  vi.clearAllMocks();
  mocks.update.mockResolvedValue({ success: true, data: { ...mocks.user, firstName: "نام جدید" } });
  mocks.change.mockResolvedValue({ success: true });
});

describe.each([AdminProfile, CoachProfile])("profile persistence", (Profile) => {
  it("shows the signed-in account and saves its editable fields", async () => {
    render(<Profile />);
    const input = screen.getByRole("textbox", { name: "نام" });
    expect(input).toHaveValue("نام واقعی");
    const user = userEvent.setup();
    await user.clear(input);
    await user.type(input, "نام جدید");
    await user.click(screen.getByRole("button", { name: "ذخیره تغییرات" }));
    expect(mocks.update).toHaveBeenCalledWith({ firstName: "نام جدید", lastName: "کاربر", phone: "09123456789" });
    expect(mocks.updateUser).toHaveBeenCalledWith(expect.objectContaining({ firstName: "نام جدید" }));
  });

  it("changes the password on the server before ending the revoked session", async () => {
    render(<Profile />);
    const user = userEvent.setup();
    await user.click(screen.getByRole("tab", { name: "امنیت" }));
    await user.type(screen.getByLabelText("رمز عبور فعلی"), "OldPass123");
    await user.type(screen.getByLabelText("رمز عبور جدید", { exact: true }), "NewPass123");
    await user.type(screen.getByLabelText("تکرار رمز عبور جدید"), "NewPass123");
    await user.click(screen.getByRole("button", { name: "تغییر رمز عبور" }));
    expect(mocks.change).toHaveBeenCalledWith({ currentPassword: "OldPass123", newPassword: "NewPass123" });
    expect(mocks.logout).toHaveBeenCalledOnce();
  });
});
