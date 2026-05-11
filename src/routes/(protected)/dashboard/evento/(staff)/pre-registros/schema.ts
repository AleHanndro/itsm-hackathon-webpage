import { z } from '$lib/z'

export const bulkActionSchema = z.object({
  ids: z.array(z.number().positive()).min(1, 'Debes seleccionar al menos un elemento.'),
})

export const searchParamsSchema = z.object({
  page: z.coerce.number().catch(() => 1),
  pageSize: z.coerce.number().catch(() => 10),
})

export type BulkActionSchema = typeof bulkActionSchema
