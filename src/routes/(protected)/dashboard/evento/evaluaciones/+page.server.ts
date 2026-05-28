import { db } from '$lib/server/db/database'

import type { PageServerLoad } from './$types'

import { requirementsList } from '../(evaluator)/evaluacion-final/schema'

/** Calculates the weighted total (out of 100) from an array of final score rows. */
function computeWeightedTotal(scores: { criterionId: string; score: number }[]): null | number {
  if (scores.length === 0) return null
  const scoreMap = new Map(scores.map((s) => [s.criterionId, s.score]))
  let total = 0
  for (const req of requirementsList) {
    const s = scoreMap.get(req.id) ?? 0
    total += s * (req.weight / req.maxScore)
  }
  return Math.round(total * 10) / 10
}

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
        columns: { id: true, name: true },
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

  // Fetch all final scores grouped by project
  const allFinalScores = await db.query.finalScores.findMany({
    columns: { criterionId: true, projectId: true, score: true },
  })

  const scoresByProject = new Map<number, { criterionId: string; score: number }[]>()
  for (const row of allFinalScores) {
    const existing = scoresByProject.get(row.projectId) ?? []
    existing.push({ criterionId: row.criterionId, score: row.score })
    scoresByProject.set(row.projectId, existing)
  }

  // Calculate overall top teams based on computed weighted score
  const topOverallTeams = teamsWithProjects
    .filter((team) => team.project !== null)
    .map((team) => {
      const scores = scoresByProject.get(team.project?.id ?? 0) ?? []
      return {
        projectName: team.project?.name,
        score: computeWeightedTotal(scores),
        teamName: team.name,
      }
    })
    .filter((team) => team.score !== null)
    .sort((a, b) => (b.score ?? 0) - (a.score ?? 0))

  return {
    stageStats,
    teamsWithProjects,
    topOverallTeams,
  }
}) satisfies PageServerLoad
