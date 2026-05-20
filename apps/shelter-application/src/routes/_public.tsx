import { Outlet, createFileRoute, redirect } from '@tanstack/react-router'
import { sessionStore } from '@repo/auth'

export const Route = createFileRoute('/_public')({
  beforeLoad: ({ location }) => {
    const session = sessionStore.getSnapshot()
    if (
      session.status === 'authed' &&
      (location.pathname === '/' || location.pathname === '')
    ) {
      throw redirect({ to: '/dashboard' })
    }
  },
  component: PublicLayout,
})

function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-on-background">
      <Outlet />
    </div>
  )
}
