import { preRegistrations } from '$lib/schema/pre-registrations'
import { db } from '$lib/server/db/database'
import { count, eq } from 'drizzle-orm'

import type { PageServerLoad } from './$types'

export const load = (async () => {
  // Aggregation 1: Status counts
  // Sequential awaits to be gentle on Supabase free-tier connections
  const statusCounts = await db
    .select({
      count: count(),
      status: preRegistrations.status,
    })
    .from(preRegistrations)
    .groupBy(preRegistrations.status)

  // Aggregation 2: Detailed academic breakdown with status
  const academicBreakdown = await db
    .select({
      count: count(),
      engineering: preRegistrations.engineering,
      group: preRegistrations.group,
      semester: preRegistrations.semester,
      status: preRegistrations.status,
    })
    .from(preRegistrations)
    .groupBy(
      preRegistrations.engineering,
      preRegistrations.semester,
      preRegistrations.group,
      preRegistrations.status,
    )

  // Aggregation 3: Shirt sizes for verified students
  const shirtSizeCounts = await db
    .select({
      count: count(),
      shirtSize: preRegistrations.shirtSize,
    })
    .from(preRegistrations)
    .where(eq(preRegistrations.status, 'verificado'))
    .groupBy(preRegistrations.shirtSize)

  return {
    academicBreakdown,
    shirtSizeCounts,
    statusCounts,
  }
}) satisfies PageServerLoad
