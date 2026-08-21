import {
  boolean,
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

export const childBandEnum = pgEnum("child_band", [
  "early",
  "middle",
  "lower-secondary",
  "exam-years",
]);

export const purchaseKindEnum = pgEnum("purchase_kind", [
  "guide",
  "membership",
  "pack_homework",
  "pack_conversations",
  "pack_parents_evening",
  "pathway",
  "group",
  "confidence_reset",
  "calm_reset",
]);

export const purchaseStatusEnum = pgEnum("purchase_status", [
  "pending",
  "paid",
  "refunded",
  "partially_refunded",
  "disputed",
  "cancelled",
]);

export const accessGrantKindEnum = pgEnum("access_grant_kind", [
  "included_30_day",
  "paid_membership",
  "manual_admin",
]);

export const accessGrantStatusEnum = pgEnum("access_grant_status", [
  "pending",
  "active",
  "expired",
  "revoked",
  "failed",
]);

export const subscriptionStatusEnum = pgEnum("subscription_status", [
  "incomplete",
  "trialing",
  "active",
  "past_due",
  "unpaid",
  "paused",
  "canceled",
]);

export const webhookProviderEnum = pgEnum("webhook_provider", [
  "stripe",
  "scoreapp",
  "circle",
  "kit",
]);

export const webhookStatusEnum = pgEnum("webhook_status", [
  "received",
  "processing",
  "processed",
  "failed",
  "ignored",
]);

export const integrationJobProviderEnum = pgEnum("integration_job_provider", [
  "circle",
  "kit",
  "stripe",
  "scoreapp",
  "internal",
]);

export const integrationJobStatusEnum = pgEnum("integration_job_status", [
  "queued",
  "running",
  "succeeded",
  "retrying",
  "dead",
  "cancelled",
]);

export const formSubmissionKindEnum = pgEnum("form_submission_kind", [
  "newsletter",
  "reset_enquiry",
  "login_request",
  "membership_join_consent",
  "purchase_consent",
  "member_checkin",
]);

export const formSubmissionStatusEnum = pgEnum("form_submission_status", [
  "received",
  "synced",
  "notified",
  "failed",
  "spam",
]);

export const auditActorTypeEnum = pgEnum("audit_actor_type", ["system", "admin", "provider"]);

export const signedLinkKindEnum = pgEnum("signed_link_kind", ["continuation", "reentry", "login"]);

const timestamps = {
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
};

export const contacts = pgTable(
  "contacts",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    email: text("email").notNull(),
    firstName: text("first_name"),
    childFirstName: text("child_first_name"),
    childBand: childBandEnum("child_band"),
    marketingConsent: boolean("marketing_consent").notNull().default(false),
    marketingConsentAt: timestamp("marketing_consent_at", { withTimezone: true }),
    /** Membership identity fields (Build Addendum A v2.2, R2) — only populated once a member joins Inside the Loop; null for Guide-only contacts. */
    fullLegalName: text("full_legal_name"),
    postalAddress: text("postal_address"),
    telephoneNumber: text("telephone_number"),
    ageConfirmedAt: timestamp("age_confirmed_at", { withTimezone: true }),
    kitSubscriberId: text("kit_subscriber_id"),
    circleMemberId: text("circle_member_id"),
    scoreAppLeadId: text("scoreapp_lead_id"),
    ...timestamps,
  },
  (table) => [
    uniqueIndex("contacts_email_key").on(table.email),
    uniqueIndex("contacts_kit_subscriber_id_key").on(table.kitSubscriberId),
    uniqueIndex("contacts_circle_member_id_key").on(table.circleMemberId),
    uniqueIndex("contacts_scoreapp_lead_id_key").on(table.scoreAppLeadId),
  ],
);

export const purchases = pgTable(
  "purchases",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    contactId: uuid("contact_id")
      .notNull()
      .references(() => contacts.id),
    kind: purchaseKindEnum("kind").notNull(),
    status: purchaseStatusEnum("status").notNull().default("pending"),
    stripeCheckoutSessionId: text("stripe_checkout_session_id"),
    stripePaymentIntentId: text("stripe_payment_intent_id"),
    stripeCustomerId: text("stripe_customer_id"),
    stripeProductId: text("stripe_product_id").notNull(),
    stripePriceId: text("stripe_price_id").notNull(),
    amountTotal: integer("amount_total").notNull(),
    currency: text("currency").notNull(),
    paidAt: timestamp("paid_at", { withTimezone: true }),
    refundedAt: timestamp("refunded_at", { withTimezone: true }),
    metadata: jsonb("metadata").notNull().default({}),
    ...timestamps,
  },
  (table) => [
    uniqueIndex("purchases_stripe_checkout_session_id_key").on(table.stripeCheckoutSessionId),
    uniqueIndex("purchases_stripe_payment_intent_id_key").on(table.stripePaymentIntentId),
    index("purchases_contact_kind_status_idx").on(table.contactId, table.kind, table.status),
  ],
);

