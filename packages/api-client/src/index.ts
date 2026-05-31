import { hc } from 'hono/client'
import type { InferResponseType } from 'hono/client'
import type { AppType } from '@repo/api-service/app-type'

/** The api-service service binding (a Cloudflare `Fetcher`), injected by the
 * calling Worker. Typed structurally so this package needs no Workers types. */
export interface ApiServiceBinding {
  fetch(input: Request, init?: RequestInit): Promise<Response>
}

export interface CreateApiClientOptions {
  /** The `API_SERVICE` binding from the calling Worker's `env`. */
  service: ApiServiceBinding
  /** Session cookie to forward so authenticated endpoints see the session. */
  cookie?: string
}

/**
 * Typed Hono RPC client for the api-service Worker, reached over the injected
 * `API_SERVICE` service binding. The stage (stage vs prod) is selected by
 * which Worker that binding points at in `wrangler.jsonc`, not by this URL —
 * the binding routes by Fetcher, not by hostname — so the host is a stable
 * placeholder. The binding is injected by the app (which owns it and the
 * Workers runtime) rather than imported from `cloudflare:workers` here, so
 * this package stays framework- and runtime-agnostic. The caller's session
 * cookie is forwarded (each app extracts it from its own request) because a
 * service-binding subrequest does not inherit the inbound request's headers.
 */
export function createApiClient({ service, cookie }: CreateApiClientOptions) {
  return hc<AppType>('http://api-service', {
    fetch: (input: RequestInfo | URL, init?: RequestInit) =>
      service.fetch(input as Request, init),
    headers: cookie ? { cookie } : undefined,
  })
}

export type ApiClient = ReturnType<typeof createApiClient>

// RPC-inferred response types — the single source of truth for the frontend
// pet shape and friends. A backend payload change breaks these (and every UI
// prop typed by them) at compile time.
export type PublicPet = InferResponseType<ApiClient['pets'][':id']['$get'], 200>
export type SearchResult = InferResponseType<
  ApiClient['pets']['search']['$get'],
  200
>
