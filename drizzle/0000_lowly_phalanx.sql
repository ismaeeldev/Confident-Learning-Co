CREATE TYPE "public"."access_grant_kind" AS ENUM('included_30_day', 'paid_membership', 'manual_admin');--> statement-breakpoint
CREATE TYPE "public"."access_grant_status" AS ENUM('pending', 'active', 'expired', 'revoked', 'failed');--> statement-breakpoint
CREATE TYPE "public"."audit_actor_type" AS ENUM('system', 'admin', 'provider');--> statement-breakpoint
CREATE TYPE "public"."child_band" AS ENUM('early', 'middle', 'lower-secondary', 'exam-years');--> statement-breakpoint
CREATE TYPE "public"."form_submission_kind" AS ENUM('newsletter', 'reset_enquiry');--> statement-breakpoint
CREATE TYPE "public"."form_submission_status" AS ENUM('received', 'synced', 'notified', 'failed', 'spam');--> statement-breakpoint
CREATE TYPE "public"."integration_job_provider" AS ENUM('circle', 'kit', 'stripe', 'scoreapp', 'internal');--> statement-breakpoint
CREATE TYPE "public"."integration_job_status" AS ENUM('queued', 'running', 'succeeded', 'retrying', 'dead', 'cancelled');--> statement-breakpoint
CREATE TYPE "public"."purchase_kind" AS ENUM('guide', 'pack_homework', 'pack_conversations', 'pack_parents_evening', 'pathway', 'group', 'confidence_reset', 'calm_reset');--> statement-breakpoint
CREATE TYPE "public"."purchase_status" AS ENUM('pending', 'paid', 'refunded', 'partially_refunded', 'disputed', 'cancelled');--> statement-breakpoint
CREATE TYPE "public"."signed_link_kind" AS ENUM('continuation', 'reentry');--> statement-breakpoint
CREATE TYPE "public"."subscription_status" AS ENUM('incomplete', 'trialing', 'active', 'past_due', 'unpaid', 'paused', 'canceled');--> statement-breakpoint
CREATE TYPE "public"."webhook_provider" AS ENUM('stripe', 'scoreapp', 'circle', 'kit');--> statement-breakpoint
CREATE TYPE "public"."webhook_status" AS ENUM('received', 'processing', 'processed', 'failed', 'ignored');--> statement-breakpoint
CREATE TABLE "access_grants" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"contact_id" uuid NOT NULL,
	"purchase_id" uuid,
	"kind" "access_grant_kind" NOT NULL,
	"status" "access_grant_status" DEFAULT 'pending' NOT NULL,
	"starts_at" timestamp with time zone NOT NULL,
	"expires_at" timestamp with time zone,
	"circle_space_group_id" text NOT NULL,
	"circle_member_id" text,
	"provisioned_at" timestamp with time zone,
	"revoked_at" timestamp with time zone,
	"last_reconciled_at" timestamp with time zone,
	"failure_reason" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "audit_log" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"actor_type" "audit_actor_type" NOT NULL,
	"actor_id" text,
	"action" text NOT NULL,
	"entity_type" text NOT NULL,
	"entity_id" text NOT NULL,
	"before" jsonb,
	"after" jsonb,
	"request_id" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "contacts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"first_name" text,
	"child_first_name" text,
	"child_band" "child_band",
	"marketing_consent" boolean DEFAULT false NOT NULL,
	"marketing_consent_at" timestamp with time zone,
	"kit_subscriber_id" text,
	"circle_member_id" text,
	"scoreapp_lead_id" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "form_submissions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"kind" "form_submission_kind" NOT NULL,
	"email" text NOT NULL,
	"first_name" text,
	"payload" jsonb NOT NULL,
	"consent_text_version" text,
	"consent_at" timestamp with time zone,
	"status" "form_submission_status" DEFAULT 'received' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "integration_jobs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"provider" "integration_job_provider" NOT NULL,
	"action" text NOT NULL,
	"status" "integration_job_status" DEFAULT 'queued' NOT NULL,
	"contact_id" uuid,
	"purchase_id" uuid,
	"access_grant_id" uuid,
	"subscription_id" uuid,
	"input" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"attempts" integer DEFAULT 0 NOT NULL,
	"max_attempts" integer DEFAULT 8 NOT NULL,
	"run_after" timestamp with time zone DEFAULT now() NOT NULL,
	"last_error_code" text,
	"last_error_message" text,
	"completed_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "purchases" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"contact_id" uuid NOT NULL,
	"kind" "purchase_kind" NOT NULL,
	"status" "purchase_status" DEFAULT 'pending' NOT NULL,
	"stripe_checkout_session_id" text,
	"stripe_payment_intent_id" text,
	"stripe_customer_id" text,
	"stripe_product_id" text NOT NULL,
	"stripe_price_id" text NOT NULL,
	"amount_total" integer NOT NULL,
	"currency" text NOT NULL,
	"paid_at" timestamp with time zone,
	"refunded_at" timestamp with time zone,
	"metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "signed_link_uses" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"jti" text NOT NULL,
	"kind" "signed_link_kind" NOT NULL,
	"contact_id" uuid NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"used_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "subscriptions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"contact_id" uuid NOT NULL,
	"stripe_subscription_id" text NOT NULL,
	"stripe_customer_id" text NOT NULL,
	"stripe_price_id" text NOT NULL,
	"status" "subscription_status" NOT NULL,
	"current_period_start" timestamp with time zone,
	"current_period_end" timestamp with time zone,
	"cancel_at_period_end" boolean DEFAULT false NOT NULL,
	"canceled_at" timestamp with time zone,
	"ended_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "webhook_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"provider" "webhook_provider" NOT NULL,
	"provider_event_id" text NOT NULL,
	"event_type" text NOT NULL,
	"payload_hash" text,
	"status" "webhook_status" DEFAULT 'received' NOT NULL,
	"attempts" integer DEFAULT 0 NOT NULL,
	"last_error_code" text,
	"last_error_message" text,
	"received_at" timestamp with time zone DEFAULT now() NOT NULL,
	"processed_at" timestamp with time zone
);
--> statement-breakpoint
ALTER TABLE "access_grants" ADD CONSTRAINT "access_grants_contact_id_contacts_id_fk" FOREIGN KEY ("contact_id") REFERENCES "public"."contacts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "access_grants" ADD CONSTRAINT "access_grants_purchase_id_purchases_id_fk" FOREIGN KEY ("purchase_id") REFERENCES "public"."purchases"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "purchases" ADD CONSTRAINT "purchases_contact_id_contacts_id_fk" FOREIGN KEY ("contact_id") REFERENCES "public"."contacts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "signed_link_uses" ADD CONSTRAINT "signed_link_uses_contact_id_contacts_id_fk" FOREIGN KEY ("contact_id") REFERENCES "public"."contacts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_contact_id_contacts_id_fk" FOREIGN KEY ("contact_id") REFERENCES "public"."contacts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "access_grants_status_expires_at_idx" ON "access_grants" USING btree ("status","expires_at");--> statement-breakpoint
CREATE UNIQUE INDEX "contacts_email_key" ON "contacts" USING btree ("email");--> statement-breakpoint
CREATE UNIQUE INDEX "contacts_kit_subscriber_id_key" ON "contacts" USING btree ("kit_subscriber_id");--> statement-breakpoint
CREATE UNIQUE INDEX "contacts_circle_member_id_key" ON "contacts" USING btree ("circle_member_id");--> statement-breakpoint
CREATE UNIQUE INDEX "contacts_scoreapp_lead_id_key" ON "contacts" USING btree ("scoreapp_lead_id");--> statement-breakpoint
CREATE INDEX "form_submissions_kind_created_at_idx" ON "form_submissions" USING btree ("kind","created_at");--> statement-breakpoint
CREATE INDEX "integration_jobs_status_run_after_idx" ON "integration_jobs" USING btree ("status","run_after");--> statement-breakpoint
CREATE UNIQUE INDEX "purchases_stripe_checkout_session_id_key" ON "purchases" USING btree ("stripe_checkout_session_id");--> statement-breakpoint
CREATE UNIQUE INDEX "purchases_stripe_payment_intent_id_key" ON "purchases" USING btree ("stripe_payment_intent_id");--> statement-breakpoint
CREATE INDEX "purchases_contact_kind_status_idx" ON "purchases" USING btree ("contact_id","kind","status");--> statement-breakpoint
CREATE UNIQUE INDEX "signed_link_uses_jti_key" ON "signed_link_uses" USING btree ("jti");--> statement-breakpoint
CREATE UNIQUE INDEX "subscriptions_stripe_subscription_id_key" ON "subscriptions" USING btree ("stripe_subscription_id");--> statement-breakpoint
CREATE INDEX "subscriptions_contact_status_idx" ON "subscriptions" USING btree ("contact_id","status");--> statement-breakpoint
CREATE UNIQUE INDEX "webhook_events_provider_event_id_key" ON "webhook_events" USING btree ("provider","provider_event_id");