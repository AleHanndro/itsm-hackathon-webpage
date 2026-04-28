import type postgres from 'postgres'

import { DrizzleQueryError } from 'drizzle-orm/errors'

export type DbError =
  | { cause: unknown; kind: 'unknown' }
  | { column: string; kind: 'not_null' }
  | { constraint: string; kind: 'foreign_key' }
  | { constraint: string; kind: 'unique_violation' }

const PG_CODES: Record<string, DbError['kind']> = {
  '23502': 'not_null',
  '23503': 'foreign_key',
  '23505': 'unique_violation',
}

const classify = (error: unknown): DbError => {
  if (error instanceof DrizzleQueryError) {
    const cause = error.cause as postgres.PostgresError | undefined
    if (cause?.code) {
      const kind = PG_CODES[cause.code]
      if (kind === 'unique_violation' || kind === 'foreign_key')
        return { constraint: cause.constraint_name ?? '', kind }
      if (kind === 'not_null') return { column: cause.column_name ?? '', kind }
    }
  }

  return { cause: error, kind: 'unknown' }
}

export const dbTry = async <T>(
  fn: () => Promise<T>,
): Promise<{ data: null; error: DbError } | { data: T; error: null }> => {
  try {
    return { data: await fn(), error: null }
  } catch (err) {
    return { data: null, error: classify(err) }
  }
}
