CREATE TABLE "projects" (
	"description" text,
	"id" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "projects_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1),
	"name" text NOT NULL,
	"created_at" timestamp (6) with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp (6) with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "comments" (
	"author_id" text,
	"content" text NOT NULL,
	"id" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "comments_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1),
	"project_id" bigint NOT NULL,
	"stage_id" bigint NOT NULL,
	"created_at" timestamp (6) with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp (6) with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "stages" (
	"description" text,
	"id" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "stages_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1),
	"name" text NOT NULL,
	"order" integer NOT NULL,
	"created_at" timestamp (6) with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp (6) with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "stages_evaluators" (
	"stage_id" bigint NOT NULL,
	"user_id" text NOT NULL,
	"created_at" timestamp (6) with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp (6) with time zone NOT NULL,
	CONSTRAINT "stages_evaluators_stage_id_user_id_pk" PRIMARY KEY("stage_id","user_id")
);
--> statement-breakpoint
CREATE TABLE "stages_projects" (
	"project_id" bigint NOT NULL,
	"score" integer DEFAULT 0 NOT NULL,
	"stage_id" bigint NOT NULL,
	"created_at" timestamp (6) with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp (6) with time zone NOT NULL,
	CONSTRAINT "stages_projects_project_id_stage_id_pk" PRIMARY KEY("project_id","stage_id"),
	CONSTRAINT "stages_projects_scoreCheck" CHECK (("stages_projects"."score" >= 0) AND ("stages_projects"."score" <= 100))
);
--> statement-breakpoint
CREATE TABLE "teams" (
	"id" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "teams_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1),
	"name" text NOT NULL,
	"project_id" bigint,
	"created_at" timestamp (6) with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp (6) with time zone NOT NULL,
	CONSTRAINT "teams_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "teams_users" (
	"created_at" timestamp (6) with time zone DEFAULT now() NOT NULL,
	"roles" text[] DEFAULT '{}' NOT NULL,
	"team_id" bigint NOT NULL,
	"user_id" text NOT NULL,
	CONSTRAINT "teams_users_team_id_user_id_pk" PRIMARY KEY("team_id","user_id")
);
--> statement-breakpoint
ALTER TABLE "pre_registrations" ALTER COLUMN "status" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "pre_registrations" ALTER COLUMN "status" SET DEFAULT 'pendiente'::text;--> statement-breakpoint
DROP TYPE "public"."request_status";--> statement-breakpoint
CREATE TYPE "public"."request_status" AS ENUM('pendiente', 'verificado', 'rechazado');--> statement-breakpoint
ALTER TABLE "pre_registrations" ALTER COLUMN "status" SET DEFAULT 'pendiente'::"public"."request_status";--> statement-breakpoint
ALTER TABLE "pre_registrations" ALTER COLUMN "status" SET DATA TYPE "public"."request_status" USING "status"::"public"."request_status";--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "display_username" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "username" varchar(16);--> statement-breakpoint
ALTER TABLE "comments" ADD CONSTRAINT "comments_author_id_users_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "comments" ADD CONSTRAINT "comments_stagesProjects_fk" FOREIGN KEY ("project_id","stage_id") REFERENCES "public"."stages_projects"("project_id","stage_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stages_evaluators" ADD CONSTRAINT "stages_evaluators_stage_id_stages_id_fk" FOREIGN KEY ("stage_id") REFERENCES "public"."stages"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stages_evaluators" ADD CONSTRAINT "stages_evaluators_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stages_projects" ADD CONSTRAINT "stages_projects_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stages_projects" ADD CONSTRAINT "stages_projects_stage_id_stages_id_fk" FOREIGN KEY ("stage_id") REFERENCES "public"."stages"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "teams" ADD CONSTRAINT "teams_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "teams_users" ADD CONSTRAINT "teams_users_team_id_teams_id_fk" FOREIGN KEY ("team_id") REFERENCES "public"."teams"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "teams_users" ADD CONSTRAINT "teams_users_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "comments_stagesProject_idx" ON "comments" USING btree ("project_id","stage_id");--> statement-breakpoint
CREATE INDEX "comments_authorId_idx" ON "comments" USING btree ("author_id");--> statement-breakpoint
CREATE INDEX "teamsUsers_userId_idx" ON "teams_users" USING btree ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "teams_users_one_leader_idx" ON "teams_users" USING btree ("team_id") WHERE 'leader' = ANY("teams_users"."roles");--> statement-breakpoint
CREATE INDEX "preRegistrations_verifiedBy_idx" ON "pre_registrations" USING btree ("verified_by");--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_username_unique" UNIQUE("username");