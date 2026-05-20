import { stagesProjects } from '$lib/schema/stages'
import { db } from '$lib/server/db/database'
import { dbTry } from '$lib/server/db/errors'
import { hasAnyRole, hasRole } from '$lib/server/utils'
import { error } from '@sveltejs/kit'
import { fail, message, superValidate } from 'sveltekit-superforms'
import { zod4 } from 'sveltekit-superforms/adapters'

import type { Actions, PageServerLoad } from './$types'

import { gradeStageSchema } from '../schema'

export const load = (async ({ locals, params }) => {
  const { id: userId, role } = locals.user ?? {}
  const stageOrder = Number(params.stageOrder)
  if (isNaN(stageOrder)) {
    return error(404, 'Etapa no válida')
  }

  const stage = await db.query.stages.findFirst({
    where: (s, { eq }) => eq(s.order, stageOrder),
  })

  if (!stage) {
    error(404, 'La etapa no existe')
  }

  const isAdmin = hasRole(role, 'admin')
  const isEvaluator = hasRole(role, 'evaluator')

  if (!isAdmin && isEvaluator && userId) {
    const isAssigned = await db.query.stagesEvaluators.findFirst({
      where: (se, { and, eq }) => and(eq(se.stageId, stage.id), eq(se.userId, userId)),
    })
    if (!isAssigned) {
      error(403, 'No tienes permiso para evaluar esta etapa')
    }
  }

  const form = await superValidate(zod4(gradeStageSchema))

  // Fetch only the scores for this stage to avoid unnecessary stage requests
  const scores = await db.query.stagesProjects.findMany({
    columns: { projectId: true, score: true },
    where: (sp, { eq }) => eq(sp.stageId, stage.id),
  })

  return { form, scores, stage }
}) satisfies PageServerLoad

export const actions = {
  grade: async ({ locals, params, request }) => {
    // Action protection
    if (!hasAnyRole(locals.user?.role, ['admin', 'evaluator'])) {
      return error(403, 'No tienes permiso para realizar esta acción')
    }

    const stageOrder = Number(params.stageOrder)
    if (isNaN(stageOrder)) {
      return error(400, 'Etapa no válida')
    }

    const stage = await db.query.stages.findFirst({
      where: (s, { eq }) => eq(s.order, stageOrder),
    })

    if (!stage) {
      return error(404, 'La etapa no existe')
    }

    const isAdmin = hasRole(locals.user?.role, 'admin')
    const isEvaluator = hasRole(locals.user?.role, 'evaluator')

    if (!isAdmin && isEvaluator && locals.user?.id) {
      const userId = locals.user.id
      const isAssigned = await db.query.stagesEvaluators.findFirst({
        where: (se, { and, eq }) => and(eq(se.stageId, stage.id), eq(se.userId, userId)),
      })
      if (!isAssigned) {
        return error(403, 'No tienes permiso para evaluar esta etapa')
      }
    }

    const form = await superValidate(request, zod4(gradeStageSchema))
    if (!form.valid) return fail(400, { form })

    const { projectId } = form.data

    const { error: upsertError } = await dbTry(() =>
      db
        .insert(stagesProjects)
        .values({ projectId, score, stageId: stage.id })
        .onConflictDoUpdate({
          set: { score },
          target: [stagesProjects.projectId, stagesProjects.stageId],
        }),
    )

    if (upsertError) {
      if (upsertError.kind === 'unknown') console.error('[grade stage]', upsertError.cause)
      else console.error('[grade stage]', upsertError)

      return message(
        form,
        { text: 'Ocurrió un error al guardar la calificación.', type: 'error' },
        { status: 500 },
      )
    }

    return message(form, { text: 'Calificación guardada exitosamente.', type: 'success' })
  },
} satisfies Actions
