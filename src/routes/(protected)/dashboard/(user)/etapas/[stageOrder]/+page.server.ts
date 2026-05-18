import { db } from '$lib/server/db/database'
import { error } from '@sveltejs/kit'
import { fail, message, superValidate } from 'sveltekit-superforms'
import { zod4 } from 'sveltekit-superforms/adapters'

import type { Actions, PageServerLoad } from './$types'

import { clientAttachmentsSchema, serverAttachmentsSchema } from '../schema'

export const load = (async ({ locals, params }) => {
  const stageOrder = Number.parseInt(params.stageOrder, 10)
  if (Number.isNaN(stageOrder)) return error(404, 'Etapa no encontrada')

  const [form, userTeam] = await Promise.all([
    superValidate(zod4(clientAttachmentsSchema, { defaults: { attachments: [null] } })),
    db.query.teamsUsers.findFirst({
      where: (t, { eq }) => eq(t.userId, locals.user?.id as string),
      with: {
        team: {
          with: {
            project: {
              with: {
                stagesProjects: {
                  with: {
                    comments: {
                      with: {
                        author: {
                          columns: { name: true },
                        },
                      },
                    },
                    stage: true,
                  },
                },
              },
            },
          },
        },
      },
    }),
  ])

  if (!userTeam || !userTeam.team || !userTeam.team.project) {
    error(403, 'No tienes un proyecto asignado')
  }

  const isLeader = userTeam.roles.includes('leader')

  const currentStageProject = userTeam.team.project.stagesProjects.find(
    (sp) => sp.stage.order === stageOrder,
  )

  if (!currentStageProject) {
    error(404, 'Etapa no encontrada para tu proyecto')
  }

  return {
    comments: currentStageProject.comments,
    form,
    isLeader,
    score: currentStageProject.score,
    stage: currentStageProject.stage,
  }
}) satisfies PageServerLoad

export const actions: Actions = {
  default: async ({ locals, request }) => {
    const form = await superValidate(await request.formData(), zod4(serverAttachmentsSchema))
    if (!form.valid) return fail(400, { form })

    const userTeam = await db.query.teamsUsers.findFirst({
      where: (t, { eq }) => eq(t.userId, locals.user?.id as string),
    })

    if (!userTeam || !userTeam.roles.includes('leader')) {
      error(403, 'Solo el líder del equipo puede enviar archivos')
    }

    console.log(form.data.attachments.map((f) => f.name))

    return message(form, { text: 'Archivo enviado correctamente', type: 'error' })
  },
}
