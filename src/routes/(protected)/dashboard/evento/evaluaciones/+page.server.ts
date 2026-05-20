import { db } from '$lib/server/db/database'

import type { PageServerLoad } from './$types'

export const load = (async () => {
  // Fetch all stages
  const allStages = await db.query.stages.findMany({
    orderBy: (t, { asc }) => [asc(t.order)],
  })

  // Fetch all teams with projects and their stages_projects scores
  const teamsWithProjects = await db.query.teams.findMany({
    columns: { id: true, name: true },
    where: (t, { isNotNull }) => isNotNull(t.projectId),
    with: {
      project: {
        columns: { id: true, name: true },
        with: {
          stagesProjects: {
            columns: { score: true, stageId: true },
          },
        },
      },
    },
  })

  // Process data for the dashboard
  const stageStats = allStages.map((stage) => {
    let approvedCount = 0
    let reprovedCount = 0
    let highestScore = -1
    let topTeam = null

    for (const team of teamsWithProjects) {
      const stageScore =
        team.project?.stagesProjects.find((sp) => sp.stageId === stage.id)?.score ?? 0

      if (stageScore >= 70) {
        approvedCount++
      } else {
        reprovedCount++
      }

      if (stageScore > highestScore) {
        highestScore = stageScore
        topTeam = team.name
      }
    }

    return {
      ...stage,
      approvedCount,
      highestScore,
      reprovedCount,
      topTeam,
    }
  })

  // Calculate overall top teams (average of all stages)
  const teamAverages = teamsWithProjects.map((team) => {
    const scores = allStages.map(
      (stage) => team.project?.stagesProjects.find((sp) => sp.stageId === stage.id)?.score ?? 0,
    )
    const average = scores.reduce((a, b) => a + b, 0) / (allStages.length || 1)
    return {
      average,
      projectName: team.project?.name,
      teamName: team.name,
    }
  })

  const topOverallTeams = teamAverages.sort((a, b) => b.average - a.average).slice(0, 5)

  return {
    stageStats,
    teamsWithProjects,
    topOverallTeams,
  }
}) satisfies PageServerLoad
