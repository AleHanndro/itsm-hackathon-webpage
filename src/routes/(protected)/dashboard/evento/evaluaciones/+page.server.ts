import { db } from '$lib/server/db/database'

import type { PageServerLoad } from './$types'

export const load = (async () => {
  // Fetch all stages
  const allStages = await db.query.stages.findMany({
    orderBy: (t, { asc }) => [asc(t.order)],
  })

  const teamsWithProjects = await db.query.teams.findMany({
    columns: { id: true, name: true },
    where: (t, { isNotNull }) => isNotNull(t.projectId),
    with: {
      project: {
        columns: { id: true, name: true, score: true },
        with: {
          stagesProjects: {
            columns: { stageId: true, verdict: true },
          },
        },
      },
    },
  })

  const verdictByProjectStage = new Map<number, Map<number, boolean | null>>()
  for (const team of teamsWithProjects) {
    if (!team.project) continue
    const stageMap = new Map<number, boolean | null>()
    for (const sp of team.project.stagesProjects) {
      stageMap.set(sp.stageId, sp.verdict)
    }
    verdictByProjectStage.set(team.project.id, stageMap)
  }

  const stageStats = allStages.map((stage) => {
    let approvedCount = 0
    let reprovedCount = 0
    let pendingCount = 0

    for (const team of teamsWithProjects) {
      if (!team.project) continue

      const verdict = verdictByProjectStage.get(team.project.id)?.get(stage.id)

      if (verdict === undefined || verdict === null) {
        pendingCount++
      } else if (verdict === true) {
        approvedCount++
      } else {
        reprovedCount++
      }
    }

    return {
      ...stage,
      approvedCount,
      pendingCount,
      reprovedCount,
    }
  })

  // Calculate overall top teams based on final evaluation score
  const topOverallTeams = teamsWithProjects
    .filter((team) => team.project !== null)
    .map((team) => ({
      projectName: team.project?.name,
      score: team.project?.score,
      teamName: team.name,
    }))
    .sort((a, b) => (b.score ?? 0) - (a.score ?? 0))

  return {
    stageStats,
    teamsWithProjects,
    topOverallTeams,
  }
}) satisfies PageServerLoad
