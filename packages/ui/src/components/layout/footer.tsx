import { Link } from '@tanstack/react-router'

const FOOTER_LINKS = [
  { to: '/privacy', label: 'Privacy Policy' },
  { to: '/terms', label: 'Terms of Service' },
  { to: '/volunteer', label: 'Volunteer' },
  { to: '/donate', label: 'Donate' },
  { to: '/contact', label: 'Contact Us' },
]

export function Footer() {
  return (
    <footer className="bg-surface border-t border-surface-variant py-12 px-margin-mobile md:px-margin-desktop mt-12">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="font-display text-[24px] font-bold tracking-tight text-primary-container">
          OpenPets
        </div>
        <div className="flex flex-wrap justify-center gap-6">
          {FOOTER_LINKS.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="font-label text-[12px] font-medium uppercase tracking-[0.05em] text-on-surface-variant hover:text-primary-container transition-colors"
            >
              {l.label}
            </Link>
          ))}
        </div>
        <div className="text-xs text-on-surface-variant text-center md:text-right">
          © 2024 OpenPets Adoption Network. Connecting hearts with paws.
        </div>
      </div>
    </footer>
  )
}
