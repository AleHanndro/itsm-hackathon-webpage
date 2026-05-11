import { createAccessControl } from 'better-auth/plugins/access'
import { adminAc, defaultStatements, userAc } from 'better-auth/plugins/admin/access'

const statement = {
  ...defaultStatements,
  preRegistration: ['approve', 'deny', 'delete'],
} as const

export const ac = createAccessControl(statement)

export const admin = ac.newRole({
  preRegistration: ['approve', 'deny', 'delete'],
  ...adminAc.statements,
})

export const staff = ac.newRole({
  preRegistration: ['approve', 'deny'],
  ...adminAc.statements,
})

export const evaluator = ac.newRole({
  preRegistration: ['approve', 'deny'],
  ...adminAc.statements,
})

export const user = ac.newRole({
  ...userAc.statements,
})

// --- Roles ---
// admin: all permissions
// staff: only see and approve pre-register records (not delete them), see and modify (fix typos, etc) user info (not delete them), future: create and manage teams records, assign users to a team and manage them.
// evaluator: same as staff, but this would work when Implementing stages records, as only evaluators should can: grade each stage per team, leave comments as feedback
// user: users should can see their grade per stage with comments that evaluators leaves, and the ability to send attachments (in discussion) on each stage so the evaluators can grade it
