import { authClient } from './client'

export type SessionUser = {
  id: string
  name: string
  email: string
  role?: string | null
}
export type SessionState =
  | { user: null; status: 'guest' | 'loading' }
  | { user: SessionUser; status: 'authed' }

/**
 * Reads the real Better Auth session (proxied to the api-service) and maps it to
 * the `{ user, status }` shape the apps consume.
 */
export function useSession(): SessionState {
  const { data, isPending } = authClient.useSession()
  if (isPending) return { user: null, status: 'loading' }
  if (!data) return { user: null, status: 'guest' }
  return { user: data.user as SessionUser, status: 'authed' }
}

/**
 * Start the Google OAuth flow. This performs a full-page redirect, returning to
 * `callbackURL` once the api-service completes the handshake.
 */
export async function signInWithGoogle(callbackURL = '/') {
  await authClient.signIn.social({ provider: 'google', callbackURL })
}

export async function signOut() {
  await authClient.signOut()
}
