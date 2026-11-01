import { describe, expect, it } from "vitest";
import { buildCapsuleDays, capsulePercent, type CapsuleCheckIn } from "./capsule-chart-data";

const NOW = new Date(2026, 10, 1, 12, 0, 0); // 1 Nov 2026, a Sunday

function session(
  day: string,
  minutes: number | null,
  extra: Partial<CapsuleCheckIn> = {}
): CapsuleCheckIn {
  return {
    checkInTime: `${day}T10:00:00`,
    checkOutTime: minutes === null ? null : `${day}T12:00:00`,
    durationMinutes: minutes,
    ...extra,
  };
}

describe("buildCapsuleDays", () => {
  it("returns nothing when there is no check-in", () => {
    expect(buildCapsuleDays([], NOW)).toEqual([]);
  });

  it("keeps the seven most recent active days, newest first", () => {
    const checkIns = [
      session("2026-10-25", 60),
      session("2026-10-26", 60),
      session("2026-10-27", 60),
      session("2026-10-28", 60),
      session("2026-10-29", 60),
      session("2026-10-30", 60),
      session("2026-10-31", 60),
      session("2026-11-01", 60),
    ];

    const days = buildCapsuleDays(checkIns, NOW);

    expect(days).toHaveLength(7);
    expect(days[0].key).toBe("2026-11-01");
    expect(days[6].key).toBe("2026-10-26");
  });

  it("skips days without a session instead of rendering empty capsules", () => {
    const checkIns = [
      session("2026-10-28", 60),
      session("2026-10-30", 60),
      session("2026-11-01", 60),
    ];

    const days = buildCapsuleDays(checkIns, NOW);

    expect(days.map((day) => day.key)).toEqual(["2026-11-01", "2026-10-30", "2026-10-28"]);
  });

  it("sums sessions and minutes per day", () => {
    const checkIns = [
      session("2026-11-01", 105),
      session("2026-11-01", 45),
      session("2026-10-31", 90),
    ];

    const days = buildCapsuleDays(checkIns, NOW);

    expect(days[0]).toMatchObject({ sessions: 2, minutes: 150 });
    expect(days[1]).toMatchObject({ sessions: 1, minutes: 90 });
  });

  it("ignores sessions that were never completed", () => {
    const checkIns = [
      { checkInTime: "2026-11-01T10:00:00", checkOutTime: null, durationMinutes: null },
      session("2026-10-31", 90),
    ];

    const days = buildCapsuleDays(checkIns, NOW);

    expect(days.map((day) => day.key)).toEqual(["2026-10-31"]);
  });

  it("derives the duration from check-in/check-out when durationMinutes is missing", () => {
    const checkIns = [
      {
        checkInTime: "2026-11-01T10:00:00",
        checkOutTime: "2026-11-01T11:45:00",
        durationMinutes: null,
      },
    ];

    const days = buildCapsuleDays(checkIns, NOW);

    expect(days[0]).toMatchObject({ sessions: 1, minutes: 105 });
  });

  it("labels days in Persian and flags today", () => {
    const checkIns = [session("2026-11-01", 105), session("2026-10-31", 90)];

    const days = buildCapsuleDays(checkIns, NOW);

    expect(days[0]).toMatchObject({
      weekday: "یکشنبه",
      short: "ی",
      dateLabel: "۱۰ آبان",
      dayOfMonth: "۱",
      isToday: true,
    });
    expect(days[1]).toMatchObject({ weekday: "شنبه", short: "ش", isToday: false });
  });

  it("does not flag a non-today day when the clock is past midnight", () => {
    const checkIns = [session("2026-10-31", 90)];

    const days = buildCapsuleDays(checkIns, NOW);

    expect(days.every((day) => !day.isToday)).toBe(true);
  });

  it("drops malformed timestamps instead of throwing", () => {
    const checkIns = [
      { checkInTime: "not-a-date", checkOutTime: null, durationMinutes: 60 },
      session("2026-11-01", 105),
    ];

    const days = buildCapsuleDays(checkIns, NOW);

    expect(days.map((day) => day.key)).toEqual(["2026-11-01"]);
  });
});

describe("capsulePercent", () => {
  it("scales against the peak day", () => {
    expect(capsulePercent(105, 105)).toBe(100);
    expect(capsulePercent(52.5, 105)).toBe(50);
  });

  it("keeps a small day visible", () => {
    expect(capsulePercent(1, 105)).toBeGreaterThan(0);
  });

  it("returns zero for an empty or invalid scale", () => {
    expect(capsulePercent(0, 0)).toBe(0);
    expect(capsulePercent(30, 0)).toBe(0);
  });
});
