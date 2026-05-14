import { teams, teamsUsers } from '$lib/schema/teams'
import { db } from '$lib/server/db/database'
import { dbTry } from '$lib/server/db/errors'
import { hasAnyRole } from '$lib/server/utils'
import { and, count, eq } from 'drizzle-orm'
import { fail, message, setError, superValidate } from 'sveltekit-superforms'
import { zod4 } from 'sveltekit-superforms/adapters'

import type { Actions, PageServerLoad } from './$types'

import {
  addMemberSchema,
  createTeamSchema,
  deleteTeamSchema,
  removeMemberSchema,
  renameTeamSchema,
} from './schema'

export const load = (async () => {
  const [createTeamForm, addMemberForm, renameTeamForm] = await Promise.all([
    superValidate(zod4(createTeamSchema)),
    superValidate(zod4(addMemberSchema)),
    superValidate(zod4(renameTeamSchema)),
  ])
  const availableUsers = await db.query.users.findMany({
    columns: { email: true, id: true, name: true },
    where: (t, { and, eq, notExists }) =>
      and(
        eq(t.role, 'user'),
        notExists(db.select().from(teamsUsers).where(eq(teamsUsers.userId, t.id))),
      ),
  })
  const teams = await db.query.teams.findMany({
    columns: { id: true, leaderId: true, name: true },
    with: {
      members: {
        columns: {},
        with: {
          user: {
            columns: { email: true, id: true, name: true },
          },
        },
      },
    },
  })

  return {
    addMemberForm,
    createTeamForm,
    renameTeamForm,
    teams,
    users: availableUsers,
  }
}) satisfies PageServerLoad

