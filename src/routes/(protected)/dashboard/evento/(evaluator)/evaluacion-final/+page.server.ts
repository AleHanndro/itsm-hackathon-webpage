import { projects } from '$lib/schema/projects'
import { db } from '$lib/server/db/database'
import { fail } from '@sveltejs/kit'
import { eq } from 'drizzle-orm'
import { zod4 } from 'sveltekit-superforms/adapters'
import { message, superValidate } from 'sveltekit-superforms/server'

import type { Actions, PageServerLoad } from './$types'

import { finalEvaluationSchema, requirementsList } from './schema'

export const load = (async () => {
  // Fetch total stages
  const allStages = await db.query.stages.findMany()
  const totalStagesCount = allStages.length

  const teamsWithProjects = await db.query.teams.findMany({
    where: (t, { isNotNull }) => isNotNull(t.projectId),
    with: {
      project: {
        with: {
          stagesProjects: true,
        },
      },
    },
  })

  // Filter eligible projects (must have verdict === true in all stages)
  const eligibleProjects = teamsWithProjects
    .filter((team) => team.project)
    .filter((team) => {
      const sps = team.project?.stagesProjects
      if (!sps || sps.length < totalStagesCount || totalStagesCount === 0) return false
      return sps.every((sp) => sp.verdict === true)
    })
    .map((team) => ({
      id: team.project?.id,
      name: team.project?.name,
      teamName: team.name,
    }))

  const form = await superValidate(zod4(finalEvaluationSchema))

  return { eligibleProjects, form, requirementsList }
}) satisfies PageServerLoad

export const actions: Actions = {
  default: async ({ request }) => {
    const form = await superValidate(request, zod4(finalEvaluationSchema))

    if (!form.valid) {
      return fail(400, { form })
    }

    const projectId = Number.parseInt(form.data.projectId, 10)

    // Calculate final score
    let totalScore = 0
    for (const req of requirementsList) {
      const score = form.data[req.id] || 0
      totalScore += score * (req.weight / 100)
    }

    try {
      await db.update(projects).set({ score: totalScore }).where(eq(projects.id, projectId))

      return message(form, { text: 'Evaluación final guardada exitosamente', type: 'success' })
    } catch (error) {
      console.error(error)
      return message(form, { text: 'Ocurrió un error al guardar la evaluación', type: 'error' })
    }
  },
}
