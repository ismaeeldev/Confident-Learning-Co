import "server-only";
import { eq } from "drizzle-orm";
import type { NeonHttpDatabase } from "drizzle-orm/neon-http";
import * as schema from "@/db/schema";
import { contacts, formSubmissions } from "@/db/schema";
import { MEMBERSHIP_JOIN_CONSENT_VERSION } from "@/config/canon";
import type { MembershipJoinConsentInput } from "./membershipJoinSchemas";

type Database = NeonHttpDatabase<typeof schema>;

/**
 * Records the membership join consent ticks and identity fields (Build
 * Addendum A v2.2, R1/R2) before the browser is handed off to Circle's own
 * paywall checkout. The `formSubmissions` row is the permanent,
 * never-overwritten audit record (R1: "exportable as a list showing member
 * name, date, and wording version accepted"); `contacts` is additionally
 * updated with the current identity fields so the live member profile
 * stays populated — but the audit trail always lives in formSubmissions,
 * not by inferring it from the current contacts row.
 */
export async function recordMembershipJoinConsent(
  db: Database,
  contactId: string,
  email: string,
  input: MembershipJoinConsentInput,
): Promise<void> {
  const consentAt = new Date();

  await db.insert(formSubmissions).values({
    kind: "membership_join_consent",
    email,
    firstName: input.fullLegalName,
    payload: {
      contactId,
      fullLegalName: input.fullLegalName,
      postalAddress: input.postalAddress,
      telephoneNumber: input.telephoneNumber,
      ageConfirmed: input.ageConfirmed,
      rulesAndPrivacyAgreed: input.rulesAndPrivacyAgreed,
      immediateAccessWaiver: input.immediateAccessWaiver,
    },
    consentTextVersion: MEMBERSHIP_JOIN_CONSENT_VERSION,
    consentAt,
    status: "received",
  });

  await db
    .update(contacts)
    .set({
      fullLegalName: input.fullLegalName,
      postalAddress: input.postalAddress,
      telephoneNumber: input.telephoneNumber,
      ageConfirmedAt: consentAt,
      updatedAt: consentAt,
    })
    .where(eq(contacts.id, contactId));
}
