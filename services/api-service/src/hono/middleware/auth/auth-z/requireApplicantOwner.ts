import { createMiddleware } from 'hono/factory'
import type { AppEnv } from '../../../env'

export const requireApplicantOwner = createMiddleware<AppEnv>(async (c, next) => {

  await next()
})
