import { createApiClient } from '@repo/api-client'

const USE_MOCKS = true

export const api = createApiClient(
  USE_MOCKS ? { mode: 'mock' } : { mode: 'http', baseUrl: '/api' },
)
