import * as React from 'react'
import {
  Outlet,
  createFileRoute,
  useNavigate,
  useRouterState,
} from '@tanstack/react-router'
import { useSession } from '@repo/auth'

export const Route = createFileRoute('/_public')({
  component: PublicLayout,
})

function PublicLayout() {
  const session = useSession()
  const navigate = useNavigate()
  const pathname = useRouterState({ select: (s) => s.location.pathname })

  React.useEffect(() => {
    if (session.status === 'authed' && (pathname === '/' || pathname === '')) {
      void navigate({ to: '/dashboard' })
    }
  }, [session.status, pathname, navigate])

  return (
    <div className="min-h-screen flex flex-col bg-background text-on-background">
      <Outlet />
    </div>
  )
}
