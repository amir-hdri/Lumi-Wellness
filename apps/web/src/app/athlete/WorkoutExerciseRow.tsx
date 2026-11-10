"use client";

import React from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import type { ProgramExercise } from "@/lib/types";
import { cn, formatPersianNumber } from "@/lib/utils";

interface WorkoutExerciseRowProps {
  exercise: ProgramExercise;
  checked: boolean;
  disabled?: boolean;
  onCheckedChange: (checked: boolean) => void;
}

export function WorkoutExerciseRow({ exercise, checked, disabled = false, onCheckedChange }: WorkoutExerciseRowProps) {
  const exerciseName = exercise.exercise?.name || exercise.exerciseId;

  return (
    <motion.label
      tabIndex={-1}
      layout
      transition={{ type: "spring", stiffness: 500, damping: 35 }}
      className={cn(
        "group flex cursor-pointer items-start gap-3 rounded-2xl border p-4 transition-colors sm:p-5",
        checked
          ? "border-blush/20 bg-card"
          : "border-border bg-card hover:border-primary/30",
        disabled && "cursor-default"
      )}
      whileTap={{ scale: 0.995 }}
    >
      <input
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={(event) => onCheckedChange(event.target.checked)}
        className="peer sr-only"
        aria-label={`علامت‌گذاری ${exerciseName} به‌عنوان انجام‌شده`}
      />
      <span
        aria-hidden="true"
        className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border border-input text-blush-foreground ring-offset-background peer-focus-visible:ring-2 peer-focus-visible:ring-ring peer-focus-visible:ring-offset-2 peer-checked:border-blush-solid peer-checked:bg-blush-solid"
      >
        {checked && <Check className="h-4 w-4" strokeWidth={1.75} />}
      </span>
      <div className="min-w-0 flex-1">
        <p className="break-words text-base font-medium leading-7 text-foreground">
          {exerciseName}
        </p>
        <div className="mt-3 grid grid-cols-3 gap-2 border-t border-border pt-3 text-xs text-muted-foreground">
          <div className="min-w-0">
            <span className="block">ست و تکرار</span>
            <span className="mt-1 block break-words text-sm text-foreground">
              {formatPersianNumber(exercise.sets)} × <bdi>{exercise.reps}</bdi>
            </span>
          </div>
          <div className="min-w-0">
            <span className="block">وزنه</span>
            <span className="mt-1 block text-sm text-foreground">
              {exercise.weight ? `${formatPersianNumber(exercise.weight)} کیلو` : "بدون وزنه"}
            </span>
          </div>
          <div className="min-w-0">
            <span className="block">استراحت</span>
            <span className="mt-1 block text-sm text-foreground">
              {formatPersianNumber(exercise.restSeconds)} ثانیه
            </span>
          </div>
        </div>
      </div>
    </motion.label>
  );
}
