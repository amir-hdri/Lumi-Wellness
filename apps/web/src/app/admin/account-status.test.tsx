import { render, screen } from "@testing-library/react";
import { expect, it, vi } from "vitest";
import MembersPage from "./members/page";
import CoachesPage from "./coaches/page";

vi.mock("next/navigation", () => ({ useRouter: () => ({ push: vi.fn() }) }));
vi.mock("@/components/auth/AuthProvider", () => ({ useAuth: () => ({ user: { id: "admin", role: "admin" } }) }));
vi.mock("@/hooks/use-api", () => ({
  useUsers: () => ({ data: { data: [{ id: "pending", role: "athlete", status: "pending", firstName: "منتظر", lastName: "تأیید", email: "pending@example.test", phone: "09123456789", createdAt: "2026-11-06T00:00:00Z" }] } }),
  useTrainingPrograms: () => ({ data: { data: [] } }),
  useMemberships: () => ({ data: { data: [{ id: "membership", userId: "pending", planId: "plan", endDate: "2026-12-06" }] } }),
  useMembershipPlans: () => ({ data: { data: [{ id: "plan", name: "پلن واقعی" }] } }),
}));

it.each([MembersPage, CoachesPage])("renders pending accounts without crashing the directory", (Page) => {
  render(<Page />);
  expect(screen.getAllByText("در انتظار تأیید").length).toBeGreaterThan(0);
});

it("shows the assigned plan from saved memberships rather than a nonexistent user field", () => {
  render(<MembersPage />);
  expect(screen.getAllByText("پلن واقعی").length).toBeGreaterThan(0);
  expect(screen.queryByText("بدون طرح")).not.toBeInTheDocument();
});
