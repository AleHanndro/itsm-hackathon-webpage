import { attachments } from '$lib/schema/stages'
import { db } from '$lib/server/db/database'
import { error, redirect } from '@sveltejs/kit'
import { eq } from 'drizzle-orm'

import type { RequestHandler } from './$types'

export const GET: RequestHandler = async ({ fetch, params }) => {
  const id = Number(params.id)
  if (Number.isNaN(id)) {
    return error(400, 'ID de archivo no válido')
  }

  const attachment = await db.query.attachments.findFirst({
    where: (a, { eq }) => eq(a.id, id),
  })

  if (!attachment) {
    return error(404, 'Archivo no encontrado o ya fue eliminado.')
  }

  try {
    // Perform a HEAD request to verify if the file still exists in the Supabase bucket
    const res = await fetch(attachment.fileUrl, { method: 'HEAD' })
    if (!res.ok) {
      // The file was deleted directly from the bucket (e.g. 404 or 400 error from Supabase API)
      await db.delete(attachments).where(eq(attachments.id, id))
      return error(
        404,
        'El archivo ya no existe en el servidor (fue eliminado manualmente). El registro ha sido limpiado.',
      )
    }
  } catch (err) {
    console.error('Error verifying attachment URL', err)
    // If it's a SvelteKit error (like the 404 above), rethrow it
    if (typeof err === 'object' && err !== null && 'status' in err) {
      throw err
    }
    return error(500, 'Error interno al verificar la disponibilidad del archivo.')
  }

  return redirect(302, attachment.fileUrl)
}
