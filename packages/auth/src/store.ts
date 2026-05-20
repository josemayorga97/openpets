export type SessionUser = { id: string; name: string; email: string }
export type SessionState =
  | { user: null; status: 'guest' | 'loading' }
  | { user: SessionUser; status: 'authed' }

const KEY = 'openpets.session'
const EVENT = 'openpets:session-change'

function read(): SessionUser | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = window.localStorage.getItem(KEY)
    if (!raw) return null
    return JSON.parse(raw) as SessionUser
  } catch {
    return null
  }
}

let cached: SessionState =
  typeof window === 'undefined'
    ? { user: null, status: 'loading' }
    : (() => {
        const u = read()
        return u
          ? { user: u, status: 'authed' as const }
          : { user: null, status: 'guest' as const }
      })()

function refresh() {
  const u = read()
  cached = u
    ? { user: u, status: 'authed' }
    : { user: null, status: 'guest' }
}

export const sessionStore = {
  getSnapshot(): SessionState {
    return cached
  },
  getServerSnapshot(): SessionState {
    return { user: null, status: 'loading' }
  },
  subscribe(cb: () => void) {
    if (typeof window === 'undefined') return () => {}
    const handler = () => {
      refresh()
      cb()
    }
    window.addEventListener('storage', handler)
    window.addEventListener(EVENT, handler)
    return () => {
      window.removeEventListener('storage', handler)
      window.removeEventListener(EVENT, handler)
    }
  },
  signIn(input: { email: string; name?: string }) {
    if (typeof window === 'undefined') return
    const user: SessionUser = {
      id: `user-${Date.now()}`,
      name: input.name?.trim() || input.email.split('@')[0] || 'Friend',
      email: input.email,
    }
    window.localStorage.setItem(KEY, JSON.stringify(user))
    refresh()
    window.dispatchEvent(new Event(EVENT))
  },
  signOut() {
    if (typeof window === 'undefined') return
    window.localStorage.removeItem(KEY)
    refresh()
    window.dispatchEvent(new Event(EVENT))
  },
}
