import { describe, expect, it } from "vitest";
import { canRemoveKitTag, assertTagRemovable } from "@/domain/contacts/kitTags";
import { KIT_TAGS } from "@/config/canon";

describe("permanent Guide ownership rule", () => {
  it("never allows client-guide to be removed", () => {
    expect(canRemoveKitTag(KIT_TAGS.clientGuide)).toBe(false);
  });

  it("throws when code attempts to remove client-guide", () => {
    expect(() => assertTagRemovable(KIT_TAGS.clientGuide)).toThrow();
  });

  it("allows temporary tags like il-30day-active to be removed", () => {
    expect(canRemoveKitTag(KIT_TAGS.il30DayActive)).toBe(true);
    expect(() => assertTagRemovable(KIT_TAGS.il30DayActive)).not.toThrow();
  });
});
