import { createSchemaFactory } from 'drizzle-zod'
import { z } from 'zod'
import { es } from 'zod/locales'

z.config(es())

const { createInsertSchema, createSelectSchema, createUpdateSchema } = createSchemaFactory({
  zodInstance: z,
})

export { createInsertSchema, createSelectSchema, createUpdateSchema, z }
