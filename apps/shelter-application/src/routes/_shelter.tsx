import * as React from 'react'
import {
  Outlet,
  createFileRoute,
  useNavigate,
  useRouterState,
} from '@tanstack/react-router'
import { signOut, useSession } from '@repo/auth'
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

  // Authenticated, but the account hasn't been granted the shelter role yet.
  // The role is only bumped to 'shelter' when an admin approves the shelter
  // application (see approveShelter), so a fresh applicant lands here — the
  // backend (`me.*` routes gated by requireRole('shelter')) would reject their
  // requests anyway, this stops them reaching the dashboard at all.
  if (session.user.role !== 'shelter') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="w-full max-w-sm flex flex-col items-center gap-4 text-center">
          <h1 className="text-headline-md font-bold text-on-surface">
            Access pending
          </h1>
          <p className="text-body-sm text-on-surface-variant">
            This account doesn’t have shelter access yet. Once your shelter
            application is approved you’ll be able to manage your listings here.
          </p>
          <button
            type="button"
            onClick={async () => {
              await signOut()
              void navigate({ to: '/' })
            }}
            className="h-10 px-5 rounded-full bg-primary text-on-primary text-label-md hover:bg-primary/90 transition-colors cursor-pointer"
          >
            Sign out
          </button>
        </div>
      </div>
    )
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
