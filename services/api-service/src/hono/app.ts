import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { getAuth, type Auth } from '@repo/data-utils/auth'
import { petsRouter } from './routes/pets'
import { sheltersRouter } from './routes/shelters'
import { applicationsRouter } from './routes/applications'
import { sponsorshipsRouter } from './routes/sponsorships'
import { usersRouter } from './routes/users'
import { meRouter } from './routes/me'
import { adminRouter } from './routes/admin'
import type { AppEnv } from './env'
import { initDatabase } from '@repo/data-utils/database'
import { requestId } from 'hono/request-id'
import { loggerMiddleware } from './middleware/logger'
import { createLogger } from './logger/logger'

type FullEnv = {
  Bindings: Env
  Variables: AppEnv['Variables'] & { auth: Auth }
}

export const App = new Hono<FullEnv>();
App.use("*", requestId());
App.use("*", cors());
// After requestId() (the logger binds it) and before initDatabase so DB-init
// failures are still captured by the request.end `finally` + onError.
App.use("*", loggerMiddleware);
App.use("*", async (c, next) => {
  initDatabase(c.env.DB);
  await next();
});

App.on(["POST", "GET"], "/api/auth/*", (c) => {
  const auth = getAuth(c.env);
  return auth.handler(c.req.raw);
});

App.route('/pets', petsRouter)
  .route('/shelters', sheltersRouter)
  .route('/applications', applicationsRouter)
  .route('/sponsorships', sponsorshipsRouter)
  .route('/users', usersRouter)
  .route('/me', meRouter)
  .route('/admin', adminRouter)

// Standardize the 500 body and guarantee a structured, requestId-correlated
// error line. Fall back to a fresh logger for errors thrown before (or in)
// loggerMiddleware, where c.var.logger isn't set yet.
App.onError((err, c) => {
  const logger =
    c.var.logger ??
    createLogger(c.env.LOG_LEVEL, { requestId: c.get('requestId') })
  // message/name only — never the raw error object (it may carry PII/secrets).
  logger.error('unhandled_error', {
    method: c.req.method,
    path: c.req.path,
    error: err instanceof Error ? err.message : String(err),
    name: err instanceof Error ? err.name : undefined,
  })
  return c.json({ error: 'internal_error' }, 500)
})

export type { AppType } from './app-type'
