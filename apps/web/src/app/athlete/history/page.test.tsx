import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, it, vi } from "vitest";
import History from "./page";

const mocks = vi.hoisted(() => ({ mutate: vi.fn() }));
vi.mock("@/components/auth/AuthProvider", () => ({ useAuth: () => ({ user: { id: "member" } }) }));
vi.mock("@/hooks/use-api", () => ({
  useCheckIns: () => ({ data: { data: [] } }),
  usePayments: () => ({ data: { data: [] } }),
  useTrainingPrograms: () => ({ data: { data: [] } }),
  useAthleteActivity: () => ({ data: { data: [] } }),
  useAthleteDashboard: () => ({ data: { data: { stats: { totalSessions: 0, currentStreak: 0, longestStreak: 0 } } } }),
}));
vi.mock("@/hooks/use-readiness", () => ({
  useReadinessHistory: () => ({ data: { data: [] } }),
  useReadiness: () => ({ query: { data: { data: { state: "recovered" } } }, mutation: { mutate: mocks.mutate } }),
}));
vi.mock("@/services/soundEngine", () => ({ soundEngine: { playBell: vi.fn() } }));

it("renders empty real history without invented sessions or earned badges", () => {
  render(<History />);
  expect(screen.queryByText("۱۴۲")).not.toBeInTheDocument();
  expect(screen.getAllByText("۰").length).toBeGreaterThanOrEqual(2);
  expect(screen.queryByText("۳ روز پیش")).not.toBeInTheDocument();
});

it("uses the saved readiness and sends changes through the persistence hook", async () => {
  render(<History />);
  expect(screen.getByRole("button", { name: "ریکاوری کامل" })).toHaveAttribute("aria-pressed", "true");
  await userEvent.click(screen.getByRole("button", { name: "پرانرژی" }));
  expect(mocks.mutate).toHaveBeenCalledWith("energized", expect.any(Object));
});
