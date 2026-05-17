import { db } from '$lib/server/db/database'
import { redirect } from '@sveltejs/kit'

import type { PageServerLoad } from './$types'

export const load = (async () => {
  const stages = await db.query.stages.findMany({
    orderBy: (t, { asc }) => [asc(t.order)],
  })

  if (stages.length > 0) {
    redirect(302, `/dashboard/evento/etapas/${stages[0].id}`)
  }

  return { hasStages: false }
}) satisfies PageServerLoad
