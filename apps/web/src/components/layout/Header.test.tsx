import { render, screen } from "@testing-library/react";
import { expect, it, vi } from "vitest";
import { Header } from "./Header";

vi.mock("@/components/auth/AuthProvider", () => ({ useAuth: () => ({ user: { id: "reception", role: "receptionist", firstName: "", lastName: "", email: "desk@example.com" }, logout: vi.fn() }) }));
vi.mock("@/hooks/use-api", () => ({ useNotifications: () => ({ data: { data: [] } }) }));
vi.mock("next-themes", () => ({ useTheme: () => ({ resolvedTheme: "dark", setTheme: vi.fn() }) }));

it("keeps receptionist destinations in the admin portal and names the account menu", () => {
  render(<Header />);
  expect(screen.getByRole("link", { name: "اعلان‌ها" })).toHaveAttribute("href", "/admin/notifications");
  expect(screen.getByRole("button", { name: /منوی حساب/ })).toBeVisible();
});
