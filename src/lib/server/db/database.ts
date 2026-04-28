import { env } from '$env/dynamic/private'
import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'

if (!env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is not set')
}

const client = postgres(env.DATABASE_URL, {
  prepare: false,
  // FIX: self-signed certificate error in production
  // ssl: import.meta.env.PROD,
})

export const db = drizzle(client)
