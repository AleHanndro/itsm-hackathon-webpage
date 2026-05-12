import { getRequestEvent } from '$app/server'
import { env } from '$env/dynamic/private'
import { ac, allRoles } from '$lib/permissions'
import * as schema from '$lib/schema/auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { betterAuth } from 'better-auth/minimal'
import { admin as adminPlugin } from 'better-auth/plugins'
import { sveltekitCookies } from 'better-auth/svelte-kit'

import { db } from './db/database'
import { syncGoogleImageToUser } from './utils'

export const auth = betterAuth({
  account: {
    accountLinking: {
      enabled: true,
      trustedProviders: ['google'],
    },
  },
  baseURL: env.ORIGIN,
  database: drizzleAdapter(db, { provider: 'pg', schema, usePlural: true }),
  databaseHooks: {
    account: {
      create: {
        after: async (account) => {
          await syncGoogleImageToUser({ account, db, userTable: schema.users })
        },
      },
      update: {
        after: async (account) => {
          await syncGoogleImageToUser({ account, db, userTable: schema.users })
        },
      },
    },
    user: {
      create: {
        before: async (user) => {
          if (user.role !== 'user') return

          const prereg = await db.query.preRegistrations.findFirst({
            columns: { name: true, status: true },
            where: (t, { eq }) => eq(t.email, user.email),
          })

          if (!prereg) return false

          return {
            data: { ...user, name: prereg.name },
          }
        },
      },
    },
  },
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
