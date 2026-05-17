import { relations, sql } from 'drizzle-orm'
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

export const stagesRelations = relations(stages, ({ many }) => ({
  stagesProjects: many(stagesProjects),
}))

export const stagesProjects = pgTable(
  'stages_projects',
  {
    projectId: t
      .bigint('project_id', { mode: 'number' })
      .references(() => projects.id, { onDelete: 'cascade' })
      .notNull(),
    score: t.integer('score').notNull().default(0),
    stageId: t
      .bigint('stage_id', { mode: 'number' })
      .references(() => stages.id, { onDelete: 'cascade' })
      .notNull(),
    ...timestamps,
  },
  (table) => [
    t.primaryKey({ columns: [table.projectId, table.stageId] }),
    t.check('stages_projects_scoreCheck', sql`(${table.score} >= 0) AND (${table.score} <= 100)`),
  ],
)

export const stagesProjectsRelations = relations(stagesProjects, ({ many, one }) => ({
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
