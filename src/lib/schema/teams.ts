import { relations, sql } from 'drizzle-orm'
import { pgTable } from 'drizzle-orm/pg-core'
import * as t from 'drizzle-orm/pg-core'

import { users } from './auth'
import { timestamps } from './columns.helpers'
import { projects } from './projects'

/** Valid role values for a team member. Stored as a text[] in the DB so new roles
 *  can be added without a migration — just extend this tuple and update the app. */
export const TEAM_ROLES = ['leader', 'speaker'] as const
export type TeamRole = (typeof TEAM_ROLES)[number]

export const teams = pgTable('teams', {
  id: t.bigint('id', { mode: 'number' }).primaryKey().generatedAlwaysAsIdentity(),
  name: t.text('name').notNull().unique(),
  projectId: t
    .bigint('project_id', { mode: 'number' })
    .references(() => projects.id, { onDelete: 'set null' }),
  ...timestamps,
})

export const teamsUsers = pgTable(
  'teams_users',
  {
    createdAt: timestamps.createdAt,
    /**
     * Roles this member holds in the team.
     * - `[]` (empty) → regular member, no special responsibility
     * - `['leader']` → team leader
     * - `['speaker']` → presents to judges
     * - `['leader', 'speaker']` → both roles simultaneously
     *
     * Enforced: at most ONE row per team may contain `'leader'` in this array,
     * guaranteed by the partial unique index `teams_users_one_leader_idx`.
     */
    roles: t.text('roles').array().notNull().default([]),
    teamId: t
      .bigint('team_id', { mode: 'number' })
      .references(() => teams.id, { onDelete: 'cascade' })
      .notNull(),
    userId: t
      .text('user_id')
      .references(() => users.id, { onDelete: 'cascade' })
      .notNull(),
  },
  (table) => [
    t.primaryKey({ columns: [table.teamId, table.userId] }),
    t.index('teamsUsers_userId_idx').on(table.userId),
    // Enforces that at most one member per team can be the leader
    t
      .uniqueIndex('teams_users_one_leader_idx')
      .on(table.teamId)
      .where(sql`'leader' = ANY(${table.roles})`),
  ],
)

export const teamsRelations = relations(teams, ({ many, one }) => ({
  members: many(teamsUsers),
  project: one(projects, {
    fields: [teams.projectId],
    references: [projects.id],
  }),
}))

export const teamsUsersRelations = relations(teamsUsers, ({ one }) => ({
  team: one(teams, {
    fields: [teamsUsers.teamId],
    references: [teams.id],
  }),
  user: one(users, {
    fields: [teamsUsers.userId],
    references: [users.id],
  }),
}))
