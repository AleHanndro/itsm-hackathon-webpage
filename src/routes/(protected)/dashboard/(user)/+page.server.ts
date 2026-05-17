import { db } from '$lib/server/db/database'
import { redirect } from '@sveltejs/kit'

import type { PageServerLoad } from './$types'

export const load = (async ({ locals }) => {
  const { user } = locals
  if (!user) {
    redirect(302, '/login')
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
  let stages: { id: number; name: string; order: number; score: number }[] = []
  let averageScore = 0

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
        score: sp.score,
      }))

      stages.sort((a, b) => a.order - b.order)

      if (stages.length > 0) {
        averageScore = stages.reduce((acc, curr) => acc + curr.score, 0) / stages.length
      }
    }
  }

  return { averageScore, projectInfo, stages, teamInfo }
}) satisfies PageServerLoad
