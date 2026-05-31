import { env } from 'cloudflare:workers'
import { createApiClient } from '@repo/api-client'
import { getRequestHeaders } from '@tanstack/react-start/server'

/**
 * Builds the typed Hono RPC client for the api-service Worker. This app owns
 * the `API_SERVICE` service binding (see wrangler.jsonc), so it injects that
 * binding into the client and forwards the caller's session cookie — extracted
 * from the current request — so authenticated endpoints see the session.
 */
export function makeApi() {
  const headers = getRequestHeaders()
  const cookie =
    (headers as unknown as { cookie?: string; get?: (k: string) => string | null })
      .cookie ??
    (typeof (headers as { get?: (k: string) => string | null }).get === 'function'
      ? (headers as { get: (k: string) => string | null }).get('cookie') ?? ''
      : '')

  return createApiClient({ service: env.API_SERVICE, cookie })
}
