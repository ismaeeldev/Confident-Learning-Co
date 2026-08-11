/**
 * Sanitized inventory of the Inside the Loop community structure. No
 * secrets here — the space group id and space names are safe to keep in
 * source control; the API token lives only in environment configuration.
 * See confident-learning-hybrid-build-playbook Circle_and_Website_Build_Pack_v4.docx
 * Part 7 for the source spec this was built from.
 */
export const CIRCLE_SPACE_GROUP_NAME = "Inside the Loop";

/** The 13 spaces, in the exact build order from the spec. */
export const CIRCLE_SPACES = [
  { name: "Start Here", type: "posts" },
  { name: "Monthly Focus", type: "posts" },
  { name: "Ask the Specialists", type: "posts" },
  { name: "Wins of the Week", type: "posts" },
  { name: "Real Talk", type: "posts" },
  { name: "The Secondary Room", type: "posts" },
  { name: "The Confidence Library", type: "posts" },
  { name: "The Welcome Path", type: "course" },
  { name: "The Story Underneath", type: "course" },
  { name: "Settle Before Start", type: "course" },
  { name: "The Toolkit Shelf", type: "posts" },
  { name: "Ready for More", type: "posts" },
  { name: "Inside the Loop Live", type: "events" },
] as const;

/** The four age-band post tags, applied across every posting space. */
export const CIRCLE_AGE_BAND_TAGS = [
  "Years 2 to 4",
  "Years 5 to 6",
  "Years 7 to 9",
  "Years 10 to 11",
] as const;

/** The required member profile field, per docs/02-CanonicalDecisions.md. */
export const CIRCLE_PROFILE_FIELD = {
  name: "Child's school year",
  options: CIRCLE_AGE_BAND_TAGS,
  required: true,
} as const;
