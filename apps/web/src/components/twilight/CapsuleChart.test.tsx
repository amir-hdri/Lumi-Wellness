import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { WeeklyCapsuleChart } from "./CapsuleChart";

const checkIns = [
  { checkInTime: "2026-11-01T10:00:00", checkOutTime: "2026-11-01T11:45:00", durationMinutes: 105 },
  { checkInTime: "2026-10-31T10:00:00", checkOutTime: "2026-10-31T11:30:00", durationMinutes: 90 },
  { checkInTime: "2026-10-29T10:00:00", checkOutTime: "2026-10-29T11:15:00", durationMinutes: 75 },
];

beforeEach(() => {
  vi.useFakeTimers({ shouldAdvanceTime: true });
  vi.setSystemTime(new Date(2026, 10, 1, 12, 0, 0));
});

afterEach(() => {
  vi.useRealTimers();
});

describe("WeeklyCapsuleChart", () => {
  it("shows an empty state when no session was ever completed", () => {
    render(<WeeklyCapsuleChart checkIns={[]} />);

    expect(screen.getByText(/جلسه‌ای ثبت نشده/)).toBeInTheDocument();
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("renders one capsule per active day", () => {
    render(<WeeklyCapsuleChart checkIns={checkIns} />);

    expect(screen.getAllByRole("button")).toHaveLength(3);
  });

  it("shows the selected day with Persian numerals", () => {
    render(<WeeklyCapsuleChart checkIns={checkIns} />);

    expect(screen.getByText("یکشنبه ۱۰ آبان")).toBeInTheDocument();
    expect(screen.getAllByText("۱۰۵").length).toBeGreaterThan(0);
    expect(screen.queryByText("105")).not.toBeInTheDocument();
  });

  it("marks the current day in the accessible name", () => {
    render(<WeeklyCapsuleChart checkIns={checkIns} />);

    expect(screen.getByRole("button", { name: /امروز/ })).toBeInTheDocument();
  });

  it("switches the readout when another day is picked", async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<WeeklyCapsuleChart checkIns={checkIns} />);

    await user.click(screen.getByRole("button", { name: /^شنبه/ }));

    expect(screen.getByText("شنبه ۹ آبان")).toBeInTheDocument();
    expect(screen.getAllByText("۹۰").length).toBeGreaterThan(0);
  });

  it("summarises the week in Persian digits", () => {
    render(<WeeklyCapsuleChart checkIns={checkIns} />);

    expect(screen.getByText(/مجموع/)).toHaveTextContent("۲۷۰");
    expect(screen.getByText(/بیشترین/)).toHaveTextContent("۱۰۵");
  });
});
