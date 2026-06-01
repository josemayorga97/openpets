import { createMiddleware } from 'hono/factory'
import type { AppEnv } from '../env'
import { createLogger, pickSafe } from '../logger/logger'


export const loggerMiddleware = createMiddleware<AppEnv>(async (c, next) => {
  const requestId = c.get('requestId')
  const logger = createLogger(c.env.LOG_LEVEL, { requestId })
  c.set('logger', logger)

  const method = c.req.method
  const path = c.req.path
  const startedAt = Date.now()

  logger.debug('request.start', { method, path })

  // `finally` so the end-of-request line is emitted even when the handler
  // throws: on a rejected `next()` the global `onError` fills `c.res` (a 500)
  // before this middleware unwinds, so status/duration are still accurate.
  try {
    await next()
  } finally {
    const status = c.res.status
    const durationMs = Date.now() - startedAt
    const level = status >= 500 ? 'error' : status >= 400 ? 'warn' : 'info'

    logger[level]('request.end', {
      method,
      path,
      status,
      durationMs,
      ...pickSafe(c.var.user),
      ...(c.var.shelter ? { shelterId: c.var.shelter.id } : {}),
    })
  }
})
