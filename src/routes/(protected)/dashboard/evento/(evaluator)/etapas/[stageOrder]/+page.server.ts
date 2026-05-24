import { comments } from '$lib/schema/stages'
import { stagesProjects } from '$lib/schema/stages'
import { db } from '$lib/server/db/database'
import { dbTry } from '$lib/server/db/errors'
import { hasAnyRole, hasRole } from '$lib/server/utils'
import { error } from '@sveltejs/kit'
import { and, eq } from 'drizzle-orm'
import { fail, message, superValidate } from 'sveltekit-superforms'
import { zod4 } from 'sveltekit-superforms/adapters'

import type { Actions, PageServerLoad } from './$types'

import {
  addCommentSchema,
  deleteCommentSchema,
  editCommentSchema,
  gradeStageSchema,
  resultToVerdict,
} from '../schema'

export const load = (async ({ locals, params }) => {
  const { id: userId, role } = locals.user ?? {}
  const stageOrder = Number(params.stageOrder)
  if (isNaN(stageOrder)) {
    return error(404, 'Etapa no válida')
  }

  const stage = await db.query.stages.findFirst({
    columns: { description: true, id: true, name: true, order: true },
    where: (s, { eq }) => eq(s.order, stageOrder),
  })

  if (!stage) {
    error(404, 'La etapa no existe')
  }

  const isAdmin = hasRole(role, 'admin')
  const isEvaluator = hasRole(role, 'evaluator')

  if (!isAdmin && isEvaluator && userId) {
    const isAssigned = await db.query.stagesEvaluators.findFirst({
      columns: { stageId: true },
      where: (se, { and, eq }) => and(eq(se.stageId, stage.id), eq(se.userId, userId)),
    })
    if (!isAssigned) {
      error(403, 'No tienes permiso para evaluar esta etapa')
    }
  }

  // Single query: fetch verdicts + comments (with author) for this stage only
  const stageProjectRows = await db.query.stagesProjects.findMany({
    columns: { projectId: true, verdict: true },
    where: (sp, { eq }) => eq(sp.stageId, stage.id),
    with: {
      attachments: true,
      comments: {
        columns: { authorId: true, content: true, createdAt: true, id: true, updatedAt: true },
        orderBy: (c, { asc }) => [asc(c.createdAt)],
        with: {
          author: { columns: { id: true, image: true, name: true } },
        },
      },
    },
  })

  const verdicts = stageProjectRows.map((r) => ({ projectId: r.projectId, verdict: r.verdict }))
  const stageComments = stageProjectRows.flatMap((r) =>
    r.comments.map((c) => ({ ...c, projectId: r.projectId, stageId: stage.id })),
  )
  const stageAttachments = stageProjectRows.flatMap((r) =>
    (r.attachments || []).map((a) => ({ ...a, projectId: r.projectId, stageId: stage.id })),
  )

  const [form, addCommentForm, editCommentForm, deleteCommentForm] = await Promise.all([
    superValidate(zod4(gradeStageSchema)),
    superValidate(zod4(addCommentSchema)),
    superValidate(zod4(editCommentSchema)),
    superValidate(zod4(deleteCommentSchema)),
  ])

  return {
    addCommentForm,
    currentUserId: userId ?? null,
    deleteCommentForm,
    editCommentForm,
    form,
    stage,
    stageAttachments,
    stageComments,
    verdicts,
  }
}) satisfies PageServerLoad

