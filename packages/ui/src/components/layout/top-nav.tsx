import { Link } from '@tanstack/react-router'
import { Menu, PawPrint } from 'lucide-react'
import { cn } from '../../lib/utils'
import { Button } from '../ui/button'

type NavLink = {
  to: string
  label: string
  key: string
}

const NAV_LINKS: NavLink[] = [
  { key: 'find', to: '/search', label: 'Find a Pet' },
  { key: 'resources', to: '/resources', label: 'Resource Center' },
  { key: 'about', to: '/about', label: 'About Us' },
  { key: 'success', to: '/#success-stories', label: 'Success Stories' },
]

export interface TopNavProps {
  activeKey?: string
  user?: { name: string; email: string } | null
  onSignInClick?: () => void
  onSignOut?: () => void
}

export function TopNav({ activeKey, user, onSignInClick, onSignOut }: TopNavProps) {
  return (
    <nav className="bg-surface/90 backdrop-blur-md sticky top-0 z-50 border-b border-surface-variant w-full">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-margin-mobile md:px-margin-desktop py-4">
        <Link to="/" className="flex items-center gap-2">
          <PawPrint
            size={28}
            strokeWidth={2}
            className="text-primary-container"
            fill="currentColor"
          />
          <span className="font-display text-[24px] font-bold tracking-tight text-primary-container">
            OpenPets
          </span>
        </Link>
        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.key}
              to={link.to}
              className={cn(
                'font-label text-[12px] font-medium uppercase tracking-[0.05em] pb-1 transition-colors',
                activeKey === link.key
                  ? 'text-primary-container border-b-2 border-primary-container'
                  : 'text-on-surface-variant hover:text-primary-container',
              )}
            >
              {link.label}
            </Link>
          ))}
        </div>
        <div className="flex items-center gap-4">
          {user ? (
            <div className="hidden md:flex items-center gap-3">
              <span className="font-label text-[12px] text-on-surface-variant">
                Hi, {user.name}
              </span>
              <Button variant="outline" size="default" onClick={onSignOut}>
                Sign Out
              </Button>
            </div>
          ) : (
            <Button
              variant="outline"
              size="default"
              className="hidden md:inline-flex"
              onClick={onSignInClick}
            >
              Sign In
            </Button>
          )}
          <button
            type="button"
            className="md:hidden text-on-surface-variant p-2 hover:bg-surface-container-low rounded transition-colors"
            aria-label="Open menu"
          >
            <Menu size={24} />
          </button>
        </div>
      </div>
    </nav>
  )
}
