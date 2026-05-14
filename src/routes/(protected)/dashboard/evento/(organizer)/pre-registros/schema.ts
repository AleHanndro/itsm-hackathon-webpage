import { z } from '$lib/z'

export const STATUS_OPTIONS = [
  'todos',
  'pendiente',
  'verificado',
  'rechazado',
  'reclamado',
] as const
export type StatusFilter = (typeof STATUS_OPTIONS)[number]

export const bulkActionSchema = z.object({
  ids: z.array(z.number().positive()).min(1, 'Debes seleccionar al menos un elemento.'),
})

export const searchParamsSchema = z.object({
  page: z.coerce.number().catch(() => 1),
  pageSize: z.coerce.number().catch(() => 10),
  status: z.enum(STATUS_OPTIONS).catch(() => 'pendiente' as StatusFilter),
})

export type BulkActionSchema = typeof bulkActionSchema
