import "server-only";
import { and, eq } from "drizzle-orm";
import type { NeonHttpDatabase } from "drizzle-orm/neon-http";
import * as schema from "@/db/schema";
import { accessGrants, contacts } from "@/db/schema";
import type { CommunityProvider } from "@/integrations/circle/types";

type Database = NeonHttpDatabase<typeof schema>;

export interface ReconciliationFinding {
  /** Absent for "extra" findings — an unexpected Circle member has no matching internal contact record to link back to. */
  contactId?: string;
  email: string;
  /** Absent for "extra" findings, for the same reason as contactId. */
  accessGrantId?: string;
  spaceGroupId: string;
  /** "missing" = we expect access but Circle doesn't have it. "extra" = Circle has access we no longer expect (e.g. after revoke). */
  kind: "missing" | "extra";
}

export interface ReconciliationReport {
  checked: number;
  findings: ReconciliationFinding[];
}

/**
 * Compares expected internal access (accessGrants with status "active") for
 * one space group against Circle's actual membership state, without ever
 * mutating anything itself — this only reports discrepancies for a human
 * or a separate remediation job to act on. See Step 7's "Add a
 * reconciliation function comparing expected internal access with Circle."
 */
export async function reconcileSpaceGroupAccess(
  db: Database,
  provider: CommunityProvider,
  spaceGroupId: string,
): Promise<ReconciliationReport> {
  const activeGrants = await db
    .select({
      accessGrantId: accessGrants.id,
      contactId: accessGrants.contactId,
      email: contacts.email,
    })
    .from(accessGrants)
    .innerJoin(contacts, eq(accessGrants.contactId, contacts.id))
    .where(and(eq(accessGrants.circleSpaceGroupId, spaceGroupId), eq(accessGrants.status, "active")));

  const findings: ReconciliationFinding[] = [];
  const expectedEmails = new Set(activeGrants.map((g) => g.email));

  for (const grant of activeGrants) {
    const member = await provider.findMemberByEmail(grant.email);

    if (!member) {
      findings.push({
        contactId: grant.contactId,
        email: grant.email,
        accessGrantId: grant.accessGrantId,
        spaceGroupId,
        kind: "missing",
      });
      continue;
    }

    const inspection = await provider.inspectAccess({ memberId: member.id, spaceGroupId });
    if (!inspection.hasAccess) {
      findings.push({
        contactId: grant.contactId,
        email: grant.email,
        accessGrantId: grant.accessGrantId,
        spaceGroupId,
        kind: "missing",
      });
    }

    await db
      .update(accessGrants)
      .set({ lastReconciledAt: new Date() })
      .where(eq(accessGrants.id, grant.accessGrantId));
  }

  // Anyone Circle says has access but we have no active grant for is
  // "extra" — access that outlived (or never had) an internal record.
  const actualMembers = await provider.listSpaceGroupMembers(spaceGroupId);
  for (const member of actualMembers) {
    if (!expectedEmails.has(member.email)) {
      findings.push({ email: member.email, spaceGroupId, kind: "extra" });
    }
  }

  return { checked: activeGrants.length, findings };
}
