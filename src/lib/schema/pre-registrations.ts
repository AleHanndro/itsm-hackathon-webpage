import { sql } from 'drizzle-orm'
import { pgEnum, pgTable as table } from 'drizzle-orm/pg-core'
import * as t from 'drizzle-orm/pg-core'

import { users } from './auth'
import { timestampConfig, timestamps } from './columns.helpers'

export const groups = ['A', 'B', 'C'] as const
export const engineerings = ['ISC', 'IE', 'IER', 'IEM', 'II'] as const

export const requestStatusEnum = pgEnum('request_status', [
  'pendiente',
  'verificado',
  'rechazado',
  'reclamado',
])
export const shirtSizeEnum = pgEnum('shirt_sizes', [
  'ECH',
  'CH',
  'M',
  'G',
  'EG',
  '2EG',
  '3EG',
  '4EG',
])

export const preRegistrations = table(
  'pre_registrations',
  {
    email: t.text('email').notNull().unique(),
    engineering: t.text('engineering', { enum: engineerings }).notNull(),
    gender: t.text('gender').notNull(),
    group: t.text('group', { enum: groups }).notNull(),
    id: t.bigint('id', { mode: 'number' }).primaryKey().generatedAlwaysAsIdentity(),
    name: t.text('name').notNull(),
    semester: t.integer('semester').notNull(),
    shirtSize: shirtSizeEnum('shirt_size').notNull(),
    status: requestStatusEnum('status').default('pendiente').notNull(),
    studentId: t.text('student_id').notNull().unique(),
    verifiedAt: t.timestamp('verified_at', timestampConfig),
    verifiedBy: t.text('verified_by').references(() => users.id, { onDelete: 'set null' }),
    wantsAnnouncements: t.boolean('wants_announcements').notNull(),
    ...timestamps,
  },
  (table) => [t.check('semester_check', sql`${table.semester} >= 1 AND ${table.semester} <= 12`)],
)