export const actions = {
  addMember: async ({ locals, request }) => {
    if (!hasAnyRole(locals.user?.role, ['admin', 'organizer']))
      return fail(403, { message: 'No tienes permiso para realizar esta acción' })

    const form = await superValidate(request, zod4(addMemberSchema))
    if (!form.valid) return fail(400, { form })

    const existingUser = await db.query.teamsUsers.findFirst({
      where: (t, { eq }) => eq(t.userId, form.data.userId),
    })
    if (existingUser) return setError(form, 'userId', 'Este usuario ya fue asignado a un equipo.')

    const [teamMembers] = await db
      .select({ count: count() })
      .from(teamsUsers)
      .where(eq(teamsUsers.teamId, form.data.teamId))

    if (teamMembers.count >= 5)
      return message(form, { text: 'Este equipo ya está lleno', type: 'error' }, { status: 400 })

    const { error: addError } = await dbTry(() =>
      db.insert(teamsUsers).values({
        teamId: form.data.teamId,
        userId: form.data.userId,
      }),
    )

    if (addError) {
      switch (addError.kind) {
        case 'foreign_key':
          return setError(form, 'teamId', 'El equipo seleccionado no existe.')
        case 'unique_violation':
          return setError(form, 'userId', 'Este usuario ya pertenece a un equipo.')

        case 'unknown':
          console.error('[addMember]', addError.cause)
          return message(
            form,
            { text: 'Error inesperado al agregar el miembro.', type: 'error' },
            { status: 500 },
          )
      }
    }

    return message(form, { text: 'Miembro agregado exitosamente', type: 'success' })
  },
  create: async ({ locals, request }) => {
    if (!hasAnyRole(locals.user?.role, ['admin', 'organizer']))
      return fail(403, { message: 'No tienes permiso para realizar esta acción' })

    const form = await superValidate(request, zod4(createTeamSchema))
    if (!form.valid) return fail(400, { form })

    const existingLeader = await db.query.teamsUsers.findFirst({
      where: (t, { eq }) => eq(t.userId, form.data.leadMemberId),
    })
    if (existingLeader)
      return setError(form, 'leadMemberId', 'Este usuario ya fue asignado a un equipo.')

    const { error: createError } = await dbTry(() =>
      db.transaction(async (tx) => {
        const [team] = await tx
          .insert(teams)
          .values({
            leaderId: form.data.leadMemberId,
            name: form.data.name,
          })
          .returning({ id: teams.id })
        await tx.insert(teamsUsers).values({
          teamId: team.id,
          userId: form.data.leadMemberId,
        })
      }),
    )

    if (createError) {
      switch (createError.kind) {
        case 'foreign_key':
          return setError(form, 'leadMemberId', 'El usuario seleccionado no existe.')
        case 'unique_violation':
          return setError(form, 'name', 'Ya existe un equipo con ese nombre.')

        case 'unknown':
          console.error('[createTeam]', createError.cause)
          return message(
            form,
            { text: 'Error inesperado al crear el equipo.', type: 'error' },
            { status: 500 },
          )
      }
    }

    return message(form, { text: 'Equipo creado exitosamente', type: 'success' })
  },
  deleteTeam: async ({ locals, request }) => {
    if (!hasAnyRole(locals.user?.role, ['admin', 'organizer']))
      return fail(403, { message: 'No tienes permiso para realizar esta acción' })

    const form = await superValidate(request, zod4(deleteTeamSchema))
    if (!form.valid) return fail(400, { form })

    const { error: deleteError } = await dbTry(() =>
      db.delete(teams).where(eq(teams.id, form.data.teamId)),
    )

    if (deleteError && deleteError.kind === 'unknown') {
      console.error('[deleteTeam]', deleteError.cause)
      return message(
        form,
        { text: 'Error inesperado al eliminar el equipo.', type: 'error' },
        { status: 500 },
      )
    }

    return message(form, { text: 'Equipo eliminado exitosamente', type: 'success' })
  },
  removeMember: async ({ locals, request }) => {
    if (!hasAnyRole(locals.user?.role, ['admin', 'organizer']))
      return fail(403, { message: 'No tienes permiso para realizar esta acción' })

    const form = await superValidate(request, zod4(removeMemberSchema))
    if (!form.valid) return fail(400, { form })

    const team = await db.query.teams.findFirst({
      where: (t, { eq }) => eq(t.id, form.data.teamId),
    })

    if (team?.leaderId === form.data.userId) {
      return message(
        form,
        { text: 'No puedes remover al líder. Cambia de líder o elimina el equipo.', type: 'error' },
        { status: 400 },
      )
    }

    const { error: removeError } = await dbTry(() =>
      db
        .delete(teamsUsers)
        .where(
          and(eq(teamsUsers.teamId, form.data.teamId), eq(teamsUsers.userId, form.data.userId)),
        ),
    )

    if (removeError && removeError.kind === 'unknown') {
      console.error('[removeMember]', removeError.cause)
      return message(
        form,
        { text: 'Error inesperado al remover el miembro.', type: 'error' },
        { status: 500 },
      )
    }

    return message(form, { text: 'Miembro removido exitosamente', type: 'success' })
  },
  renameTeam: async ({ locals, request }) => {
    if (!hasAnyRole(locals.user?.role, ['admin', 'organizer']))
      return fail(403, { message: 'No tienes permiso para realizar esta acción' })

    const form = await superValidate(request, zod4(renameTeamSchema))
    if (!form.valid) return fail(400, { form })

    const { error: renameError } = await dbTry(() =>
      db.update(teams).set({ name: form.data.name }).where(eq(teams.id, form.data.teamId)),
    )

    if (renameError) {
      switch (renameError.kind) {
        case 'unique_violation':
          return setError(form, 'name', 'Ya existe un equipo con ese nombre.')

        case 'unknown':
          console.error('[renameTeam]', renameError.cause)
          return message(
            form,
            { text: 'Error inesperado al renombrar el equipo.', type: 'error' },
            { status: 500 },
          )
      }
    }

    return message(form, { text: 'Equipo renombrado exitosamente', type: 'success' })
  },
} satisfies Actions
