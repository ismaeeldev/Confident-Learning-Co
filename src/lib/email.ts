import "server-only";
import { env } from "@/lib/env";
import { logger } from "@/lib/logger";

export interface AdminNotificationEmail {
  subject: string;
  text: string;
}

/**
 * Sends a one-off internal notification email (currently just the Reset
 * enquiry notification — Kit only sends the pre-built marketing
 * sequences, not arbitrary admin alerts). Uses Resend's REST API directly
 * rather than installing their SDK, matching the plain-fetch pattern used
 * for Kit/Circle.
 *
 * Safely no-ops (logs only) when RESEND_API_KEY or ADMIN_ALERT_EMAIL
 * aren't configured — per docs/09-SecurityPrivacyCompliance.md and this
 * step's stop condition, no invented delivery address or provider.
 */
export async function sendAdminNotificationEmail(email: AdminNotificationEmail): Promise<void> {
  if (!env.RESEND_API_KEY || !env.ADMIN_ALERT_EMAIL) {
    logger.info("Admin notification email not sent — RESEND_API_KEY/ADMIN_ALERT_EMAIL not configured", {
      provider: "internal",
      action: "email.sendAdminNotification",
      status: email.subject,
    });
    return;
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
    },
    body: JSON.stringify({
      from: env.SUPPORT_EMAIL ?? "notifications@theconfidentlearningco.org",
      to: env.ADMIN_ALERT_EMAIL,
      subject: email.subject,
      text: email.text,
    }),
  });

  if (!response.ok) {
    const bodyText = await response.text().catch(() => "");
    throw new Error(`Resend API request failed with status ${response.status}: ${bodyText.slice(0, 300)}`);
  }
}

export interface TransactionalEmail {
  to: string;
  subject: string;
  text: string;
}

/**
 * Sends a one-off transactional email to a parent (currently just the
 * magic-link sign-in email, Phase 3). Distinct from
 * sendAdminNotificationEmail, which always sends to the fixed internal
 * ADMIN_ALERT_EMAIL address — this sends to an arbitrary recipient.
 *
 * Safely no-ops (logs only) when RESEND_API_KEY isn't configured, same
 * stance as the admin notification: no invented delivery mechanism. This
 * means the login link is generated and valid, but the parent will not
 * actually receive an email, until Resend is configured.
 */
export async function sendTransactionalEmail(email: TransactionalEmail): Promise<void> {
  if (!env.RESEND_API_KEY) {
    logger.info("Transactional email not sent — RESEND_API_KEY not configured", {
      provider: "internal",
      action: "email.sendTransactional",
      status: email.subject,
    });
    return;
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
    },
    body: JSON.stringify({
      from: env.SUPPORT_EMAIL ?? "notifications@theconfidentlearningco.org",
      to: email.to,
      subject: email.subject,
      text: email.text,
    }),
  });

  if (!response.ok) {
    const bodyText = await response.text().catch(() => "");
    throw new Error(`Resend API request failed with status ${response.status}: ${bodyText.slice(0, 300)}`);
  }
}
