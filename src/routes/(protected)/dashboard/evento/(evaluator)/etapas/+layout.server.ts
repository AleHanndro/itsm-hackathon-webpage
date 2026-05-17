import { db } from '$lib/server/db/database'

import type { LayoutServerLoad } from './$types'

export const load = (async () => {
  const teamsWithProjects = await db.query.teams.findMany({
    columns: { id: true, name: true },
    where: (t, { isNotNull }) => isNotNull(t.projectId),
    with: {
      project: {
        columns: { description: true, id: true, name: true },
      },
    },
  })

  return { teamsWithProjects }
}) satisfies LayoutServerLoad
