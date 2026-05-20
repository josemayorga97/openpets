import * as React from 'react'
import { sessionStore, type SessionState } from './store'

export function useSession(): SessionState {
  return React.useSyncExternalStore(
    sessionStore.subscribe,
    sessionStore.getSnapshot,
    sessionStore.getServerSnapshot,
  )
}

export async function signIn(input: { email: string; name?: string }) {
  sessionStore.signIn(input)
}

export async function signOut() {
  sessionStore.signOut()
}
