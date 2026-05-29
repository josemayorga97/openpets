import { createAccessControl } from 'better-auth/plugins/access'
import { defaultStatements, adminAc } from 'better-auth/plugins/admin/access'

// Three platform roles. Binding a `role = 'shelter'` session to a specific
const statement = {
  ...defaultStatements,
  petApplication: ['create', 'update', 'list', 'get']
} as const

export const ac = createAccessControl(statement)

// Full admin access — equivalent to the plugin's built-in admin role.
export const admin = ac.newRole({
  ...adminAc.statements,
})

// Shelter staff and regular users have no platform-level admin permissions.
// They are authorized via session + domain tables, not via the admin plugin.
export const shelter = ac.newRole({
  user:['list'],
  petApplication: statement['petApplication']
})
export const user = ac.newRole({})
