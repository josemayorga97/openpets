import { createMiddleware } from 'hono/factory'
import type { AppEnv } from '../../../env'

type Role = 'admin' | 'shelter' | 'user'

export function requireRole(role: Role) {
  return createMiddleware<AppEnv>(async (c, next) => {
    await next()
  })
}
