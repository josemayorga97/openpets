import { getAdoptionApplication } from '@repo/data-utils/queries/applications'
import { createMiddleware } from 'hono/factory'
import type { AppEnv } from '../../../env'
import { pickSafe } from '../../../logger/logger'

export const requireApplicantOwner = createMiddleware<AppEnv>(async (c, next) => {
  const logger = c.var.logger
  const applicationId = c.req.param('id')

  const base = {
    event: 'authz.applicant_owner_check',
    applicationId,
    ...pickSafe(c.var.user),
  }

  if (!applicationId) {
    logger.warn('authz.applicant_owner_check', {
      ...base,
      outcome: 'denied',
      reason: 'missing_param',
    })
    return c.json({ error: 'forbidden' }, 403)
  }

  const userId = c.var.user?.id
  if (!userId) {
    logger.warn('authz.applicant_owner_check', {
      ...base,
      outcome: 'denied',
      reason: 'no_user',
    })
    return c.json({ error: 'forbidden' }, 403)
  }

  const row = await getAdoptionApplication(applicationId)
  if (!row) {
    logger.warn('authz.applicant_owner_check', {
      ...base,
      outcome: 'denied',
      reason: 'not_found',
    })
    return c.json({ error: 'forbidden' }, 403)
  }

  if (row.applicantId !== userId) {
    logger.warn('authz.applicant_owner_check', {
      ...base,
      outcome: 'denied',
      reason: 'not_owner',
    })
    return c.json({ error: 'forbidden' }, 403)
  }

  c.set('application', row)
  logger.info('authz.applicant_owner_check', { ...base, outcome: 'granted' })
  await next()
})
