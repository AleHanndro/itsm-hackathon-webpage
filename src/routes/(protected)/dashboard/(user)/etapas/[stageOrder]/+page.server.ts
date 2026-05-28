import { attachments } from '$lib/schema/stages'
import { db } from '$lib/server/db/database'
import { supabase } from '$lib/server/supabase'
import { error } from '@sveltejs/kit'
import { and, eq } from 'drizzle-orm'
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
                    attachments: true,
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
    return error(403, 'No tienes un proyecto asignado')
  }

  const isLeader = userTeam.roles.includes('leader')

  const currentStageProject = userTeam.team.project.stagesProjects.find(
    (sp) => sp.stage.order === stageOrder,
  )

  if (!currentStageProject) {
    return error(404, 'Etapa no encontrada para tu proyecto')
  }

  return {
    attachments: currentStageProject.attachments,
    comments: currentStageProject.comments,
    form,
    isLeader,
    stage: currentStageProject.stage,
    verdict: currentStageProject.verdict,
  }
}) satisfies PageServerLoad

export const actions: Actions = {
  default: async ({ locals, params, request }) => {
    const stageOrder = Number.parseInt(params.stageOrder, 10)
    if (Number.isNaN(stageOrder)) return error(404, 'Etapa no encontrada')

    const form = await superValidate(await request.formData(), zod4(serverAttachmentsSchema))
    if (!form.valid) return fail(400, { form })

    const userTeam = await db.query.teamsUsers.findFirst({
      where: (t, { eq }) => eq(t.userId, locals.user?.id as string),
      with: {
        team: {
          with: {
            project: {
              with: {
                stagesProjects: {
                  with: {
                    attachments: true,
                    stage: true,
                  },
                },
              },
            },
          },
        },
      },
    })

    if (!userTeam || !userTeam.roles.includes('leader')) {
      return error(403, 'Solo el líder del equipo puede enviar archivos')
    }

    if (!userTeam.team || !userTeam.team.project) {
      return error(403, 'No tienes un proyecto asignado')
    }

    const currentStageProject = userTeam.team.project.stagesProjects.find(
      (sp) => sp.stage.order === stageOrder,
    )

    if (!currentStageProject) {
      return error(404, 'Etapa no encontrada para tu proyecto')
    }

    const projectId = currentStageProject.projectId
    const stageId = currentStageProject.stageId

    // Delete old files from Supabase Storage
    const { data: list } = await supabase.storage
      .from('attachments')
      .list(`${projectId}/${stageId}`)
    if (list && list.length > 0) {
      const filesToRemove = list.map((x) => `${projectId}/${stageId}/${x.name}`)
      await supabase.storage.from('attachments').remove(filesToRemove)
    }

    // Delete from DB
    await db
      .delete(attachments)
      .where(and(eq(attachments.projectId, projectId), eq(attachments.stageId, stageId)))

    // Upload new files
    const uploadedAttachments = []

    for (const file of form.data.attachments) {
      const uniqueName = crypto.randomUUID() + '-' + file.name
      const path = `${projectId}/${stageId}/${uniqueName}`

      const { error: uploadError } = await supabase.storage.from('attachments').upload(path, file)

      if (uploadError) {
        console.error('Upload Error:', uploadError)
        return message(form, { text: 'Error al subir el archivo', type: 'error' })
      }

      const {
        data: { publicUrl },
      } = supabase.storage.from('attachments').getPublicUrl(path)

      uploadedAttachments.push({
        fileName: file.name,
        fileSize: file.size,
        fileUrl: publicUrl,
        mimeType: file.type,
        projectId,
        stageId,
        uploadedBy: locals.user?.id as string,
      })
    }

    if (uploadedAttachments.length > 0) {
      await db.insert(attachments).values(uploadedAttachments)
    }

    return message(form, { text: 'Archivos enviados correctamente', type: 'success' })
  },
}
