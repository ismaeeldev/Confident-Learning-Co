/**
 * Bug fix (full-codebase review): every contact-email lookup/insert in
 * this codebase previously compared raw, un-normalized strings against a
 * plain (case-sensitive) unique column. `Jane@Example.com` and
 * `jane@example.com` were treated as two different people — silently
 * creating a duplicate contact, splitting that person's purchases/access
 * grants/consent trail across two rows, and in the login-link flow,
 * potentially preventing a paying customer signing in at all if their
 * purchase and their login attempt happened to resolve to different
 * casings. Used everywhere an email is looked up or written against
 * `contacts.email`, so the same address always resolves to the same row.
 */
export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}
