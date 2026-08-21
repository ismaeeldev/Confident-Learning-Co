ALTER TABLE "contacts" ADD COLUMN "full_legal_name" text;--> statement-breakpoint
ALTER TABLE "contacts" ADD COLUMN "postal_address" text;--> statement-breakpoint
ALTER TABLE "contacts" ADD COLUMN "telephone_number" text;--> statement-breakpoint
ALTER TABLE "contacts" ADD COLUMN "age_confirmed_at" timestamp with time zone;