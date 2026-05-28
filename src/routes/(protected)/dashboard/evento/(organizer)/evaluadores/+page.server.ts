import { stagesEvaluators } from '$lib/schema/stages'
import { db } from '$lib/server/db/database'
import { dbTry } from '$lib/server/db/errors'
import { hasAnyRole } from '$lib/server/utils'
import { and, eq } from 'drizzle-orm'
import { fail, message, superValidate } from 'sveltekit-superforms'
import { zod4 } from 'sveltekit-superforms/adapters'

import type { Actions, PageServerLoad } from './$types'

import { assignEvaluatorSchema, removeEvaluatorSchema, updateFinalEvalSchema } from './schema'

export const load = (async () => {
  const [assignForm, removeForm, updateFinalEvalForm] = await Promise.all([
    superValidate(zod4(assignEvaluatorSchema)),
    superValidate(zod4(removeEvaluatorSchema)),
    superValidate(zod4(updateFinalEvalSchema)),
  ])

  const availableEvaluators = await db.query.users.findMany({
    columns: { email: true, id: true, name: true },
    where: (u, { eq }) => eq(u.role, 'evaluator'),
  })

  const stages = await db.query.stages.findMany({
    orderBy: (t, { asc }) => [asc(t.order)],
    with: {
      stagesEvaluators: {
        columns: { canEvaluateFinal: true },
        with: {
          user: {
            columns: { email: true, id: true, name: true },
          },
        },
      },
    },
  })

  return { assignForm, availableEvaluators, removeForm, stages, updateFinalEvalForm }
}) satisfies PageServerLoad

export const actions = {
  assign: async ({ locals, request }) => {
    if (!hasAnyRole(locals.user?.role, ['admin', 'organizer']))
      return fail(403, { message: 'No tienes permiso para realizar esta acción' })

    const form = await superValidate(request, zod4(assignEvaluatorSchema))
    if (!form.valid) return fail(400, { form })

    const { canEvaluateFinal, stageId, userId } = form.data

    const { error } = await dbTry(() =>
      db.insert(stagesEvaluators).values({ canEvaluateFinal, stageId, userId }),
    )

    if (error) {
      if (error.kind === 'unique_violation') {
        return message(
          form,
          { text: 'El usuario ya está asignado a esta etapa', type: 'error' },
          { status: 400 },
        )
      }
      console.error('[assignEvaluator]', error)
      return message(
        form,
        { text: 'Error inesperado al asignar el evaluador', type: 'error' },
        { status: 500 },
      )
    }

    return message(form, { text: 'Evaluador asignado exitosamente', type: 'success' })
  },
  remove: async ({ locals, request }) => {
    if (!hasAnyRole(locals.user?.role, ['admin', 'organizer']))
      return fail(403, { message: 'No tienes permiso para realizar esta acción' })

    const form = await superValidate(request, zod4(removeEvaluatorSchema))
    if (!form.valid) return fail(400, { form })

    const { stageId, userId } = form.data

    const { error } = await dbTry(() =>
      db
        .delete(stagesEvaluators)
        .where(and(eq(stagesEvaluators.stageId, stageId), eq(stagesEvaluators.userId, userId))),
    )

    if (error) {
      console.error('[removeEvaluator]', error)
      return message(
        form,
        { text: 'Error inesperado al remover el evaluador', type: 'error' },
        { status: 500 },
      )
    }

    return message(form, { text: 'Evaluador removido exitosamente', type: 'success' })
  },
  updateFinalEval: async ({ locals, request }) => {
    if (!hasAnyRole(locals.user?.role, ['admin', 'organizer']))
      return fail(403, { message: 'No tienes permiso para realizar esta acción' })

    const form = await superValidate(request, zod4(updateFinalEvalSchema))
    if (!form.valid) return fail(400, { form })

    const { canEvaluateFinal, stageId, userId } = form.data

    const { error } = await dbTry(() =>
      db
        .update(stagesEvaluators)
        .set({ canEvaluateFinal })
        .where(and(eq(stagesEvaluators.stageId, stageId), eq(stagesEvaluators.userId, userId))),
    )

    if (error) {
      console.error('[updateFinalEval]', error)
      return message(
        form,
        { text: 'Error inesperado al actualizar el permiso de evaluación final', type: 'error' },
        { status: 500 },
      )
    }

    return message(form, {
      text: canEvaluateFinal
        ? 'Permiso de evaluación final activado'
        : 'Permiso de evaluación final desactivado',
      type: 'success',
    })
  },
} satisfies Actions
