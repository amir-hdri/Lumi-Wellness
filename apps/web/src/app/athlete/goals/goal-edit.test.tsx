import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, expect, it, vi } from "vitest";
import GoalDetailPage from "./[id]/page";

const mocks = vi.hoisted(() => ({ goal: null as any, update: vi.fn(), remove: vi.fn(), push: vi.fn() }));
vi.mock("next/navigation", () => ({ useParams: () => ({ id: "g1" }), useRouter: () => ({ push: mocks.push }) }));
vi.mock("@/hooks/use-api", () => ({
  useGoal: () => ({ data: { data: mocks.goal }, isLoading: !mocks.goal }),
  useUpdateGoal: () => ({ mutateAsync: mocks.update, isPending: false }),
  useUpdateGoalProgress: () => ({ mutateAsync: vi.fn(), isPending: false }),
  useDeleteGoal: () => ({ mutateAsync: mocks.remove, isPending: false }),
}));
const goal = { id: "g1", athleteId: "a1", title: "هدف قدرت", category: "strength", currentValue: 20, targetValue: 50, unit: "کیلوگرم", targetDate: "2026-12-01T00:00:00Z", description: "یادداشت اولیه", status: "in_progress", progressPercentage: 40 };
beforeEach(() => { sessionStorage.clear(); vi.clearAllMocks(); mocks.goal = null; mocks.update.mockResolvedValue({ success: true }); mocks.remove.mockResolvedValue({ success: true }); });

it("populates asynchronously received fields and saves every editable value", async () => {
  const view = render(<GoalDetailPage />);
  mocks.goal = goal;
  view.rerender(<GoalDetailPage />);
  const title = screen.getByRole("textbox", { name: "عنوان هدف" });
  expect(title).toHaveValue("هدف قدرت");
  expect(screen.getByLabelText(/مهلت/)).toHaveValue("2026-12-01");
  await userEvent.clear(title); await userEvent.type(title, "هدف تازه");
  await userEvent.click(screen.getByRole("button", { name: "ذخیره تغییرات" }));
  await waitFor(() => expect(mocks.update).toHaveBeenCalledWith({ id: "g1", data: expect.objectContaining({ title: "هدف تازه", category: "strength", currentValue: 20, targetValue: 50, unit: "کیلوگرم", targetDate: "2026-12-01", description: "یادداشت اولیه" }) }));
});

it("requires confirmation before deleting and retains the form when a save fails", async () => {
  mocks.goal = goal; mocks.update.mockRejectedValue(new Error("ذخیره نشد"));
  render(<GoalDetailPage />);
  await userEvent.click(screen.getByRole("button", { name: "ذخیره تغییرات" }));
  await waitFor(() => expect(screen.getByRole("alert")).toHaveTextContent("ذخیره نشد"));
  expect(screen.getByRole("textbox", { name: "عنوان هدف" })).toHaveValue("هدف قدرت");
  expect(mocks.push).not.toHaveBeenCalled();
  await userEvent.click(screen.getByRole("button", { name: "حذف هدف" }));
  expect(mocks.remove).not.toHaveBeenCalled();
  await userEvent.click(screen.getByRole("button", { name: "تأیید حذف هدف" }));
  await waitFor(() => expect(mocks.remove).toHaveBeenCalledWith("g1"));
});

it("derives progress from recorded values when the real API omits a percentage", () => {
  mocks.goal = { ...goal, progressPercentage: undefined };
  render(<GoalDetailPage />);
  expect(screen.getByRole("progressbar", { name: "پیشرفت هدف" })).toHaveAttribute("aria-valuenow", "40");
});

it("marks a goal achieved when the edited value reaches its target", async () => {
  mocks.goal = goal;
  render(<GoalDetailPage />);
  const current = screen.getByRole("spinbutton", { name: "مقدار فعلی" });
  await userEvent.clear(current); await userEvent.type(current, "50");
  await userEvent.click(screen.getByRole("button", { name: "ذخیره تغییرات" }));
  await waitFor(() => expect(mocks.update).toHaveBeenCalledWith(expect.objectContaining({ data: expect.objectContaining({ currentValue: 50, status: "achieved" }) })));
});

it("restores unsaved values after navigating away and returning", async () => {
  mocks.goal = goal;
  const view = render(<GoalDetailPage />);
  const title = screen.getByRole("textbox", { name: "عنوان هدف" });
  await userEvent.clear(title); await userEvent.type(title, "پیش‌نویس محفوظ");
  view.unmount();
  render(<GoalDetailPage />);
  await waitFor(() => expect(screen.getByRole("textbox", { name: "عنوان هدف" })).toHaveValue("پیش‌نویس محفوظ"));
});
