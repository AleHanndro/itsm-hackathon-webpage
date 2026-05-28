import { db } from '$lib/server/db/database'
import { hasAnyRole } from '$lib/server/utils'
import { redirect } from '@sveltejs/kit'

import type { PageServerLoad } from './$types'

export const load = (async ({ locals }) => {
  // On /(protected) routes, locals.user is guaranteed by src/hooks.server.ts
  const user = locals.user as NonNullable<typeof locals.user>

  // Staff/admin users should not see the participant dashboard
  if (hasAnyRole(user.role, ['admin', 'staff', 'evaluator', 'organizer'])) {
    redirect(302, '/dashboard/evento')
  }

  const userTeam = await db.query.teamsUsers.findFirst({
    where: (t, { eq }) => eq(t.userId, user.id),
    with: {
      team: {
        with: {
          members: {
            with: {
              user: {
                columns: { email: true, name: true },
              },
            },
          },
          project: {
            with: {
              stagesProjects: {
                with: {
                  stage: true,
                },
              },
            },
          },
        },
      },
    },
  })

  let teamInfo = null
  let projectInfo = null
  let stages: { id: number; name: string; order: number; verdict: boolean | null }[] = []

  if (userTeam?.team) {
    teamInfo = {
      members: userTeam.team.members.map((m) => ({
        email: m.user.email,
        name: m.user.name,
        roles: m.roles,
      })),
      name: userTeam.team.name,
    }

    if (userTeam.team.project) {
      projectInfo = {
        description: userTeam.team.project.description,
        id: userTeam.team.project.id,
        name: userTeam.team.project.name,
      }

      const sps = userTeam.team.project.stagesProjects
      stages = sps.map((sp) => ({
        id: sp.stage.id,
        name: sp.stage.name,
        order: sp.stage.order,
        verdict: sp.verdict,
      }))

      stages.sort((a, b) => a.order - b.order)
    }
  }

  return { projectInfo, stages, teamInfo }
}) satisfies PageServerLoad
