import { projects } from '$lib/schema/projects'
import { stages, stagesProjects } from '$lib/schema/stages'
import { teams } from '$lib/schema/teams'
import { db } from '$lib/server/db/database'
import { dbTry } from '$lib/server/db/errors'
import { hasAnyRole } from '$lib/server/utils'
import { eq } from 'drizzle-orm'
import { fail, message, superValidate } from 'sveltekit-superforms'
import { zod4 } from 'sveltekit-superforms/adapters'

import type { Actions, PageServerLoad } from './$types'

import { createProjectSchema, deleteProjectSchema, updateProjectSchema } from './schema'

export const load = (async () => {
  const [createProjectForm, updateProjectForm] = await Promise.all([
    superValidate(zod4(createProjectSchema)),
    superValidate(zod4(updateProjectSchema)),
  ])

  const allProjects = await db.query.projects.findMany({
    with: {
      team: { columns: { id: true, name: true } },
    },
  })

  const availableTeams = await db.query.teams.findMany({
    columns: { id: true, name: true, projectId: true },
    where: (t, { notExists }) =>
      notExists(db.select().from(projects).where(eq(projects.id, t.projectId))),
  })

  return {
    createProjectForm,
    projects: allProjects,
    teams: availableTeams,
    updateProjectForm,
  }
}) satisfies PageServerLoad

export const actions = {
  createProject: async ({ locals, request }) => {
    if (!hasAnyRole(locals.user?.role, ['admin', 'organizer']))
      return fail(403, { message: 'No tienes permiso para realizar esta acción' })

    const form = await superValidate(request, zod4(createProjectSchema))
    if (!form.valid) return fail(400, { form })

    const { error: createError } = await dbTry(() =>
      db.transaction(async (tx) => {
        const [project] = await tx
          .insert(projects)
          .values({
            description: form.data.description || null,
            name: form.data.name,
          })
          .returning({ id: projects.id })

        const allStages = await tx.select({ id: stages.id }).from(stages)
        if (allStages.length > 0) {
          await tx.insert(stagesProjects).values(
            allStages.map((stage) => ({
              projectId: project.id,
              stageId: stage.id,
            })),
          )
        }

        if (form.data.teamId) {
          await tx
            .update(teams)
            .set({ projectId: project.id })
            .where(eq(teams.id, form.data.teamId))
        }
      }),
    )

    if (createError) {
      if (createError.kind === 'unknown') {
        console.error('[createProject]', createError.cause)
      } else {
        console.error('[createProject]', createError)
      }
      return message(
        form,
        { text: 'Error inesperado al crear el proyecto.', type: 'error' },
        { status: 500 },
      )
    }

    return message(form, { text: 'Proyecto creado exitosamente', type: 'success' })
  },
  deleteProject: async ({ locals, request }) => {
    if (!hasAnyRole(locals.user?.role, ['admin', 'organizer']))
      return fail(403, { message: 'No tienes permiso para realizar esta acción' })

    const form = await superValidate(request, zod4(deleteProjectSchema))
    if (!form.valid) return fail(400, { form })

    const { error: deleteError } = await dbTry(() =>
      db.delete(projects).where(eq(projects.id, form.data.projectId)),
    )

    if (deleteError) {
      if (deleteError.kind === 'unknown') {
        console.error('[deleteProject]', deleteError.cause)
      } else {
        console.error('[deleteProject]', deleteError)
      }
      return message(
        form,
        { text: 'Error inesperado al eliminar el proyecto.', type: 'error' },
        { status: 500 },
      )
    }

    return message(form, { text: 'Proyecto eliminado exitosamente', type: 'success' })
  },
  updateProject: async ({ locals, request }) => {
    if (!hasAnyRole(locals.user?.role, ['admin', 'organizer']))
      return fail(403, { message: 'No tienes permiso para realizar esta acción' })

    const form = await superValidate(request, zod4(updateProjectSchema))
    if (!form.valid) return fail(400, { form })

    const { error: updateError } = await dbTry(() =>
      db.transaction(async (tx) => {
        await tx
          .update(projects)
          .set({
            description: form.data.description || null,
            name: form.data.name,
          })
          .where(eq(projects.id, form.data.projectId))

        // First, unlink any team currently linked to this project
        await tx
          .update(teams)
          .set({ projectId: null })
          .where(eq(teams.projectId, form.data.projectId))

        // Then link the new team if provided
        if (form.data.teamId) {
          await tx
            .update(teams)
            .set({ projectId: form.data.projectId })
            .where(eq(teams.id, form.data.teamId))
        }
      }),
    )

    if (updateError) {
      if (updateError.kind === 'unknown') {
        console.error('[updateProject]', updateError.cause)
      } else {
        console.error('[updateProject]', updateError)
      }
      return message(
        form,
        { text: 'Error inesperado al actualizar el proyecto.', type: 'error' },
        { status: 500 },
      )
    }

    return message(form, { text: 'Proyecto actualizado exitosamente', type: 'success' })
  },
} satisfies Actions
