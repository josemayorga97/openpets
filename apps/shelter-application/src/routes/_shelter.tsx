import * as React from 'react'
import {
  Outlet,
  createFileRoute,
  useNavigate,
  useRouterState,
} from '@tanstack/react-router'
import { useSession } from '@repo/auth'
import { MobileSidebar, Sidebar } from '../components/sidebar'
import { TopBar } from '../components/topbar'

export const Route = createFileRoute('/_shelter')({
  component: ShelterLayout,
})

function ShelterLayout() {
  const session = useSession()
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = React.useState(false)
  const pathname = useRouterState({ select: (s) => s.location.pathname })

  React.useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  React.useEffect(() => {
    if (session.status === 'guest') {
      void navigate({ to: '/' })
    }
  }, [session.status, navigate])

  if (session.status === 'loading') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="size-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    )
  }
  if (session.status !== 'authed') {
    return null
  }
  return (
    <div className="min-h-screen flex bg-background text-on-background">
      <Sidebar />
      <MobileSidebar open={mobileOpen} onClose={() => setMobileOpen(false)} />
      <div className="flex-1 md:ml-64 flex flex-col min-w-0">
        <TopBar onMenuClick={() => setMobileOpen(true)} />
        <main className="flex-1 p-container-margin md:p-section-padding max-w-[1280px] mx-auto w-full">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
