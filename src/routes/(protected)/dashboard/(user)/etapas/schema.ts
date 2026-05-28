import { z } from '$lib/z'

const MAX_FILE_SIZE = 50 * 1024 * 1024
const FileSchema = z
  .instanceof(File, { error: 'Por favor, selecciona un archivo.' })
  .refine((f) => f.size > 0, { error: 'El archivo no puede estar vacío.' })
  .refine((f) => f.size <= MAX_FILE_SIZE, { error: 'El archivo no puede ser mayor a 50MB.' })
const FileOrNull = z.union([FileSchema, z.literal(null)])

export const clientAttachmentsSchema = z.object({
  attachments: z
    .array(FileOrNull)
    .refine((arr) => arr.some((f) => f !== null), { error: 'Debes subir al menos 1 archivo.' })
    .refine(
      (files) => {
        const fileNames = files.map((f) => f?.name).filter(Boolean)
        return new Set(fileNames).size === fileNames.length
      },
      { error: 'No se puede subir el mismo archivo.' },
    ),
})

export const serverAttachmentsSchema = z.object({
  attachments: z
    .array(FileSchema)
    .min(1, 'Debes subir al menos 1 archivo.')
    .max(10, 'Solo se pueden subir hasta 10 archivos.'),
})

export type ClientAttachmentsSchema = typeof clientAttachmentsSchema
export type ServerAttachmentsSchema = typeof serverAttachmentsSchema
