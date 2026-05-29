// A tiny, dependency-free structured logger for Cloudflare Workers.
//
// Workers Logs (observability.enabled in wrangler.jsonc) extracts and indexes
// the fields of a logged *object* — so we always emit a single structured
// object, never an interpolated string. See:
// https://developers.cloudflare.com/workers/observability/logs/workers-logs/
//
// Privacy: this module only ever serialises the scalar fields callers pass in.
// Callers are responsible for never handing it tokens, cookies, request bodies,
// emails or names. `pickSafe` exists so the one structured value we do touch
// (the session user) is reduced to a non-PII shape at the boundary.

export type LogLevel = 'debug' | 'info' | 'warn' | 'error'

const LEVEL_WEIGHT: Record<LogLevel, number> = {
  debug: 10,
  info: 20,
  warn: 30,
  error: 40,
}

// console method per level. Workers routes each to the matching log level.
const LEVEL_CONSOLE: Record<LogLevel, (arg: unknown) => void> = {
  debug: (a) => console.debug(a),
  info: (a) => console.info(a),
  warn: (a) => console.warn(a),
  error: (a) => console.error(a),
}

export type Fields = Record<string, unknown>

export type Logger = {
  debug: (msg: string, fields?: Fields) => void
  info: (msg: string, fields?: Fields) => void
  warn: (msg: string, fields?: Fields) => void
  error: (msg: string, fields?: Fields) => void
  /** Returns a logger that merges `bound` into every line (e.g. a requestId). */
  child: (bound: Fields) => Logger
}

function normalizeLevel(level: string | undefined): LogLevel {
  switch (level) {
    case 'debug':
    case 'info':
    case 'warn':
    case 'error':
      return level
    default:
      return 'info'
  }
}

/**
 * Create a logger. Lines below `level` are dropped. `bound` fields are merged
 * into every emitted object (used to attach the requestId).
 */
export function createLogger(level?: string, bound: Fields = {}): Logger {
  const threshold = LEVEL_WEIGHT[normalizeLevel(level)]

  const emit = (lvl: LogLevel, msg: string, fields?: Fields) => {
    if (LEVEL_WEIGHT[lvl] < threshold) return
    LEVEL_CONSOLE[lvl]({ level: lvl, msg, ...bound, ...fields })
  }

  return {
    debug: (msg, fields) => emit('debug', msg, fields),
    info: (msg, fields) => emit('info', msg, fields),
    warn: (msg, fields) => emit('warn', msg, fields),
    error: (msg, fields) => emit('error', msg, fields),
    child: (extra) => createLogger(level, { ...bound, ...extra }),
  }
}

/**
 * Reduce a session user to a non-PII shape safe to log. Never returns email or
 * name. Accepts `unknown` so callers can pass `c.var.user` without casting.
 */
export function pickSafe(
  user: unknown,
): { userId: string; role?: string } | undefined {
  if (!user || typeof user !== 'object') return undefined
  const u = user as { id?: unknown; role?: unknown }
  if (typeof u.id !== 'string') return undefined
  return {
    userId: u.id,
    role: typeof u.role === 'string' ? u.role : undefined,
  }
}
