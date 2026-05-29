import { finalScores } from '$lib/schema/stages'
import { db } from '$lib/server/db/database'
import { fail } from '@sveltejs/kit'
import { zod4 } from 'sveltekit-superforms/adapters'
import { message, superValidate } from 'sveltekit-superforms/server'

import type { Actions, PageServerLoad } from './$types'

import { finalEvaluationSchema, requirementsList } from './schema'

export const load = (async () => {
  const teamsWithProjects = await db.query.teams.findMany({
    where: (t, { isNotNull }) => isNotNull(t.projectId),
    with: {
      project: true,
    },
  })

  // All teams that have a linked project are available for evaluation
  const eligibleProjects = teamsWithProjects
    .filter((team) => team.project)
    .map((team) => ({
      id: team.project?.id,
      name: team.project?.name,
      teamName: team.name,
    }))

  // Default form values — all scores at 0
  const defaults: Record<string, number | string> = { projectId: '' }
  for (const req of requirementsList) {
    defaults[req.id] = 0
  }

  const form = await superValidate(defaults, zod4(finalEvaluationSchema), { errors: false })

  return { eligibleProjects, form, requirementsList }
}) satisfies PageServerLoad

export const actions: Actions = {
  evaluate: async ({ locals, request }) => {
    const user = locals.user as NonNullable<typeof locals.user>
    const form = await superValidate(request, zod4(finalEvaluationSchema))

    if (!form.valid) {
      return fail(400, { form })
    }

    const projectId = Number.parseInt(form.data.projectId, 10)

    try {
      // Upsert one row per criterion. Any evaluator with canEvaluateFinal=true
      // may overwrite existing rows (intentional — evaluators are trusted).
      await db.transaction(async (tx) => {
        for (const req of requirementsList) {
          const score = (form.data as unknown as Record<string, number>)[req.id] ?? 0

          await tx
            .insert(finalScores)
            .values({
              criterionId: req.id,
              evaluatorId: user.id,
              projectId,
              score,
            })
            .onConflictDoUpdate({
              set: {
                score,
                updatedAt: new Date(),
              },
              target: [finalScores.projectId, finalScores.evaluatorId, finalScores.criterionId],
            })
        }
      })

      return message(form, { text: 'Evaluación final guardada exitosamente', type: 'success' })
    } catch (error) {
      console.error(error)
      return message(form, { text: 'Ocurrió un error al guardar la evaluación', type: 'error' })
    }
  },

  /** Load existing scores for a project+evaluator pair (called via ?/loadScores). */
  loadScores: async ({ locals, request }) => {
    const user = locals.user as NonNullable<typeof locals.user>
    const data = await request.formData()
    const projectId = Number.parseInt(data.get('projectId') as string, 10)

    if (!projectId) return fail(400, { error: 'Proyecto inválido' })

    const existingScores = await db.query.finalScores.findMany({
      where: (t, { and, eq }) => and(eq(t.projectId, projectId), eq(t.evaluatorId, user.id)),
    })

    const scoreMap: Record<string, number> = {}
    for (const row of existingScores) {
      scoreMap[row.criterionId] = row.score
    }

    // Build defaults merged with existing scores
    const defaults: Record<string, number | string> = {
      projectId: String(projectId),
    }
    for (const req of requirementsList) {
      defaults[req.id] = scoreMap[req.id] ?? 0
    }

    const form = await superValidate(defaults, zod4(finalEvaluationSchema))
    return { form, requirementsList }
  },
}
