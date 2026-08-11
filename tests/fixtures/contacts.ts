import { randomUUID } from "node:crypto";

/** Synthetic contact fixture. Never derived from real customer data. */
export function buildTestContactEmail(): string {
  return `test-${randomUUID()}@example.invalid`;
}
