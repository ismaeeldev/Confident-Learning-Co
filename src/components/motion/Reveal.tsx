"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";
import { revealTransition } from "./tokens";

interface RevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  /** Vertical travel distance in px before reduced-motion collapses it to 0. */
  distance?: number;
}

/**
 * Gentle reveal-on-mount used for text/image entrances (12-24px travel).
 * Animates on mount rather than on scroll intersection: content must be
 * fully present and readable regardless of whether the user ever scrolls
 * to it (docs/03-ThemeGuideline.md 3.14, 3.16). Renders a static final
 * state when the user prefers reduced motion.
 */
export function Reveal({ children, className, delay = 0, distance = 16 }: RevealProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: prefersReducedMotion ? 0 : distance }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ ...revealTransition, delay: prefersReducedMotion ? 0 : delay }}
    >
      {children}
    </motion.div>
  );
}
