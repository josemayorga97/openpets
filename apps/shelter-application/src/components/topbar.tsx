import * as React from 'react'
import { signOut, useSession } from '@repo/auth'
import { Icon } from './icon'

export function TopBar({ onMenuClick }: { onMenuClick?: () => void }) {
  const session = useSession()
  const [open, setOpen] = React.useState(false)
  const initial = session.user?.name?.[0]?.toUpperCase() ?? 'O'

  return (
    <header className="sticky top-0 z-30 backdrop-blur-md bg-surface/80 border-b border-outline-variant flex justify-between items-center w-full px-gutter h-16 gap-3">
      <button
        type="button"
        onClick={onMenuClick}
        className="md:hidden w-10 h-10 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-surface-container-high transition-colors shrink-0"
        aria-label="Open menu"
      >
        <Icon name="menu" />
      </button>
      <div className="flex items-center gap-4 flex-1 max-w-md">
        <div className="relative w-full">
          <Icon
            name="search"
            className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]"
          />
          <input
            type="text"
            placeholder="Search OpenPets..."
            className="w-full pl-10 pr-4 h-10 bg-surface-container-lowest border border-outline-variant rounded-md text-body-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all placeholder:text-on-surface-variant"
          />
        </div>
      </div>
      <div className="flex items-center gap-3">
        <button
          type="button"
          className="w-10 h-10 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-surface-container-high transition-colors relative"
        >
          <Icon name="notifications" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-status-alert rounded-full border border-surface" />
        </button>
        <div className="relative">
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            onBlur={() => window.setTimeout(() => setOpen(false), 120)}
            className="h-9 w-9 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center border border-outline-variant/30 font-bold text-sm hover:opacity-90 transition-opacity cursor-pointer"
            aria-label="Account menu"
          >
            {initial}
          </button>
          {open ? (
            <div className="absolute right-0 mt-2 w-56 rounded-lg border border-outline-variant bg-surface-container-lowest shadow-lg overflow-hidden">
              {session.user ? (
                <div className="px-4 py-3 border-b border-outline-variant">
                  <p className="text-body-sm font-medium text-on-surface truncate">
                    {session.user.name}
                  </p>
                  <p className="text-label-sm text-on-surface-variant truncate">
                    {session.user.email}
                  </p>
                </div>
              ) : null}
              <button
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault()
                  void signOut()
                }}
                className="w-full text-left px-4 py-3 text-body-sm text-on-surface hover:bg-surface-container-low flex items-center gap-2 cursor-pointer"
              >
                <Icon name="logout" className="text-[18px]" />
                Sign out
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  )
}
