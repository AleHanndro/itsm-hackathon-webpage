import { DATABASE_URL } from '$env/static/private'
import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'

if (!DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is not set')
}

const client = postgres(DATABASE_URL, {
  prepare: false,
  // FIX: self-signed certificate error in production
  // ssl: import.meta.env.PROD,
})

export const db = drizzle(client)