export const accessGrants = pgTable(
  "access_grants",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    contactId: uuid("contact_id")
      .notNull()
      .references(() => contacts.id),
    purchaseId: uuid("purchase_id").references(() => purchases.id),
    kind: accessGrantKindEnum("kind").notNull(),
    status: accessGrantStatusEnum("status").notNull().default("pending"),
    startsAt: timestamp("starts_at", { withTimezone: true }).notNull(),
    expiresAt: timestamp("expires_at", { withTimezone: true }),
    circleSpaceGroupId: text("circle_space_group_id").notNull(),
    circleMemberId: text("circle_member_id"),
    provisionedAt: timestamp("provisioned_at", { withTimezone: true }),
    revokedAt: timestamp("revoked_at", { withTimezone: true }),
    lastReconciledAt: timestamp("last_reconciled_at", { withTimezone: true }),
    failureReason: text("failure_reason"),
    ...timestamps,
  },
  (table) => [index("access_grants_status_expires_at_idx").on(table.status, table.expiresAt)],
);

export const subscriptions = pgTable(
  "subscriptions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    contactId: uuid("contact_id")
      .notNull()
      .references(() => contacts.id),
    stripeSubscriptionId: text("stripe_subscription_id").notNull(),
    stripeCustomerId: text("stripe_customer_id").notNull(),
    stripePriceId: text("stripe_price_id").notNull(),
    status: subscriptionStatusEnum("status").notNull(),
    currentPeriodStart: timestamp("current_period_start", { withTimezone: true }),
    currentPeriodEnd: timestamp("current_period_end", { withTimezone: true }),
    cancelAtPeriodEnd: boolean("cancel_at_period_end").notNull().default(false),
    canceledAt: timestamp("canceled_at", { withTimezone: true }),
    endedAt: timestamp("ended_at", { withTimezone: true }),
    ...timestamps,
  },
  (table) => [
    uniqueIndex("subscriptions_stripe_subscription_id_key").on(table.stripeSubscriptionId),
    index("subscriptions_contact_status_idx").on(table.contactId, table.status),
  ],
);

export const webhookEvents = pgTable(
  "webhook_events",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    provider: webhookProviderEnum("provider").notNull(),
    providerEventId: text("provider_event_id").notNull(),
    eventType: text("event_type").notNull(),
    payloadHash: text("payload_hash"),
    status: webhookStatusEnum("status").notNull().default("received"),
    attempts: integer("attempts").notNull().default(0),
    lastErrorCode: text("last_error_code"),
    lastErrorMessage: text("last_error_message"),
    receivedAt: timestamp("received_at", { withTimezone: true }).notNull().defaultNow(),
    processedAt: timestamp("processed_at", { withTimezone: true }),
  },
  (table) => [
    uniqueIndex("webhook_events_provider_event_id_key").on(
      table.provider,
      table.providerEventId,
    ),
  ],
);

export const integrationJobs = pgTable(
  "integration_jobs",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    provider: integrationJobProviderEnum("provider").notNull(),
    action: text("action").notNull(),
    status: integrationJobStatusEnum("status").notNull().default("queued"),
    contactId: uuid("contact_id"),
    purchaseId: uuid("purchase_id"),
    accessGrantId: uuid("access_grant_id"),
    subscriptionId: uuid("subscription_id"),
    input: jsonb("input").notNull().default({}),
    attempts: integer("attempts").notNull().default(0),
    maxAttempts: integer("max_attempts").notNull().default(8),
    runAfter: timestamp("run_after", { withTimezone: true }).notNull().defaultNow(),
    lastErrorCode: text("last_error_code"),
    lastErrorMessage: text("last_error_message"),
    completedAt: timestamp("completed_at", { withTimezone: true }),
    ...timestamps,
  },
  (table) => [index("integration_jobs_status_run_after_idx").on(table.status, table.runAfter)],
);

export const formSubmissions = pgTable(
  "form_submissions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    kind: formSubmissionKindEnum("kind").notNull(),
    email: text("email").notNull(),
    firstName: text("first_name"),
    payload: jsonb("payload").notNull(),
    consentTextVersion: text("consent_text_version"),
    consentAt: timestamp("consent_at", { withTimezone: true }),
    status: formSubmissionStatusEnum("status").notNull().default("received"),
    ...timestamps,
  },
  (table) => [index("form_submissions_kind_created_at_idx").on(table.kind, table.createdAt)],
);

export const auditLog = pgTable("audit_log", {
  id: uuid("id").primaryKey().defaultRandom(),
  actorType: auditActorTypeEnum("actor_type").notNull(),
  actorId: text("actor_id"),
  action: text("action").notNull(),
  entityType: text("entity_type").notNull(),
  entityId: text("entity_id").notNull(),
  before: jsonb("before"),
  after: jsonb("after"),
  requestId: text("request_id"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const signedLinkUses = pgTable("signed_link_uses", {
  id: uuid("id").primaryKey().defaultRandom(),
  jti: text("jti").notNull(),
  kind: signedLinkKindEnum("kind").notNull(),
  contactId: uuid("contact_id")
    .notNull()
    .references(() => contacts.id),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  usedAt: timestamp("used_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => [uniqueIndex("signed_link_uses_jti_key").on(table.jti)]);
