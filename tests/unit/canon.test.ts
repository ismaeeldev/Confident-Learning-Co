import { describe, expect, it } from "vitest";
import {
  ARCHETYPE_KEYS,
  ARCHETYPE_PUBLIC_NAMES,
  CHILD_BANDS,
  CHILD_BAND_LABELS,
  KIT_TAGS,
  PERMANENT_KIT_TAGS,
} from "@/config/canon";

describe("canonical child bands", () => {
  it("has exactly the four approved values", () => {
    expect(CHILD_BANDS).toEqual(["early", "middle", "lower-secondary", "exam-years"]);
  });

  it("has a label for every band", () => {
    for (const band of CHILD_BANDS) {
      expect(CHILD_BAND_LABELS[band]).toBeTruthy();
    }
  });
});

describe("canonical archetypes", () => {
  it("has exactly five archetypes including the safety branch", () => {
    expect(ARCHETYPE_KEYS).toHaveLength(5);
    expect(ARCHETYPE_KEYS).toContain("archetype-settle-before-start");
  });

  it("never gives Settle Before Start a public pattern name", () => {
    expect(ARCHETYPE_PUBLIC_NAMES["archetype-settle-before-start"]).toBeNull();
  });

  it("gives every non-safety archetype a public name", () => {
    const nonSafety = ARCHETYPE_KEYS.filter((key) => key !== "archetype-settle-before-start");
    for (const key of nonSafety) {
      expect(ARCHETYPE_PUBLIC_NAMES[key]).not.toBeNull();
    }
  });
});

describe("kit tags", () => {
  it("marks client-guide as permanent", () => {
    expect(PERMANENT_KIT_TAGS).toContain(KIT_TAGS.clientGuide);
  });
});
