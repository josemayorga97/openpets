import * as React from 'react'
import {
  Outlet,
  createFileRoute,
  redirect,
  useNavigate,
} from '@tanstack/react-router'
import { sessionStore, useSession } from '@repo/auth'
import { Sidebar } from '../components/sidebar'
import { TopBar } from '../components/topbar'

export const Route = createFileRoute('/_shelter')({
  beforeLoad: () => {
    if (typeof window === 'undefined') return
    const session = sessionStore.getSnapshot()
    if (session.status !== 'authed') {
      throw redirect({ to: '/' })
    }
  },
  component: ShelterLayout,
})

function ShelterLayout() {
  const session = useSession()
  const navigate = useNavigate()
  React.useEffect(() => {
    if (session.status === 'guest') {
      void navigate({ to: '/' })
    }
  }, [session.status, navigate])
  if (session.status !== 'authed') {
    return null
  }
  return (
    <div className="min-h-screen flex bg-background text-on-background">
      <Sidebar />
      <div className="flex-1 md:ml-64 flex flex-col min-w-0">
        <TopBar />
        <main className="flex-1 p-container-margin md:p-section-padding max-w-[1280px] mx-auto w-full">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
