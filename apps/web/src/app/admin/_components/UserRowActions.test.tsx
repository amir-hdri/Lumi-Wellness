import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, it, vi } from "vitest";
import { UserRowActions } from "./UserRowActions";
import type { User } from "@/lib/types";

const mocks = vi.hoisted(() => ({ role: "admin" }));
vi.mock("@/components/auth/AuthProvider", () => ({ useAuth: () => ({ user: { id: "actor", role: mocks.role } }) }));
vi.mock("@/hooks/use-api", () => ({ useDeleteUser: () => ({}), useUpdateUserStatus: () => ({}) }));
vi.mock("./UserAdminSheets", () => ({ UserEditSheet: () => null, UserPasswordSheet: () => null, UserRoleSheet: () => null }));
const member = { id: "member", firstName: "کاربر", lastName: "واقعی", status: "active", role: "athlete" } as User;

it("allows management to reach the existing role-change operation", async () => {
  mocks.role = "admin";
  render(<UserRowActions user={member} noun="عضو" />);
  await userEvent.click(screen.getByRole("button", { name: "عملیات کاربر واقعی" }));
  expect(screen.getByRole("menuitem", { name: "تغییر نقش" })).toBeInTheDocument();
});

it("does not offer reception forbidden password, role or delete actions", async () => {
  mocks.role = "receptionist";
  render(<UserRowActions user={member} noun="عضو" />);
  await userEvent.click(screen.getByRole("button", { name: "عملیات کاربر واقعی" }));
  expect(screen.queryByRole("menuitem", { name: "تعیین رمز عبور" })).not.toBeInTheDocument();
  expect(screen.queryByRole("menuitem", { name: "تغییر نقش" })).not.toBeInTheDocument();
  expect(screen.queryByRole("menuitem", { name: "حذف عضو" })).not.toBeInTheDocument();
});

it("hides privileged account edits and status changes from reception", async () => {
  mocks.role = "receptionist";
  render(<UserRowActions user={{ ...member, role: "coach" }} noun="مربی" detailHref="/admin/coaches/member" />);
  await userEvent.click(screen.getByRole("button", { name: "عملیات کاربر واقعی" }));
  expect(screen.getByRole("menuitem", { name: "مشاهده پروفایل" })).toBeInTheDocument();
  expect(screen.queryByRole("menuitem", { name: "ویرایش اطلاعات" })).not.toBeInTheDocument();
  expect(screen.queryByText("تغییر وضعیت")).not.toBeInTheDocument();
});
