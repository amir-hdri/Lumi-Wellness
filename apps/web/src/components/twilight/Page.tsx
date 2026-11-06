"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { DURATION, EASE_OUT, useReducedMotion } from "@/lib/motion";

/**
 * Twilight Meditation page primitives — exact port of the reference screen
 * wrapper patterns (Gym*Screen.tsx):
 * - PageShell: motion.div initial{opacity:0,y:10} → animate{opacity:1,y:0},
 *   0.35s, ease [0.16,1,0.3,1], "flex flex-col gap-6 pb-6 select-none"
 * - PageHeader / SectionTitle / MicroLabel / MicroLabelFa live in ./Type
 *   (motion-free, safe for the landing critical path) and are re-exported
 *   here so existing portal imports keep working.
 */

export { PageHeader, SectionTitle, MicroLabel, MicroLabelFa } from "./Type";

export function PageShell({ children, className }: { children: ReactNode; className?: string }) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      initial={reduced ? false : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: reduced ? 0 : DURATION.page, ease: EASE_OUT }}
      className={cn("flex min-w-0 flex-col gap-6 pb-6 text-foreground", className)}
    >
      {children}
    </motion.div>
  );
}
