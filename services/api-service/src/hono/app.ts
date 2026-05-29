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

type FullEnv = {
  Bindings: Env
  Variables: AppEnv['Variables'] & { auth: Auth }
}

export const App = new Hono<FullEnv>();

App.use("*", cors());
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

export type { AppType } from './app-type'
