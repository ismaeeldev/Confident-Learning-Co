import "server-only";
import { eq } from "drizzle-orm";
import type { NeonHttpDatabase } from "drizzle-orm/neon-http";
import * as schema from "@/db/schema";
import { purchases, contacts } from "@/db/schema";
import { sendTransactionalEmail } from "@/lib/email";
import { logger } from "@/lib/logger";

type Database = NeonHttpDatabase<typeof schema>;

export interface PathwayCheckoutCompletedInput {
  stripeCheckoutSessionId: string;
  stripePaymentIntentId: string | null;
  stripeCustomerId: string | null;
  stripeProductId: string;
  stripePriceId: string;
  amountTotal: number;
  currency: string;
  paymentStatus: string;
  /** The signed-in member's contactId, set in Checkout Session metadata by /api/checkout/pathway — the booking flow is always gated (Phase 11), never a guest checkout, so contactId is already known server-side rather than resolved from email (R3). */
  contactId: string | undefined;
}

export type ProcessPathwayCheckoutResult =
  | { outcome: "missing_contact_id" }
  | { outcome: "duplicate_purchase"; purchaseId: string }
  | { outcome: "pending_async_payment"; purchaseId: string }
  | { outcome: "completed"; purchaseId: string };

/**
 * Handles `checkout.session.completed` for a Pathway call booking (Phase
 * 11, Annexe A route 3/4). Unlike the Guide, this is never a guest
 * checkout — the booking page (/pathway/book) is gated on an active
 * signed-in member, so the buyer's contactId travels in Checkout Session
 * metadata rather than being resolved from the email Stripe collects.
 * Draft confirmation email — the client hasn't supplied exact wording for
 * this one (unlike the Guide's client-supplied copy), flag before launch.
 */
export async function processPathwayCheckoutCompleted(
  db: Database,
  input: PathwayCheckoutCompletedInput,
): Promise<ProcessPathwayCheckoutResult> {
  if (!input.contactId) {
    logger.error("Pathway checkout.session.completed had no contactId in metadata", {
      provider: "stripe",
      action: "processPathwayCheckoutCompleted",
    });
    return { outcome: "missing_contact_id" };
  }

  const [existingPurchase] = await db
    .select({ id: purchases.id })
    .from(purchases)
    .where(eq(purchases.stripeCheckoutSessionId, input.stripeCheckoutSessionId))
    .limit(1);

  if (existingPurchase) {
    return { outcome: "duplicate_purchase", purchaseId: existingPurchase.id };
  }

  const isPaid = input.paymentStatus === "paid";

  const [purchase] = await db
    .insert(purchases)
    .values({
      contactId: input.contactId,
      kind: "pathway",
      status: isPaid ? "paid" : "pending",
      stripeCheckoutSessionId: input.stripeCheckoutSessionId,
      stripePaymentIntentId: input.stripePaymentIntentId,
      stripeCustomerId: input.stripeCustomerId,
      stripeProductId: input.stripeProductId,
      stripePriceId: input.stripePriceId,
      amountTotal: input.amountTotal,
      currency: input.currency,
      paidAt: isPaid ? new Date() : null,
    })
    .returning({ id: purchases.id });

  if (!purchase) throw new Error("Failed to insert pathway purchase row");

  if (!isPaid) {
    return { outcome: "pending_async_payment", purchaseId: purchase.id };
  }

  const [contact] = await db
    .select({ email: contacts.email })
    .from(contacts)
    .where(eq(contacts.id, input.contactId))
    .limit(1);

  if (contact?.email) {
    await sendTransactionalEmail({
      to: contact.email,
      subject: "Your Pathway call is booked",
      text: `Thanks for booking your Pathway call.

Jane, our Pathway Coordinator, will be in touch within three working days to arrange a time.

If anything changes before then, just reply to this email.`,
    }).catch((error) => {
      logger.error("Failed to send the Pathway booking confirmation email", {
        provider: "internal",
        action: "processPathwayCheckoutCompleted.confirmationEmail",
        safeErrorMessage: error instanceof Error ? error.message : "unknown error",
      });
    });
  }

  return { outcome: "completed", purchaseId: purchase.id };
}
