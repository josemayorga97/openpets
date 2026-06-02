import { getShelterForOperator } from '@repo/data-utils/queries/shelters'
import { createMiddleware } from 'hono/factory'
import type { AppEnv } from '../../../env'
import { pickSafe } from '../../../logger/logger'

export const requireMyShelter = createMiddleware<AppEnv>(async (c, next) => {
  const logger = c.var.logger

  const base = {
    event: 'authz.my_shelter_check',
    ...pickSafe(c.var.user),
  }

  const userId = c.var.user?.id
  if (!userId) {
    logger.warn('authz.my_shelter_check', {
      ...base,
      outcome: 'denied',
      reason: 'no_user',
    })
    return c.json({ error: 'forbidden' }, 403)
  }

  const row = await getShelterForOperator(userId)
  if (!row) {
    logger.warn('authz.my_shelter_check', {
      ...base,
      outcome: 'denied',
      reason: 'not_found',
    })
    return c.json({ error: 'not_found' }, 404)
  }

  c.set('shelter', { id: row.shelterId, status: row.shelterStatus })
  logger.info('authz.my_shelter_check', {
    ...base,
    shelterId: row.shelterId,
    shelterStatus: row.shelterStatus,
    outcome: 'granted',
  })
  await next()
})
