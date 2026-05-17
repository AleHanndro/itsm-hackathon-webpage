import { db } from '$lib/server/db/database'
import { error, redirect } from '@sveltejs/kit'

import type { Actions, PageServerLoad } from './$types'

export const load = (async ({ locals, params, parent }) => {
  const { user } = locals
  if (!user) {
    redirect(302, '/login')
  }

  const parentData = await parent()
  if (!parentData.eventStarted) {
    redirect(302, '/dashboard')
  }

  const stageOrder = parseInt(params.stageOrder, 10)
  if (isNaN(stageOrder)) {
    error(404, 'Etapa no encontrada')
  }

  const userTeam = await db.query.teamsUsers.findFirst({
    where: (t, { eq }) => eq(t.userId, user.id),
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
                        columns: { image: true, name: true },
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
  })

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
    isLeader,
    score: currentStageProject.score,
    stage: currentStageProject.stage,
  }
}) satisfies PageServerLoad

export const actions: Actions = {
  default: async ({ locals, request }) => {
    const { user } = locals
    if (!user) {
      error(401, 'Unauthorized')
    }

    const userTeam = await db.query.teamsUsers.findFirst({
      where: (t, { eq }) => eq(t.userId, user.id),
    })

    if (!userTeam || !userTeam.roles.includes('leader')) {
      error(403, 'Solo el líder del equipo puede enviar archivos')
    }

    const formData = await request.formData()
    const file = formData.get('file') as File | null

    if (!file || file.size === 0) {
      return { message: 'No se ha subido ningún archivo', success: false }
    }

    console.log('[STAGE SUBMISSION] File received:')
    console.log(`- File Name: ${file.name}`)
    console.log(`- File Type: ${file.type}`)
    console.log(`- File Size: ${file.size} bytes`)

    return { message: 'Archivo enviado correctamente', success: true }
  },
}
