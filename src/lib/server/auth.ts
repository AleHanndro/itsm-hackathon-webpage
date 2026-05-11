import { getRequestEvent } from '$app/server'
import { env } from '$env/dynamic/private'
import { ac, allRoles } from '$lib/permissions'
import * as schema from '$lib/schema/auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { betterAuth } from 'better-auth/minimal'
import { admin as adminPlugin } from 'better-auth/plugins'
import { sveltekitCookies } from 'better-auth/svelte-kit'

import { db } from './db/database'

export const auth = betterAuth({
  baseURL: env.ORIGIN,
  database: drizzleAdapter(db, { provider: 'pg', schema, usePlural: true }),
  emailAndPassword: { disableSignUp: true, enabled: true },
  plugins: [sveltekitCookies(getRequestEvent), adminPlugin({ ac, roles: allRoles })],
  secret: env.BETTER_AUTH_SECRET,
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 7 * 24 * 60 * 60,
    },
  },
  socialProviders: {
    google: {
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    },
  },
})

export type Session = typeof auth.$Infer.Session.session
export type User = typeof auth.$Infer.Session.user
