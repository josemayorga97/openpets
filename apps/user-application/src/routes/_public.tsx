import { Footer, TopNav } from '@repo/ui'
import { SignInDialog, signOut, useSession } from '@repo/auth'
import { Outlet, createFileRoute, useMatchRoute } from '@tanstack/react-router'
import * as React from 'react'

export const Route = createFileRoute('/_public')({
  component: PublicLayout,
})

function PublicLayout() {
  const session = useSession()
  const [signInOpen, setSignInOpen] = React.useState(false)
  const matchRoute = useMatchRoute()
  const onSearch = matchRoute({ to: '/search' })
  const onAbout = matchRoute({ to: '/about' })
  const onResources = matchRoute({ to: '/resources' })
  const activeKey = onSearch
    ? 'find'
    : onResources
      ? 'resources'
      : onAbout
        ? 'about'
        : undefined

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <TopNav
        activeKey={activeKey}
        user={session.user}
        onSignInClick={() => setSignInOpen(true)}
        onSignOut={() => void signOut()}
      />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <SignInDialog open={signInOpen} onOpenChange={setSignInOpen} />
    </div>
  )
}

export function useRequireAuthAction() {
  const session = useSession()
  const [signInOpen, setSignInOpen] = React.useState(false)
  const guard = React.useCallback(
    (fn: () => void) => {
      if (session.status === 'authed') {
        fn()
      } else {
        setSignInOpen(true)
      }
    },
    [session.status],
  )
  return { signInOpen, setSignInOpen, guard }
}
