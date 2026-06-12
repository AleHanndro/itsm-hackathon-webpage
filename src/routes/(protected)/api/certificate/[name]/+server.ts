import { read } from '$app/server'
import template from '$lib/assets/certificado-reconocimiento.pdf'
import { error } from '@sveltejs/kit'
import { PDFDocument, TextAlignment } from 'pdf-lib'

import type { RequestHandler } from './$types'

const participantNameField = 'nombre_participante'

export const GET: RequestHandler = async ({ locals }) => {
  const participantName = locals.user?.name.trim()

  if (!participantName) {
    error(400, 'No se pudo generar el certificado para este usuario.')
  }

  const templateResponse = read(template)
  const templateBuffer = await templateResponse.arrayBuffer()
  const pdfDoc = await PDFDocument.load(templateBuffer)

  const form = pdfDoc.getForm()
  const field = form.getTextField(participantNameField)
  field.setText(participantName)
  field.setAlignment(TextAlignment.Center)
  field.setFontSize(24)
  form.flatten()

  const pdfBytes = await pdfDoc.save()
  const pdfBlob = new Blob([new Uint8Array(pdfBytes)], { type: 'application/pdf' })

  return new Response(pdfBlob, {
    headers: {
      'Cache-Control': 'private, no-store',
      'Content-Disposition': 'attachment; filename="certificado-participacion-hackaton-2026A.pdf"',
      'Content-Type': 'application/pdf',
    },
  })
}
