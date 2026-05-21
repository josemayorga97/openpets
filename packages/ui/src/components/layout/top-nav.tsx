import { Link } from '@tanstack/react-router'
import { Menu, PawPrint, X } from 'lucide-react'
import * as React from 'react'
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
  const [open, setOpen] = React.useState(false)

  React.useEffect(() => {
    if (!open) return
    const original = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = original
    }
  }, [open])

  const close = () => setOpen(false)

  return (
    <nav className="bg-surface/90 backdrop-blur-md sticky top-0 z-50 border-b border-surface-variant w-full">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-margin-mobile md:px-margin-desktop py-4">
        <Link to="/" className="flex items-center gap-2" onClick={close}>
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
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {open ? (
        <div className="md:hidden fixed inset-0 top-[65px] z-40">
          <button
            type="button"
            aria-label="Close menu"
            className="absolute inset-0 bg-on-surface/30 backdrop-blur-sm"
            onClick={close}
          />
          <div className="relative bg-surface border-b border-surface-variant shadow-lg max-h-[calc(100vh-65px)] overflow-y-auto">
            <div className="px-margin-mobile py-4 flex flex-col gap-1">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.key}
                  to={link.to}
                  onClick={close}
                  className={cn(
                    'font-label text-[14px] font-medium uppercase tracking-[0.05em] py-3 px-2 rounded transition-colors',
                    activeKey === link.key
                      ? 'text-primary-container bg-primary-container/10'
                      : 'text-on-surface-variant hover:text-primary-container hover:bg-surface-container-low',
                  )}
                >
                  {link.label}
                </Link>
              ))}
              <div className="mt-4 pt-4 border-t border-surface-variant">
                {user ? (
                  <div className="flex flex-col gap-3">
                    <span className="font-label text-[12px] text-on-surface-variant px-2">
                      Hi, {user.name}
                    </span>
                    <Button
                      variant="outline"
                      size="default"
                      onClick={() => {
                        close()
                        onSignOut?.()
                      }}
                    >
                      Sign Out
                    </Button>
                  </div>
                ) : (
                  <Button
                    variant="outline"
                    size="default"
                    className="w-full"
                    onClick={() => {
                      close()
                      onSignInClick?.()
                    }}
                  >
                    Sign In
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </nav>
  )
}
