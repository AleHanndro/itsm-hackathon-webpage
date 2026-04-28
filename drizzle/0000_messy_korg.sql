CREATE TYPE "public"."request_status" AS ENUM('pendiente', 'verificado', 'rechazado', 'reclamado');--> statement-breakpoint
CREATE TYPE "public"."shirt_sizes" AS ENUM('ECH', 'CH', 'M', 'G', 'EG', '2EG', '3EG', '4EG');--> statement-breakpoint
CREATE TABLE "accounts" (
	"access_token" text,
	"access_token_expires_at" timestamp (6) with time zone,
	"account_id" text NOT NULL,
	"id" text PRIMARY KEY NOT NULL,
	"id_token" text,
	"password" text,
	"provider_id" text NOT NULL,
	"refresh_token" text,
	"refresh_token_expires_at" timestamp (6) with time zone,
	"scope" text,
	"user_id" text NOT NULL,
	"created_at" timestamp (6) with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp (6) with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sessions" (
	"expires_at" timestamp (6) with time zone NOT NULL,
	"id" text PRIMARY KEY NOT NULL,
	"ip_address" text,
	"token" text NOT NULL,
	"user_agent" text,
	"user_id" text NOT NULL,
	"created_at" timestamp (6) with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp (6) with time zone NOT NULL,
	CONSTRAINT "sessions_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"email" text NOT NULL,
	"email_verified" boolean DEFAULT false NOT NULL,
	"id" text PRIMARY KEY NOT NULL,
	"image" text,
	"name" text NOT NULL,
	"created_at" timestamp (6) with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp (6) with time zone NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "verifications" (
	"expires_at" timestamp (6) with time zone NOT NULL,
	"id" text PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"created_at" timestamp (6) with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp (6) with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "pre_registrations" (
	"email" text NOT NULL,
	"engineering" text NOT NULL,
	"gender" text NOT NULL,
	"group" text NOT NULL,
	"id" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "pre_registrations_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1),
	"name" text NOT NULL,
	"semester" integer NOT NULL,
	"shirt_size" "shirt_sizes" NOT NULL,
	"status" "request_status" DEFAULT 'pendiente' NOT NULL,
	"student_id" text NOT NULL,
	"verified_at" timestamp (6) with time zone,
	"verified_by" text,
	"wants_announcements" boolean NOT NULL,
	"created_at" timestamp (6) with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp (6) with time zone NOT NULL,
	CONSTRAINT "pre_registrations_email_unique" UNIQUE("email"),
	CONSTRAINT "pre_registrations_student_id_unique" UNIQUE("student_id"),
	CONSTRAINT "semester_check" CHECK ("pre_registrations"."semester" >= 1 AND "pre_registrations"."semester" <= 12)
);
--> statement-breakpoint
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pre_registrations" ADD CONSTRAINT "pre_registrations_verified_by_users_id_fk" FOREIGN KEY ("verified_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "account_userId_idx" ON "accounts" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "session_userId_idx" ON "sessions" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "verification_identifier_idx" ON "verifications" USING btree ("identifier");