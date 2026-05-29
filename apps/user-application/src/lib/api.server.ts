import { env } from 'cloudflare:workers'
import { hc } from 'hono/client'
import type { AppType } from '@repo/api-service/app-type'
import { getRequestHeaders } from '@tanstack/react-start/server'

/**
 * Typed Hono RPC client for the api-service Worker, reached over the
 * `API_SERVICE` service binding (see wrangler.jsonc). The host in the URL is
 * arbitrary — the binding routes by Fetcher, not by hostname — so we use a
 * stable placeholder. The caller's cookie is forwarded so authenticated
 * endpoints see the session.
 */
export function makeApi() {
  const headers = getRequestHeaders()
  const cookie =
    (headers as unknown as { cookie?: string; get?: (k: string) => string | null })
      .cookie ??
    (typeof (headers as { get?: (k: string) => string | null }).get === 'function'
      ? (headers as { get: (k: string) => string | null }).get('cookie') ?? ''
      : '')

  return hc<AppType>('http://api-service', {
    fetch: (input: RequestInfo | URL, init?: RequestInit) =>
      env.API_SERVICE.fetch(input as Request, init),
    headers: { cookie },
  })
}
