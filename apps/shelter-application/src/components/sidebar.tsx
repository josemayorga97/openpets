import * as React from 'react'
import { Link, useNavigate } from '@tanstack/react-router'
import { signOut } from '@repo/auth'
import { Icon } from './icon'

type NavItem = {
  to: string
  icon: string
  label: string
}

const navItems: NavItem[] = [
  { to: '/dashboard', icon: 'dashboard', label: 'Dashboard' },
  { to: '/listings', icon: 'pets', label: 'Pet Listings' },
  { to: '/adoptions', icon: 'handshake', label: 'Adoptions' },
  { to: '/reports', icon: 'assessment', label: 'Reports' },
  { to: '/settings', icon: 'settings', label: 'Settings' },
]

function NavContent({ onNavigate }: { onNavigate?: () => void }) {
  const navigate = useNavigate()
  const handleLogout = async () => {
    onNavigate?.()
    await signOut()
    void navigate({ to: '/' })
  }
  return (
    <>
      <div className="mb-8 px-4 flex items-center gap-3">
        <div className="w-9 h-9 rounded-md bg-primary-container flex items-center justify-center text-on-primary-container">
          <Icon name="pets" fill />
        </div>
        <div>
          <h1 className="text-headline-md font-bold text-primary leading-none">
            OpenPets
          </h1>
          <p className="text-label-sm text-on-surface-variant mt-1">
            Shelter Management
          </p>
        </div>
      </div>

      <ul className="flex flex-col gap-1 flex-1">
        {navItems.map((item) => (
          <li key={item.to}>
            <Link
              to={item.to}
              activeOptions={{ exact: item.to === '/' }}
              onClick={onNavigate}
              className="group flex items-center gap-3 px-4 py-3 rounded-md text-label-md text-on-surface-variant hover:text-primary hover:bg-surface-container-high transition-colors"
              activeProps={{
                className:
                  'flex items-center gap-3 px-4 py-3 rounded-md text-label-md text-primary font-bold border-r-4 border-primary bg-primary-container/10 transition-colors',
              }}
            >
              <Icon name={item.icon} className="text-[20px]" />
              <span>{item.label}</span>
            </Link>
          </li>
        ))}
      </ul>

      <div className="mt-auto pt-6 border-t border-outline-variant/40 mb-2">
        <Link
          to="/listings/new"
          onClick={onNavigate}
          className="w-full bg-primary text-on-primary py-3 px-4 rounded-md text-label-md flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors"
        >
          <Icon name="add" fill className="text-[18px]" />
          Add New Listing
        </Link>
      </div>
      <div className="space-y-1">
        <a
          href="#"
          className="flex items-center gap-3 px-4 py-2 rounded-md text-label-sm text-on-surface-variant hover:text-primary hover:bg-surface-container-high transition-colors"
        >
          <Icon name="help" className="text-[18px]" />
          Support
        </a>
        <button
          type="button"
          onClick={handleLogout}
          className="w-full text-left flex items-center gap-3 px-4 py-2 rounded-md text-label-sm text-on-surface-variant hover:text-primary hover:bg-surface-container-high transition-colors cursor-pointer"
        >
          <Icon name="logout" className="text-[18px]" />
          Logout
        </button>
      </div>
    </>
  )
}

export function Sidebar() {
  return (
    <nav className="hidden md:flex h-screen w-64 fixed left-0 top-0 overflow-y-auto bg-surface border-r border-outline-variant flex-col py-6 px-4 z-40">
      <NavContent />
    </nav>
  )
}

export function MobileSidebar({
  open,
  onClose,
}: {
  open: boolean
  onClose: () => void
}) {
  React.useEffect(() => {
    if (!open) return
    const original = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = original
    }
  }, [open])

  if (!open) return null

  return (
    <div className="md:hidden fixed inset-0 z-50">
      <button
        type="button"
        aria-label="Close menu"
        className="absolute inset-0 bg-on-surface/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <nav className="relative h-full w-72 max-w-[85vw] bg-surface border-r border-outline-variant flex flex-col py-6 px-4 overflow-y-auto shadow-xl">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-surface-container-high transition-colors"
          aria-label="Close menu"
        >
          <Icon name="close" />
        </button>
        <NavContent onNavigate={onClose} />
      </nav>
    </div>
  )
}