export const actions = {
  addComment: async ({ locals, params, request }) => {
    if (!hasAnyRole(locals.user?.role, ['admin', 'evaluator'])) {
      return error(403, 'No tienes permiso para realizar esta acción')
    }

    const { id: userId, role } = locals.user ?? {}
    if (!userId) return error(401, 'No autenticado')

    const stageOrder = Number(params.stageOrder)
    if (isNaN(stageOrder)) return error(400, 'Etapa no válida')

    const form = await superValidate(request, zod4(addCommentSchema))
    if (!form.valid) return fail(400, { addCommentForm: form })

    const stage = await db.query.stages.findFirst({
      columns: { id: true },
      where: (s, { eq }) => eq(s.order, stageOrder),
    })
    if (!stage) return error(404, 'La etapa no existe')

    // Verify the (project, stage) junction row exists
    const stageProject = await db.query.stagesProjects.findFirst({
      columns: { projectId: true },
      where: (sp, { and, eq }) =>
        and(eq(sp.stageId, stage.id), eq(sp.projectId, form.data.projectId)),
    })
    if (!stageProject) return error(404, 'El proyecto no pertenece a esta etapa')

    // Verify evaluator assignment
    const isAdmin = hasRole(role, 'admin')
    if (!isAdmin && userId) {
      const isAssigned = await db.query.stagesEvaluators.findFirst({
        columns: { stageId: true },
        where: (se, { and, eq }) => and(eq(se.stageId, stage.id), eq(se.userId, userId)),
      })
      if (!isAssigned) return error(403, 'No tienes permiso para evaluar esta etapa')
    }

    const { error: insertError } = await dbTry(() =>
      db.insert(comments).values({
        authorId: userId,
        content: form.data.content,
        projectId: form.data.projectId,
        stageId: stage.id,
      }),
    )

    if (insertError) {
      if (insertError.kind === 'unknown') console.error('[addComment]', insertError.cause)
      return message(
        form,
        { text: 'Error al guardar el comentario.', type: 'error' },
        { status: 500 },
      )
    }

    return message(form, { text: 'Comentario agregado.', type: 'success' })
  },

  deleteComment: async ({ locals, request }) => {
    if (!hasAnyRole(locals.user?.role, ['admin', 'evaluator'])) {
      return error(403, 'No tienes permiso para realizar esta acción')
    }

    const { id: userId } = locals.user ?? {}
    if (!userId) return error(401, 'No autenticado')

    const form = await superValidate(request, zod4(deleteCommentSchema))
    if (!form.valid) return fail(400, { deleteCommentForm: form })

    const comment = await db.query.comments.findFirst({
      columns: { authorId: true, id: true },
      where: (c, { eq }) => eq(c.id, form.data.commentId),
    })
    if (!comment) return error(404, 'Comentario no encontrado')
    if (comment.authorId !== userId) return error(403, 'No puedes eliminar este comentario')

    const { error: deleteError } = await dbTry(() =>
      db.delete(comments).where(eq(comments.id, form.data.commentId)),
    )

    if (deleteError) {
      if (deleteError.kind === 'unknown') console.error('[deleteComment]', deleteError.cause)
      return message(
        form,
        { text: 'Error al eliminar el comentario.', type: 'error' },
        { status: 500 },
      )
    }

    return message(form, { text: 'Comentario eliminado.', type: 'success' })
  },

  editComment: async ({ locals, request }) => {
    if (!hasAnyRole(locals.user?.role, ['admin', 'evaluator'])) {
      return error(403, 'No tienes permiso para realizar esta acción')
    }

    const { id: userId } = locals.user ?? {}
    if (!userId) return error(401, 'No autenticado')

    const form = await superValidate(request, zod4(editCommentSchema))
    if (!form.valid) return fail(400, { editCommentForm: form })

    const comment = await db.query.comments.findFirst({
      columns: { authorId: true, id: true },
      where: (c, { eq }) => eq(c.id, form.data.commentId),
    })
    if (!comment) return error(404, 'Comentario no encontrado')
    if (comment.authorId !== userId) return error(403, 'No puedes editar este comentario')

    const { error: updateError } = await dbTry(() =>
      db
        .update(comments)
        .set({ content: form.data.content })
        .where(and(eq(comments.id, form.data.commentId), eq(comments.authorId, userId))),
    )

    if (updateError) {
      if (updateError.kind === 'unknown') console.error('[editComment]', updateError.cause)
      return message(
        form,
        { text: 'Error al actualizar el comentario.', type: 'error' },
        { status: 500 },
      )
    }

    return message(form, { text: 'Comentario actualizado.', type: 'success' })
  },

  grade: async ({ locals, params, request }) => {
    if (!hasAnyRole(locals.user?.role, ['admin', 'evaluator'])) {
      return error(403, 'No tienes permiso para realizar esta acción')
    }

    const { id: userId, role } = locals.user ?? {}
    const stageOrder = Number(params.stageOrder)
    if (isNaN(stageOrder)) {
      return error(400, 'Etapa no válida')
    }

    const stage = await db.query.stages.findFirst({
      columns: { id: true },
      where: (s, { eq }) => eq(s.order, stageOrder),
    })

    if (!stage) {
      return error(404, 'La etapa no existe')
    }

    const isAdmin = hasRole(role, 'admin')
    const isEvaluator = hasRole(role, 'evaluator')

    if (!isAdmin && isEvaluator && userId) {
      const isAssigned = await db.query.stagesEvaluators.findFirst({
        columns: { stageId: true },
        where: (se, { and, eq }) => and(eq(se.stageId, stage.id), eq(se.userId, userId)),
      })
      if (!isAssigned) {
        return error(403, 'No tienes permiso para evaluar esta etapa')
      }
    }

    const form = await superValidate(request, zod4(gradeStageSchema))
    if (!form.valid) return fail(400, { form })

    const verdict = resultToVerdict(form.data.result)
    const { error: upsertError } = await dbTry(() =>
      db
        .insert(stagesProjects)
        .values({
          projectId: form.data.projectId,
          stageId: stage.id,
          verdict,
        })
        .onConflictDoUpdate({
          set: { verdict },
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
