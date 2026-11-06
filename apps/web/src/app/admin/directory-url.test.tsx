import { render, screen } from "@testing-library/react";
import { expect, it, vi } from "vitest";
import MembersPage from "./members/page";
vi.mock("next/navigation", () => ({ useRouter: () => ({ push: vi.fn() }) }));
vi.mock("@/hooks/use-api", () => ({
  useUsers: () => ({ data: { data: Array.from({ length: 25 }, (_, i) => ({ id: String(i + 1), firstName: `عضو ${i + 1}`, lastName: "آزمون", email: `m${i}@example.com`, phone: "09123456789", status: "pending", createdAt: "2026-11-06T00:00:00Z" })) } }),
  useMemberships: () => ({ data: { data: [] } }), useMembershipPlans: () => ({ data: { data: [] } }),
}));
it("uses URL filtering and shows only the requested page in the active member directory", () => {
  history.replaceState({}, "", "/admin/members?status=pending&page=2");
  render(<MembersPage />);
  expect(screen.getByRole("button", { name: "در انتظار تأیید" })).toHaveAttribute("aria-pressed", "true");
  expect(screen.getAllByText("عضو 11 آزمون").length).toBeGreaterThan(0);
  expect(screen.queryAllByText("عضو 1 آزمون")).toHaveLength(0);
  expect(screen.queryAllByText("عضو 25 آزمون")).toHaveLength(0);
});
