import { formatPersianNumber } from "@/lib/utils";

export interface CapsuleCheckIn {
  checkInTime: string;
  checkOutTime?: string | null;
  durationMinutes?: number | null;
}

export interface CapsuleDay {
  /** Local calendar day as `YYYY-MM-DD` — stable across re-renders. */
  key: string;
  weekday: string;
  short: string;
  dateLabel: string;
  dayOfMonth: string;
  sessions: number;
  minutes: number;
  isToday: boolean;
}

/** Persian weekday meta indexed by JS getDay(): 0=Sun … 6=Sat */
const FA_WEEKDAY: Array<{ label: string; short: string }> = [
  { label: "یکشنبه", short: "ی" },
  { label: "دوشنبه", short: "د" },
  { label: "سه‌شنبه", short: "س" },
  { label: "چهارشنبه", short: "چ" },
  { label: "پنج‌شنبه", short: "پ" },
  { label: "جمعه", short: "ج" },
  { label: "شنبه", short: "ش" },
];

const MIN_VISIBLE_PERCENT = 12;

function dayKey(date: Date): string {
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}

/** Minutes of a completed session; `null` when the session never closed. */
function sessionMinutes(checkIn: CapsuleCheckIn): number | null {
  const explicit = Number(checkIn.durationMinutes);
  if (Number.isFinite(explicit) && explicit > 0) return Math.round(explicit);
  if (!checkIn.checkOutTime) return null;
  const start = new Date(checkIn.checkInTime).getTime();
  const end = new Date(checkIn.checkOutTime).getTime();
  if (!Number.isFinite(start) || !Number.isFinite(end) || end <= start) return null;
  return Math.round((end - start) / 60000);
}

/**
 * Buckets completed sessions per local day and returns the seven most recent
 * days that actually hold a session — newest first. Days without a session are
 * skipped instead of being rendered as empty capsules.
 */
export function buildCapsuleDays(
  checkIns: CapsuleCheckIn[],
  now: Date = new Date(),
  limit = 7
): CapsuleDay[] {
  const buckets = new Map<string, { minutes: number; sessions: number }>();

  for (const checkIn of checkIns ?? []) {
    const minutes = sessionMinutes(checkIn);
    if (minutes === null) continue;
    const start = new Date(checkIn.checkInTime);
    if (!Number.isFinite(start.getTime())) continue;
    const key = dayKey(start);
    const bucket = buckets.get(key);
    if (bucket) {
      bucket.minutes += minutes;
      bucket.sessions += 1;
    } else {
      buckets.set(key, { minutes, sessions: 1 });
    }
  }

  const todayKey = dayKey(now);

  return [...buckets.entries()]
    .sort(([a], [b]) => (a < b ? 1 : a > b ? -1 : 0))
    .slice(0, limit)
    .map(([key, bucket]) => {
      const date = new Date(`${key}T00:00:00`);
      const meta = FA_WEEKDAY[date.getDay()];
      return {
        key,
        weekday: meta.label,
        short: meta.short,
        dateLabel: new Intl.DateTimeFormat("fa-IR", { month: "long", day: "numeric" }).format(date),
        dayOfMonth: formatPersianNumber(date.getDate()),
        sessions: bucket.sessions,
        minutes: bucket.minutes,
        isToday: key === todayKey,
      };
    });
}

/** Fill height of a capsule relative to the peak day, with a visible floor. */
export function capsulePercent(minutes: number, maxMinutes: number): number {
  if (!Number.isFinite(minutes) || minutes <= 0) return 0;
  if (!Number.isFinite(maxMinutes) || maxMinutes <= 0) return 0;
  return Math.max(MIN_VISIBLE_PERCENT, Math.round((minutes / maxMinutes) * 100));
}
