import { PERMANENT_KIT_TAGS } from "@/config/canon";

/**
 * Guards the immutable-business-rule that `client-guide` (Guide ownership)
 * is permanent and must never be programmatically removed. See
 * docs/02-CanonicalDecisions.md 2.3 rule 5 and docs/00-ApplicationFlow.md 0.7.
 */
export function canRemoveKitTag(tag: string): boolean {
  return !PERMANENT_KIT_TAGS.includes(tag);
}

/** Throws if code ever attempts to remove a permanent tag such as client-guide. */
export function assertTagRemovable(tag: string): void {
  if (!canRemoveKitTag(tag)) {
    throw new Error(`Refusing to remove permanent Kit tag "${tag}" (Guide ownership is for life)`);
  }
}
