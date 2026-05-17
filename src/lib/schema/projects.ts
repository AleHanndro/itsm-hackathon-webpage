import { relations } from 'drizzle-orm'
import { pgTable } from 'drizzle-orm/pg-core'
import * as t from 'drizzle-orm/pg-core'

import { timestamps } from './columns.helpers'
import { stagesProjects } from './stages'
import { teams } from './teams'

export const projects = pgTable('projects', {
  description: t.text('description'),
  id: t.bigint('id', { mode: 'number' }).primaryKey().generatedAlwaysAsIdentity(),
  name: t.text('name').notNull(),
  ...timestamps,
})

export const projectsRelations = relations(projects, ({ many, one }) => ({
  stagesProjects: many(stagesProjects),
  team: one(teams, {
    fields: [projects.id],
    references: [teams.projectId],
  }),
}))
