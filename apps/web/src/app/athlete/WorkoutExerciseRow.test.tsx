import React, { useState } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import type { ProgramExercise } from "@/lib/types";
import { WorkoutExerciseRow } from "./WorkoutExerciseRow";

const exercise: ProgramExercise = {
  id: "exercise-1",
  programId: "program-1",
  exerciseId: "bench-press",
  exercise: {
    id: "bench-press",
    name: "پرس سینه",
    category: "strength",
    muscleGroup: "chest",
    difficulty: "intermediate",
    equipment: "barbell",
    instructions: "روی نیمکت پرس سینه را انجام دهید.",
    isActive: true,
    createdAt: "2026-01-01T00:00:00Z",
    updatedAt: "2026-01-01T00:00:00Z",
  },
  dayOfWeek: 0,
  order: 1,
  sets: 3,
  reps: "10",
  restSeconds: 60,
  isCompleted: false,
};

function ControlledRow({ onChange, disabled = false }: { onChange: (checked: boolean) => void; disabled?: boolean }) {
  const [checked, setChecked] = useState(false);

  return (
    <WorkoutExerciseRow
      exercise={exercise}
      checked={checked}
      disabled={disabled}
      onCheckedChange={(nextChecked) => {
        setChecked(nextChecked);
        onChange(nextChecked);
      }}
    />
  );
}

describe("WorkoutExerciseRow", () => {
  it("changes once when the row text is clicked", async () => {
    const onChange = vi.fn();
    render(<ControlledRow onChange={onChange} />);

    await userEvent.click(screen.getByText("پرس سینه"));

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenLastCalledWith(true);
    expect(screen.getByRole("checkbox")).toBeChecked();
  });

  it("changes once when the checkbox is clicked", async () => {
    const onChange = vi.fn();
    render(<ControlledRow onChange={onChange} />);

    await userEvent.click(screen.getByRole("checkbox"));

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenLastCalledWith(true);
  });

  it("keeps the exercise unchanged while saving", async () => {
    const onChange = vi.fn();
    render(<ControlledRow onChange={onChange} disabled />);

    await userEvent.click(screen.getByText("پرس سینه"));

    expect(screen.getByRole("checkbox")).toBeDisabled();
    expect(screen.getByRole("checkbox")).not.toBeChecked();
    expect(onChange).not.toHaveBeenCalled();
  });

  it("marks and unmarks the exercise with the keyboard", async () => {
    render(<ControlledRow onChange={() => {}} />);

    await userEvent.tab();
    expect(screen.getByRole("checkbox")).toHaveFocus();
    await userEvent.keyboard(" ");
    expect(screen.getByRole("checkbox")).toBeChecked();
    await userEvent.keyboard(" ");
    expect(screen.getByRole("checkbox")).not.toBeChecked();
  });
});
