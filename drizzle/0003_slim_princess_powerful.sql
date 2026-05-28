CREATE TABLE "attachments" (
	"file_name" text NOT NULL,
	"file_size" integer NOT NULL,
	"file_url" text NOT NULL,
	"id" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "attachments_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1),
	"mime_type" text NOT NULL,
	"project_id" bigint NOT NULL,
	"stage_id" bigint NOT NULL,
	"uploaded_by" text,
	"created_at" timestamp (6) with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp (6) with time zone NOT NULL
);
--> statement-breakpoint
ALTER TABLE "stages_projects" DROP CONSTRAINT "stages_projects_scoreCheck";--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "score" real;--> statement-breakpoint
ALTER TABLE "stages_evaluators" ADD COLUMN "can_evaluate_final" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "stages_projects" ADD COLUMN "passed" boolean;--> statement-breakpoint
ALTER TABLE "attachments" ADD CONSTRAINT "attachments_uploaded_by_users_id_fk" FOREIGN KEY ("uploaded_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "attachments" ADD CONSTRAINT "attachments_stagesProjects_fk" FOREIGN KEY ("project_id","stage_id") REFERENCES "public"."stages_projects"("project_id","stage_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "attachments_stagesProject_idx" ON "attachments" USING btree ("project_id","stage_id");--> statement-breakpoint
CREATE INDEX "attachments_uploadedBy_idx" ON "attachments" USING btree ("uploaded_by");--> statement-breakpoint
ALTER TABLE "stages_projects" DROP COLUMN "score";