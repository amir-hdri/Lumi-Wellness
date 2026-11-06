import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, it, vi } from "vitest";
import NotificationsPage from "./page";
const mocks = vi.hoisted(() => ({ read: vi.fn(), remove: vi.fn() }));
vi.mock("@/components/auth/AuthProvider", () => ({ useAuth: () => ({ user: { id: "a1" } }) }));
vi.mock("@/hooks/use-api", () => ({
  useNotifications: () => ({ data: { data: [{ id: "n1", title: "تمرین امروز", message: "برنامه آماده است", isRead: false, type: "info", createdAt: "2026-11-06T09:00:00Z" }] } }),
  useMarkNotificationRead: () => ({ mutate: mocks.read }),
  useMarkAllNotificationsRead: () => ({ mutate: vi.fn() }),
  useDeleteNotification: () => ({ mutate: mocks.remove }),
}));
it("allows reading with the keyboard without activating deletion", async () => {
  render(<NotificationsPage />);
  const read = screen.getByRole("button", { name: /خواندن اعلان.*تمرین امروز/ });
  read.focus(); await userEvent.keyboard("{Enter}");
  expect(mocks.read).toHaveBeenCalledWith("n1", expect.any(Object));
  expect(mocks.remove).not.toHaveBeenCalled();
});
