import type { InferSelectModel } from 'drizzle-orm'

import { relations } from 'drizzle-orm'
import { pgTable } from 'drizzle-orm/pg-core'
import * as t from 'drizzle-orm/pg-core'

import { users } from './auth'
import { timestamps } from './columns.helpers'
import { projects } from './projects'

export const stages = pgTable('stages', {
  description: t.text('description'),
  id: t.bigint('id', { mode: 'number' }).primaryKey().generatedAlwaysAsIdentity(),
  name: t.text('name').notNull(),
  order: t.integer('order').notNull(),
  ...timestamps,
})

export const stagesProjects = pgTable(
  'stages_projects',
  {
    projectId: t
      .bigint('project_id', { mode: 'number' })
      .references(() => projects.id, { onDelete: 'cascade' })
      .notNull(),
    stageId: t
      .bigint('stage_id', { mode: 'number' })
      .references(() => stages.id, { onDelete: 'cascade' })
      .notNull(),
    verdict: t.boolean('passed'), // null = pending, true = passed, false = failed
    ...timestamps,
  },
  (table) => [t.primaryKey({ columns: [table.projectId, table.stageId] })],
)

export const stagesProjectsRelations = relations(stagesProjects, ({ many, one }) => ({
  attachments: many(attachments),
  comments: many(comments),
  project: one(projects, {
    fields: [stagesProjects.projectId],
    references: [projects.id],
  }),
  stage: one(stages, {
    fields: [stagesProjects.stageId],
    references: [stages.id],
  }),
}))

export const comments = pgTable(
  'comments',
  {
    authorId: t.text('author_id').references(() => users.id, { onDelete: 'set null' }),
    content: t.text('content').notNull(),
    id: t.bigint('id', { mode: 'number' }).primaryKey().generatedAlwaysAsIdentity(),
    /** FK to the specific (project, stage) junction row — scopes comment to one team's stage. */
    projectId: t.bigint('project_id', { mode: 'number' }).notNull(),
    stageId: t.bigint('stage_id', { mode: 'number' }).notNull(),
    ...timestamps,
  },
  (table) => [
    t
      .foreignKey({
        columns: [table.projectId, table.stageId],
        foreignColumns: [stagesProjects.projectId, stagesProjects.stageId],
        name: 'comments_stagesProjects_fk',
      })
      .onDelete('cascade'),
    t.index('comments_stagesProject_idx').on(table.projectId, table.stageId),
    t.index('comments_authorId_idx').on(table.authorId),
  ],
)

export const commentsRelations = relations(comments, ({ one }) => ({
  author: one(users, {
    fields: [comments.authorId],
    references: [users.id],
  }),
  stagesProject: one(stagesProjects, {
    fields: [comments.projectId, comments.stageId],
    references: [stagesProjects.projectId, stagesProjects.stageId],
  }),
}))

export const stagesEvaluators = pgTable(
  'stages_evaluators',
  {
    canEvaluateFinal: t.boolean('can_evaluate_final').default(false).notNull(),
    stageId: t
      .bigint('stage_id', { mode: 'number' })
      .references(() => stages.id, { onDelete: 'cascade' })
      .notNull(),
    userId: t
      .text('user_id')
      .references(() => users.id, { onDelete: 'cascade' })
      .notNull(),
    ...timestamps,
  },
  (table) => [t.primaryKey({ columns: [table.stageId, table.userId] })],
)

export const stagesEvaluatorsRelations = relations(stagesEvaluators, ({ one }) => ({
  stage: one(stages, {
    fields: [stagesEvaluators.stageId],
    references: [stages.id],
  }),
  user: one(users, {
    fields: [stagesEvaluators.userId],
    references: [users.id],
  }),
}))

export const stagesRelations = relations(stages, ({ many }) => ({
  stagesEvaluators: many(stagesEvaluators),
  stagesProjects: many(stagesProjects),
}))

export const attachments = pgTable(
  'attachments',
  {
    fileName: t.text('file_name').notNull(),
    fileSize: t.integer('file_size').notNull(),
    fileUrl: t.text('file_url').notNull(),
    id: t.bigint('id', { mode: 'number' }).primaryKey().generatedAlwaysAsIdentity(),
    mimeType: t.text('mime_type').notNull(),
    projectId: t.bigint('project_id', { mode: 'number' }).notNull(),
    stageId: t.bigint('stage_id', { mode: 'number' }).notNull(),
    uploadedBy: t.text('uploaded_by').references(() => users.id, { onDelete: 'set null' }),
    ...timestamps,
  },
  (table) => [
    t
      .foreignKey({
        columns: [table.projectId, table.stageId],
        foreignColumns: [stagesProjects.projectId, stagesProjects.stageId],
        name: 'attachments_stagesProjects_fk',
      })
      .onDelete('cascade'),
    t.index('attachments_stagesProject_idx').on(table.projectId, table.stageId),
    t.index('attachments_uploadedBy_idx').on(table.uploadedBy),
  ],
)

export const attachmentsRelations = relations(attachments, ({ one }) => ({
  stagesProject: one(stagesProjects, {
    fields: [attachments.projectId, attachments.stageId],
    references: [stagesProjects.projectId, stagesProjects.stageId],
  }),
  uploadedBy: one(users, {
    fields: [attachments.uploadedBy],
    references: [users.id],
  }),
}))

/**
 * Stores per-criterion scores for the final hackathon evaluation.
 * One row per (projectId, evaluatorId, criterionId).
 * Any evaluator with canEvaluateFinal=true can overwrite any row (intentional design).
 */
export const finalScores = pgTable(
  'final_scores',
  {
    criterionId: t.text('criterion_id').notNull(),
    evaluatorId: t.text('evaluator_id').references(() => users.id, { onDelete: 'set null' }),
    id: t.bigint('id', { mode: 'number' }).primaryKey().generatedAlwaysAsIdentity(),
    projectId: t
      .bigint('project_id', { mode: 'number' })
      .references(() => projects.id, { onDelete: 'cascade' })
      .notNull(),
    score: t.integer('score').notNull(),
    ...timestamps,
  },
  (table) => [
    /** Ensures one row per (project, evaluator, criterion) — safe for upsert. */
    t
      .uniqueIndex('final_scores_project_evaluator_criterion_uidx')
      .on(table.projectId, table.evaluatorId, table.criterionId),
    t.index('final_scores_project_idx').on(table.projectId),
    t.index('final_scores_evaluator_idx').on(table.evaluatorId),
  ],
)

export const finalScoresRelations = relations(finalScores, ({ one }) => ({
  evaluator: one(users, {
    fields: [finalScores.evaluatorId],
    references: [users.id],
  }),
  project: one(projects, {
    fields: [finalScores.projectId],
    references: [projects.id],
  }),
}))

export type FinalScore = InferSelectModel<typeof finalScores>
