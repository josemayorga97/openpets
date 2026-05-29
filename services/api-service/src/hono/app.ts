import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { createAuth, type Auth } from '@repo/data-utils/auth'
import { petsRouter } from './routes/pets'
import { sheltersRouter } from './routes/shelters'
import { applicationsRouter } from './routes/applications'
import { sponsorshipsRouter } from './routes/sponsorships'
import { usersRouter } from './routes/users'
import { meRouter } from './routes/me'
import { adminRouter } from './routes/admin'
import type { AppEnv } from './env'

type FullEnv = {
  Bindings: Env
  Variables: AppEnv['Variables'] & { auth: Auth }
}

export const App = new Hono<FullEnv>();


App.use('*', async (c, next) => {
  c.set('auth', createAuth(c.env))
  await next()
})

// CORS for /api/auth/* must consult the same TRUSTED_ORIGINS list that
// Better Auth itself uses, so a misconfigured env can't widen CORS by
// accident. We do NOT echo arbitrary origins back.
App.use('/api/auth/*', async (c, next) => {
  const trusted = c.env.TRUSTED_ORIGINS.split(',').map((o: string) => o.trim())
  const handler = cors({
    origin: (origin) => (trusted.includes(origin) ? origin : null),
    allowHeaders: ['Content-Type', 'Authorization'],
    allowMethods: ['POST', 'GET', 'OPTIONS'],
    credentials: true,
  })
  return handler(c, next)
})

App.on(['POST', 'GET'], '/api/auth/*', (c) => {
  return c.get('auth').handler(c.req.raw)
})

App.route('/pets', petsRouter)
  .route('/shelters', sheltersRouter)
  .route('/applications', applicationsRouter)
  .route('/sponsorships', sponsorshipsRouter)
  .route('/users', usersRouter)
  .route('/me', meRouter)
  .route('/admin', adminRouter)

export type { AppType } from './app-type'
