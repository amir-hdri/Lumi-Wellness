import { render, screen } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import { AnimatedCounter } from "./AnimatedCounter";

afterEach(() => vi.unstubAllGlobals());

it("shows the real value immediately when reduced motion is requested", () => {
  vi.stubGlobal("matchMedia", () => ({ matches: true, addEventListener: vi.fn(), removeEventListener: vi.fn() }));
  render(<AnimatedCounter value={125} suffix=" جلسه" />);
  expect(screen.getByText("۱۲۵ جلسه")).toBeVisible();
});
