import { createMiddleware } from 'hono/factory'
import type { AppEnv } from '../../../env'

export const requirePetOwner = createMiddleware<AppEnv>(async (c, next) => {
  await next()
})
