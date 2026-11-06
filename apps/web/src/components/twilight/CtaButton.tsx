"use client";

import { type ButtonHTMLAttributes } from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils";

export type CtaProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "onDrag" | "onDragStart" | "onDragEnd" | "onAnimationStart" | "onAnimationEnd"
> & {
  variant?: "cream" | "orange" | "ghost" | "outline";
  asChild?: boolean;
};

/**
 * CTA: cream `bg-primary text-primary-foreground hover:bg-primary rounded-xl`;
 * orange (promo) `bg-cta hover:bg-cta text-logo-ink-inverse` (reference
 * RemixModal/ShowcaseHeader); ghost/outline for secondary actions.
 *
 * Press feedback is pure CSS (`hover:scale` / `active:scale`, transform-only
 * so it never triggers layout). This module deliberately imports no animation
 * runtime: it sits on the landing page's critical path, where every kilobyte
 * of JS lands directly on LCP/TBT. `motion-reduce` keeps it still for users
 * who asked for reduced motion (the framer-motion version had no such guard).
 */
export function CtaButton({ variant = "cream", className, children, asChild = false, ...rest }: CtaProps) {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp
      type={asChild ? undefined : "button"}
      className={cn(
        "ring-focus flex min-h-11 min-w-11 w-full cursor-pointer items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold leading-5 shadow-sm transition-[color,background-color,border-color,transform] duration-150 ease-out hover:brightness-95 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 motion-reduce:transform-none",
        variant === "cream" && "bg-primary-solid text-primary-foreground hover:bg-primary-solid/90",
        variant === "orange" && "bg-cta text-cta-foreground hover:bg-cta/90",
        variant === "ghost" && "bg-card text-foreground shadow-none hover:bg-secondary",
        variant === "outline" &&
          "border border-primary/50 bg-card text-primary shadow-none hover:bg-secondary",
        className
      )}
      {...rest}
    >
      {children}
    </Comp>
  );
}
