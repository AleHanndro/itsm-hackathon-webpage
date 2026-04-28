import { relations } from 'drizzle-orm'
import { pgTable as table } from 'drizzle-orm/pg-core'
import * as t from 'drizzle-orm/pg-core'

import { timestampConfig, timestamps } from './columns.helpers'

export const users = table('users', {
  email: t.text('email').notNull().unique(),
  emailVerified: t.boolean('email_verified').default(false).notNull(),
  id: t.text('id').primaryKey(),
  image: t.text('image'),
  name: t.text('name').notNull(),
  ...timestamps,
})

export const sessions = table(
  'sessions',
  {
    expiresAt: t.timestamp('expires_at', timestampConfig).notNull(),
    id: t.text('id').primaryKey(),
    ipAddress: t.text('ip_address'),
    token: t.text('token').notNull().unique(),
    userAgent: t.text('user_agent'),
    userId: t
      .text('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    ...timestamps,
  },
  (table) => [t.index('session_userId_idx').on(table.userId)],
)

export const accounts = table(
  'accounts',
  {
    accessToken: t.text('access_token'),
    accessTokenExpiresAt: t.timestamp('access_token_expires_at', timestampConfig),
    accountId: t.text('account_id').notNull(),
    id: t.text('id').primaryKey(),
    idToken: t.text('id_token'),
    password: t.text('password'),
    providerId: t.text('provider_id').notNull(),
    refreshToken: t.text('refresh_token'),
    refreshTokenExpiresAt: t.timestamp('refresh_token_expires_at', timestampConfig),
    scope: t.text('scope'),
    userId: t
      .text('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    ...timestamps,
  },
  (table) => [t.index('account_userId_idx').on(table.userId)],
)

export const verifications = table(
  'verifications',
  {
    expiresAt: t.timestamp('expires_at', timestampConfig).notNull(),
    id: t.text('id').primaryKey(),
    identifier: t.text('identifier').notNull(),
    value: t.text('value').notNull(),
    ...timestamps,
  },
  (table) => [t.index('verification_identifier_idx').on(table.identifier)],
)

export const usersRelations = relations(users, ({ many }) => ({
  accounts: many(accounts),
  sessions: many(sessions),
}))

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, {
    fields: [sessions.userId],
    references: [users.id],
  }),
}))

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, {
    fields: [accounts.userId],
    references: [users.id],
  }),
}))
