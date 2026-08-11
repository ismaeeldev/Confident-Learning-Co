/** Motion system tokens. See docs/03-ThemeGuideline.md section 3.14. */
export const motionTokens = {
  duration: {
    instant: 0.12,
    fast: 0.2,
    base: 0.35,
    slow: 0.6,
    editorial: 0.9,
  },
  ease: {
    standard: [0.22, 1, 0.36, 1],
    enter: [0.16, 1, 0.3, 1],
    exit: [0.4, 0, 1, 1],
  },
} as const;

/** Standard 12-24px reveal used for text/image entrances. Respects reduced motion via useReveal. */
export const revealTransition = {
  duration: motionTokens.duration.base,
  ease: motionTokens.ease.enter,
};
