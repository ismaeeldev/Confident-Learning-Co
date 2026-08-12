"use client";

import { useEffect, useRef } from "react";

/**
 * Slim scroll-progress bar tracking depth through the whole page (as opposed to
 * `ReadingProgress`, which tracks a single article body). Sticky under the
 * header, same visual language: thin gold fill on a warm neutral track.
 */
export function ScrollProgress() {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let frame = 0;

    function update() {
      if (!barRef.current) return;
      const doc = document.documentElement;
      const total = doc.scrollHeight - window.innerHeight;
      const progress = total > 0 ? Math.min(1, Math.max(0, window.scrollY / total)) : 0;
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
  }, []);

  return (
    <div aria-hidden="true" className="bg-border/60 sticky top-16 z-30 h-[3px] w-full sm:top-20">
      <div
        ref={barRef}
        className="bg-brand-gold-500 h-full w-full origin-left motion-safe:transition-transform motion-safe:duration-150 motion-safe:ease-out"
        style={{ transform: "scaleX(0)" }}
      />
    </div>
  );
}
