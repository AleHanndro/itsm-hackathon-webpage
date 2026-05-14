import { relations } from 'drizzle-orm'
import { pgTable as table } from 'drizzle-orm/pg-core'
import * as t from 'drizzle-orm/pg-core'

import { users } from './auth'
import { timestamps } from './columns.helpers'

export const teams = table(
  'teams',
  {
    id: t.bigint('id', { mode: 'number' }).primaryKey().generatedAlwaysAsIdentity(),
    leaderId: t
      .text('leader_id')
      .references(() => users.id, { onDelete: 'cascade' })
      .notNull(),
    name: t.text('name').notNull().unique(),
    ...timestamps,
  },
  (table) => [t.index('teams_leaderId_idx').on(table.leaderId)],
)

export const teamsUsers = table(
  'teams_users',
  {
    createdAt: timestamps.createdAt,
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
  ],
)

export const teamsRelations = relations(teams, ({ many, one }) => ({
  leader: one(users, {
    fields: [teams.leaderId],
    references: [users.id],
  }),
  members: many(teamsUsers),
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
