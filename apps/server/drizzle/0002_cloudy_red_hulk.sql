ALTER TABLE "purchases" ADD COLUMN "refunded" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "purchases" ADD COLUMN "refund_date" timestamp;