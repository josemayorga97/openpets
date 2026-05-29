import { Hono } from 'hono'
import type { AppEnv } from './env'
import { petsRouter } from './routes/pets'
import { sheltersRouter } from './routes/shelters'
import { applicationsRouter } from './routes/applications'
import { sponsorshipsRouter } from './routes/sponsorships'
import { usersRouter } from './routes/users'
import { meRouter } from './routes/me'
import { adminRouter } from './routes/admin'

const routes = new Hono<AppEnv>()
  .route('/pets', petsRouter)
  .route('/shelters', sheltersRouter)
  .route('/applications', applicationsRouter)
  .route('/sponsorships', sponsorshipsRouter)
  .route('/users', usersRouter)
  .route('/me', meRouter)
  .route('/admin', adminRouter)

export type AppType = typeof routes
