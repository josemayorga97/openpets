import { HttpClient } from './http'
import { MockClient } from './mock'
import type { ApiClient } from './types'

export type ApiClientOpts =
  | { mode: 'mock' }
  | { mode: 'http'; baseUrl: string; fetch?: typeof fetch }

export function createApiClient(opts: ApiClientOpts): ApiClient {
  if (opts.mode === 'mock') return new MockClient()
  return new HttpClient(opts)
}

export type { ApiClient } from './types'
