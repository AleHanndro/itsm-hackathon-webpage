import { type PgTimestampConfig, timestamp } from 'drizzle-orm/pg-core'

export const timestampConfig = { precision: 6, withTimezone: true } satisfies PgTimestampConfig

export const timestamps = {
  createdAt: timestamp('created_at', timestampConfig).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', timestampConfig)
    .$onUpdateFn(() => /* @__PURE__ */ new Date())
    .notNull(),
}
