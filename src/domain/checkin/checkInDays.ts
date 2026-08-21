/**
 * Shared constant/type, deliberately with no "server-only" import, so it
 * can be safely imported from both server code (checkInStatus.ts) and
 * client components (checkInSchema.ts / MemberCheckInForm.tsx) without
 * dragging server-only code into the client bundle.
 */
export const CHECKIN_DAYS = [14, 30] as const;
export type CheckInDay = (typeof CHECKIN_DAYS)[number];
