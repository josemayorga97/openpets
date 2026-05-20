import { Link } from '@tanstack/react-router'
import { Cat, PawPrint, Rabbit } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

const ICON_MAP: Record<string, LucideIcon> = {
  PawPrint,
  Cat,
  Rabbit,
}

export interface CategoriesProps {
  categories: { id: string; label: string; icon: string }[]
}

export function Categories({ categories }: CategoriesProps) {
  return (
    <section className="px-margin-mobile md:px-margin-desktop mb-24">
      <div className="flex flex-wrap justify-center gap-6">
        {categories.map((cat) => {
          const Icon = ICON_MAP[cat.icon] ?? PawPrint
          return (
            <Link
              key={cat.id}
              to="/search"
              search={{ petType: cat.id as 'dog' | 'cat' | 'other' }}
              className="flex flex-col items-center gap-4 p-6 rounded-lg bg-surface-container hover:bg-surface-container-high transition-colors border border-surface-variant group w-36"
            >
              <div className="w-16 h-16 rounded bg-surface flex items-center justify-center text-primary-container group-hover:text-primary transition-colors shadow-sm">
                <Icon size={32} />
              </div>
              <span className="font-label text-[12px] font-medium uppercase tracking-[0.05em] text-on-surface group-hover:text-primary-container transition-colors">
                {cat.label}
              </span>
            </Link>
          )
        })}
      </div>
    </section>
  )
}
