import * as React from 'react'
import {
  Link,
  Outlet,
  createFileRoute,
  useRouterState,
} from '@tanstack/react-router'
import {
  Bell,
  Building2,
  HelpCircle,
  LayoutDashboard,
  Menu,
  PawPrint,
  Search,
  Settings,
  X,
} from 'lucide-react'
import { cn } from '@repo/ui'

export const Route = createFileRoute('/_admin')({
  component: AdminLayout,
})

const navItems = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { to: '/shelters', label: 'Shelters', icon: Building2, exact: false },
  { to: '/pets', label: 'Pets', icon: PawPrint, exact: false },
] as const

function AdminLayout() {
  const [mobileOpen, setMobileOpen] = React.useState(false)
  const pathname = useRouterState({ select: (s) => s.location.pathname })

  React.useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  React.useEffect(() => {
    if (!mobileOpen) return
    const original = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = original
    }
  }, [mobileOpen])

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <MobileSidebar
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
      />
      <div className="md:ml-64 flex flex-col min-h-screen">
        <TopNav onMenuClick={() => setMobileOpen(true)} />
        <main className="flex-1 p-margin-mobile md:p-margin-desktop">
          <div className="max-w-[1280px] mx-auto w-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <>
      <div className="px-3 py-5 mb-2 flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center text-on-primary font-display font-bold">
          OP
        </div>
        <div>
          <h1 className="font-display text-headline-md font-bold tracking-tight text-primary leading-none">
            OpenPets
          </h1>
          <p className="text-label-sm text-on-surface-variant mt-1">
            Admin Console
          </p>
        </div>
      </div>
      <div className="flex-1 flex flex-col gap-1">
        {navItems.map((item) => (
          <NavLink key={item.to} {...item} onNavigate={onNavigate} />
        ))}
      </div>
      <div className="pt-4 border-t border-border-light">
        <Link
          to="/"
          onClick={onNavigate}
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-on-surface-variant hover:bg-surface-container-high transition-colors"
        >
          <Settings className="size-5" />
          <span className="text-label-md">Settings</span>
        </Link>
      </div>
    </>
  )
}

function Sidebar() {
  return (
    <nav className="hidden md:flex bg-surface-container-low h-screen w-64 fixed left-0 top-0 border-r border-border-light flex-col p-4 gap-2 z-30">
      <SidebarContent />
    </nav>
  )
}

function MobileSidebar({
  open,
  onClose,
}: {
  open: boolean
  onClose: () => void
}) {
  if (!open) return null
  return (
    <div className="md:hidden fixed inset-0 z-50">
      <button
        type="button"
        aria-label="Close menu"
        className="absolute inset-0 bg-on-surface/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <nav className="relative h-full w-72 max-w-[85vw] bg-surface-container-low border-r border-border-light flex flex-col p-4 gap-2 overflow-y-auto shadow-xl">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-on-surface-variant hover:bg-surface-container-high transition-colors"
          aria-label="Close menu"
        >
          <X className="size-5" />
        </button>
        <SidebarContent onNavigate={onClose} />
      </nav>
    </div>
  )
}

function NavLink({
  to,
  label,
  icon: Icon,
  exact,
  onNavigate,
}: {
  to: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  exact: boolean
  onNavigate?: () => void
}) {
  return (
    <Link
      to={to}
      activeOptions={{ exact }}
      onClick={onNavigate}
      className="flex items-center gap-3 px-4 py-3 rounded-lg text-on-surface-variant hover:bg-surface-container-high transition-colors"
      activeProps={{
        className: cn(
          'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors',
          'bg-primary-fixed text-on-primary-fixed-variant font-bold',
        ),
      }}
    >
      <Icon className="size-5" />
      <span className="text-label-md">{label}</span>
    </Link>
  )
}

function TopNav({ onMenuClick }: { onMenuClick: () => void }) {
  return (
    <header className="bg-surface/80 backdrop-blur-md sticky top-0 z-20 border-b border-border-light">
      <div className="flex items-center justify-between px-margin-mobile md:px-margin-desktop py-3 gap-3 md:gap-4">
        <button
          type="button"
          onClick={onMenuClick}
          className="md:hidden p-2 -ml-2 text-on-surface-variant hover:text-primary hover:bg-surface-container-low rounded-full transition-colors shrink-0"
          aria-label="Open menu"
        >
          <Menu className="size-5" />
        </button>
        <div className="flex items-center flex-1 max-w-md">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-on-surface-variant" />
            <input
              type="text"
              placeholder="Search…"
              className="w-full pl-10 pr-4 py-2.5 bg-surface-container-lowest border border-border-light rounded-lg text-body-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
            />
          </div>
        </div>
        <div className="flex items-center gap-2 md:gap-3">
          <IconButton>
            <Bell className="size-5" />
          </IconButton>
          <IconButton>
            <HelpCircle className="size-5" />
          </IconButton>
          <button className="hidden sm:block text-label-md text-primary px-4 py-2 rounded-lg hover:bg-surface-container-low transition-colors">
            Support
          </button>
          <div
            className="w-9 h-9 rounded-full bg-primary-container border-2 border-border-light flex items-center justify-center text-on-primary-container font-display font-bold text-sm"
            aria-label="Profile"
          >
            AU
          </div>
        </div>
      </div>
    </header>
  )
}

function IconButton({ children }: { children: React.ReactNode }) {
  return (
    <button
      type="button"
      className="p-2 text-on-surface-variant hover:text-primary hover:bg-surface-container-low rounded-full transition-colors"
    >
      {children}
    </button>
  )
}
