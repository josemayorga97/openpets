import { createMiddleware } from 'hono/factory'
import type { AppEnv } from '../../../env'
import { getAuth } from '@repo/data-utils/auth'

export const requireSession = createMiddleware<AppEnv>(async (c, next) => {
  const auth = getAuth(c.env);
  const session = await auth.api.getSession({ headers: c.req.raw.headers });
  if (!session?.user) return c.json({ error: 'unauthorized' }, 401);
  c.set("user", session.user);
  await next()
})
