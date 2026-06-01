import { createMiddleware } from 'hono/factory'
import type { AppEnv } from '../../../env'
import { pickSafe } from '../../../logger/logger'

type Role = 'admin' | 'shelter' | 'user'

export function requireRole(role: Role) {
  return createMiddleware<AppEnv>(async (c, next) => {
    const logger = c.var.logger

    // All three lines share `event`, `requiredRole` and `outcome` so a single
    // query can slice the access log: outcome=denied for rejected requests,
    // requiredRole=admin for admin-gated routes, reason=* for the denial cause.
    const base = {
      event: 'authz.role_check',
      requiredRole: role,
      ...pickSafe(c.var.user),
    }

    const roleFromSession = c.var.user?.role
    if (!roleFromSession) {
      logger.warn('authz.role_check', {
        ...base,
        outcome: 'denied',
        reason: 'no_role',
      })
      return c.json({ error: 'forbidden' }, 403)
    }

    if (!roleFromSession.match(role)) {
      logger.warn('authz.role_check', {
        ...base,
        outcome: 'denied',
        reason: 'role_mismatch',
      })
      return c.json({ error: 'forbidden' }, 403)
    }

    logger.info('authz.role_check', { ...base, outcome: 'granted' })
    await next()
  })
}
