"use client";

import { useId, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { CalendarDays } from "lucide-react";
import { cn, formatPersianNumber } from "@/lib/utils";
import {
  DURATION,
  EASE_OUT,
  STAGGER_STEP,
  springSnappy,
  tween,
  usePressable,
  useReducedMotion,
} from "@/lib/motion";
import { MicroLabelFa } from "./Type";
import {
  buildCapsuleDays,
  capsulePercent,
  type CapsuleCheckIn,
} from "./capsule-chart-data";

export type { CapsuleCheckIn };

/** viewBox geometry — the capsule is a rounded line, so caps stay perfectly round. */
const VIEW = { width: 32, height: 160 } as const;
const STROKE = 26;
const HALO_STROKE = 30;
const TRACK_TOP = 15;
const TRACK_BOTTOM = 145;
const TRACK_LENGTH = TRACK_BOTTOM - TRACK_TOP;

/**
 * Weekly activity capsules — one vertical pill per day that actually holds a
 * completed session (the seven most recent such days, newest first). Days
 * without a session are skipped, so the chart never reads as "no activity"
 * when the athlete simply trained earlier. Each fill scales against the peak
 * day of the same window and grows with a staggered spring-free reveal.
 */
export function WeeklyCapsuleChart({ checkIns }: { checkIns: CapsuleCheckIn[] }) {
  const gradientId = `capsule-gradient-${useId().replace(/:/g, "")}`;
  const reduced = useReducedMotion();
  const pressable = usePressable();
  const days = useMemo(() => buildCapsuleDays(checkIns), [checkIns]);
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const active = days.find((day) => day.key === selectedKey) ?? days[0];

  if (days.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 rounded-2xl border border-dashed border-border px-6 py-8 text-center">
        <span
          aria-hidden
          className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-blush"
        >
          <CalendarDays className="h-5 w-5" />
        </span>
        <p className="text-sm font-medium text-foreground">هنوز جلسه‌ای ثبت نشده</p>
        <p className="max-w-[280px] text-xs leading-relaxed text-muted-foreground">
          پس از اولین ورود و خروج، حجم فعالیت هفتگی اینجا نمایش داده می‌شود.
        </p>
      </div>
    );
  }

  const maxMinutes = Math.max(...days.map((day) => day.minutes));
  const totalMinutes = days.reduce((sum, day) => sum + day.minutes, 0);
  const totalSessions = days.reduce((sum, day) => sum + day.sessions, 0);

  return (
    <div className="space-y-4">
      {/* Readout for the selected day — re-enters on every selection change. */}
      <motion.div
        key={active.key}
        initial={reduced ? { opacity: 1 } : { opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={tween(DURATION.base, EASE_OUT)}
        className="flex items-center justify-between gap-3 rounded-xl border border-border bg-secondary/50 px-3 py-2"
      >
        <div className="flex min-w-0 flex-col gap-0.5">
          <MicroLabelFa>{`${active.weekday} ${active.dateLabel}`}</MicroLabelFa>
          <span className="truncate text-xs text-muted-foreground">
            {formatPersianNumber(active.sessions)} جلسه
          </span>
        </div>
        <div className="flex items-baseline gap-1 text-blush">
          <span className="text-lg font-semibold tabular-nums">
            {formatPersianNumber(active.minutes)}
          </span>
          <span className="text-[11px]">دقیقه</span>
        </div>
      </motion.div>

      {/* Capsule tracks */}
      <div className="flex items-end justify-start gap-1.5 sm:gap-2">
        {days.map((day, index) => {
          const isSelected = active.key === day.key;
          const percent = capsulePercent(day.minutes, maxMinutes);
          const delay = index * STAGGER_STEP;

          return (
            <motion.button
              key={day.key}
              type="button"
              onClick={() => setSelectedKey(day.key)}
              {...pressable}
              aria-pressed={isSelected}
              aria-label={`${day.isToday ? "امروز، " : ""}${day.weekday} ${day.dateLabel}: ${formatPersianNumber(day.minutes)} دقیقه در ${formatPersianNumber(day.sessions)} جلسه`}
              className="ring-focus group relative flex max-w-16 flex-1 flex-col items-center gap-1.5 rounded-xl focus-visible:outline-none"
            >
              <span
                aria-hidden
                className="pointer-events-none absolute -top-1 z-10 rounded-full border border-border bg-card px-2 py-0.5 text-[10px] font-semibold tabular-nums text-foreground opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100"
              >
                {formatPersianNumber(day.minutes)}
              </span>

              <svg
                viewBox={`0 0 ${VIEW.width} ${VIEW.height}`}
                className="h-auto w-7 sm:w-8"
                aria-hidden
                focusable="false"
              >
                <defs>
                  <linearGradient
                    id={`${gradientId}-${index}`}
                    gradientUnits="userSpaceOnUse"
                    x1="16"
                    y1={TRACK_TOP}
                    x2="16"
                    y2={TRACK_BOTTOM}
                  >
                    <stop offset="0%" stopColor="var(--color-blush)" />
                    <stop offset="100%" stopColor="var(--color-blush)" stopOpacity="0.78" />
                  </linearGradient>
                </defs>

                {isSelected ? (
                  <line
                    x1="16"
                    y1={TRACK_TOP}
                    x2="16"
                    y2={TRACK_BOTTOM}
                    stroke="var(--color-blush)"
                    strokeOpacity="0.22"
                    strokeWidth={HALO_STROKE}
                    strokeLinecap="round"
                  />
                ) : null}

                <line
                  x1="16"
                  y1={TRACK_TOP}
                  x2="16"
                  y2={TRACK_BOTTOM}
                  stroke="var(--color-muted)"
                  strokeWidth={STROKE}
                  strokeLinecap="round"
                />

                <motion.line
                  x1="16"
                  y1={TRACK_TOP}
                  x2="16"
                  y2={TRACK_BOTTOM}
                  stroke={`url(#${gradientId}-${index})`}
                  strokeWidth={STROKE}
                  strokeLinecap="round"
                  strokeDasharray={TRACK_LENGTH}
                  initial={{ strokeDashoffset: TRACK_LENGTH }}
                  animate={{ strokeDashoffset: TRACK_LENGTH * (1 - percent / 100) }}
                  transition={
                    reduced
                      ? { duration: 0 }
                      : { ...tween(DURATION.slow, EASE_OUT), delay }
                  }
                  className="transition-opacity duration-200"
                />

                {day.isToday ? (
                  <motion.circle
                    cx="16"
                    cy={TRACK_TOP}
                    r="4.5"
                    fill="var(--color-card)"
                    initial={reduced ? { r: 4.5, opacity: 1 } : { r: 0, opacity: 0 }}
                    animate={{ r: 4.5, opacity: 1 }}
                    transition={
                      reduced
                        ? { duration: 0 }
                        : { ...springSnappy, delay: delay + DURATION.slow }
                    }
                  />
                ) : null}
              </svg>

              <span
                className={cn(
                  "text-[10px] font-medium transition-colors",
                  isSelected ? "font-bold text-blush" : "text-muted-foreground"
                )}
              >
                {day.short}
              </span>
              <span
                className={cn(
                  "text-[10px] tabular-nums",
                  isSelected ? "text-blush" : "text-muted-foreground/70"
                )}
              >
                {day.dayOfMonth}
              </span>
            </motion.button>
          );
        })}
      </div>

      {/* Window summary */}
      <div className="flex items-center justify-between border-t border-border pt-3 text-[11px] text-muted-foreground">
        <span>
          مجموع: {formatPersianNumber(totalSessions)} جلسه · {formatPersianNumber(totalMinutes)} دقیقه
        </span>
        <span>بیشترین: {formatPersianNumber(maxMinutes)} دقیقه</span>
      </div>
    </div>
  );
}
