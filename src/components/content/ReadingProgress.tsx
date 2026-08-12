"use client";

import { useEffect, useRef } from "react";

/** Slim reading-progress bar tracking scroll depth through the element with `targetId`. */
export function ReadingProgress({ targetId }: { targetId: string }) {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const target = document.getElementById(targetId);
    if (!target) return;

    let frame = 0;

    function update() {
      if (!target || !barRef.current) return;
      const rect = target.getBoundingClientRect();
      const viewport = window.innerHeight;
      const total = rect.height - viewport;
      const scrolled = total > 0 ? (viewport - rect.top) / (total + viewport) : 0;
      const progress = Math.min(1, Math.max(0, scrolled));
      barRef.current.style.transform = `scaleX(${progress})`;
    }

    function onScroll() {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(update);
    }

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [targetId]);

  return (
    <div
      aria-hidden="true"
      className="bg-border/60 sticky top-16 z-30 h-[3px] w-full sm:top-20"
    >
      <div
        ref={barRef}
        className="bg-brand-gold-500 h-full w-full origin-left motion-safe:transition-transform motion-safe:duration-150 motion-safe:ease-out"
        style={{ transform: "scaleX(0)" }}
      />
    </div>
  );
}
