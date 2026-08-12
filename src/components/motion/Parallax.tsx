"use client";

import { useRef } from "react";
import type { ReactNode } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "motion/react";

interface ParallaxProps {
  children: ReactNode;
  className?: string;
  /** Max vertical travel in px across the element's scroll range. Kept subtle by design. */
  range?: number;
}

/**
 * Very restrained scroll-linked parallax (a handful of px of travel) for a
 * single editorial image. Disabled entirely for reduced motion, per
 * docs/03-ThemeGuideline.md 3.14 ("Image parallax under 4%... disabled for
 * reduced motion").
 */
export function Parallax({ children, className, range = 18 }: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [-range, range]);

  if (prefersReducedMotion) {
    return (
      <div ref={ref} className={className}>
        {children}
      </div>
    );
  }

  return (
    <motion.div ref={ref} className={className} style={{ y }}>
      {children}
    </motion.div>
  );
}
