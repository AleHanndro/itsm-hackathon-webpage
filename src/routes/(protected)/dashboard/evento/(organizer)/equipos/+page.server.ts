import { teams, teamsUsers } from '$lib/schema/teams'
import { db } from '$lib/server/db/database'
import { dbTry } from '$lib/server/db/errors'
import { hasAnyRole } from '$lib/server/utils'
import { and, count, eq, sql } from 'drizzle-orm'
import { fail, message, setError, superValidate } from 'sveltekit-superforms'
import { zod4 } from 'sveltekit-superforms/adapters'

import type { Actions, PageServerLoad } from './$types'

import {
  addMemberSchema,
  createTeamSchema,
  deleteTeamSchema,
  editTeamSchema,
  removeMemberSchema,
} from './schema'

export const load = (async () => {
  const [createTeamForm, addMemberForm, editTeamForm] = await Promise.all([
    superValidate(zod4(createTeamSchema)),
    superValidate(zod4(addMemberSchema)),
    superValidate(zod4(editTeamSchema)),
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
    columns: { id: true, name: true, projectId: true },
    with: {
      members: {
        columns: { roles: true },
        with: {
          user: {
            columns: { email: true, id: true, name: true },
          },
        },
      },
      project: { columns: { id: true, name: true } },
    },
  })

  return {
    addMemberForm,
    createTeamForm,
    editTeamForm,
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
        roles: form.data.roles,
        teamId: form.data.teamId,
        userId: form.data.userId,
      }),
    )

    if (addError) {
      switch (addError.kind) {
        case 'foreign_key':
          return setError(form, 'teamId', 'El equipo seleccionado no existe.')
        case 'unique_violation':
          // Could be the composite PK (user already in team) or the one-leader index
          if (form.data.roles.includes('leader')) {
            return message(
              form,
              { text: 'Este equipo ya tiene un líder asignado.', type: 'error' },
              { status: 400 },
            )
          }
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

    const leadId = form.data.leadMemberId ?? null
    const isLeadIdValid = !!leadId && leadId.trim().length > 0

    if (isLeadIdValid) {
      const existingLeader = await db.query.teamsUsers.findFirst({
        where: (t, { eq }) => eq(t.userId, leadId),
      })
      if (existingLeader)
        return setError(form, 'leadMemberId', 'Este usuario ya fue asignado a un equipo.')
    }

    const { error: createError } = await dbTry(() =>
      db.transaction(async (tx) => {
        const [team] = await tx
          .insert(teams)
          .values({ name: form.data.name, projectId: null })
          .returning({ id: teams.id })

        if (isLeadIdValid) {
          await tx.insert(teamsUsers).values({
            roles: ['leader'],
            teamId: team.id,
            userId: leadId,
          })
        }
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
  editTeam: async ({ locals, request }) => {
    if (!hasAnyRole(locals.user?.role, ['admin', 'organizer']))
      return fail(403, { message: 'No tienes permiso para realizar esta acción' })

    const form = await superValidate(request, zod4(editTeamSchema))
    if (!form.valid) return fail(400, { form })

    const { leaderId, name, speakerId, teamId } = form.data

    const { error: editError } = await dbTry(() =>
      db.transaction(async (tx) => {
        // 1. Rename the team
        await tx.update(teams).set({ name }).where(eq(teams.id, teamId))

        // 2. Strip all leader/speaker roles from every member of this team
        await tx
          .update(teamsUsers)
          .set({ roles: sql`array_remove(array_remove(${teamsUsers.roles}, 'leader'), 'speaker')` })
          .where(eq(teamsUsers.teamId, teamId))

        // 3. Build the new role assignments: userId → roles[]
        const roleMap = new Map<string, string[]>()

        if (leaderId && leaderId.trim().length > 0) {
          roleMap.set(leaderId, ['leader'])
        }
        if (speakerId && speakerId.trim().length > 0) {
          const existing = roleMap.get(speakerId)
          if (existing) {
            existing.push('speaker')
          } else {
            roleMap.set(speakerId, ['speaker'])
          }
        }

        // 4. Apply new roles for each affected member
        for (const [userId, roles] of roleMap) {
          await tx
            .update(teamsUsers)
            .set({ roles })
            .where(and(eq(teamsUsers.teamId, teamId), eq(teamsUsers.userId, userId)))
        }
      }),
    )

    if (editError) {
      switch (editError.kind) {
        case 'unique_violation':
          return setError(form, 'name', 'Ya existe un equipo con ese nombre.')

        case 'unknown':
          console.error('[editTeam]', editError.cause)
          return message(
            form,
            { text: 'Error inesperado al editar el equipo.', type: 'error' },
            { status: 500 },
          )
      }
    }

    return message(form, { text: 'Equipo actualizado exitosamente', type: 'success' })
  },
  removeMember: async ({ locals, request }) => {
    if (!hasAnyRole(locals.user?.role, ['admin', 'organizer']))
      return fail(403, { message: 'No tienes permiso para realizar esta acción' })

    const form = await superValidate(request, zod4(removeMemberSchema))
    if (!form.valid) return fail(400, { form })

    const membership = await db.query.teamsUsers.findFirst({
      where: (t, { and, eq }) =>
        and(eq(t.teamId, form.data.teamId), eq(t.userId, form.data.userId)),
    })

    if (membership?.roles.includes('leader')) {
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
} satisfies Actions
