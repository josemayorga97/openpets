import {
  AdoptionProcess,
  Categories,
  Hero,
  PetCardHome,
} from '@repo/ui'
import { useSession, SignInDialog } from '@repo/auth'
import { Link, createFileRoute, useNavigate } from '@tanstack/react-router'
import { ArrowRight } from 'lucide-react'
import * as React from 'react'
import { useFavorites } from '#/lib/favorites'
import { fetchHomeData } from '#/lib/server-fns'

export const Route = createFileRoute('/_public/')({
  loader: () => fetchHomeData(),
  component: HomePage,
})

function HomePage() {
  const { featured, categories } = Route.useLoaderData()
  const navigate = useNavigate()
  const session = useSession()
  const { favorites, toggle } = useFavorites()
  const [signInOpen, setSignInOpen] = React.useState(false)

  const handleFavorite = (petId: string) => {
    if (session.status === 'authed') {
      toggle(petId)
    } else {
      setSignInOpen(true)
    }
  }

  return (
    <div className="max-w-7xl mx-auto">
      <Hero
        bgImage="/pet-images/hero.jpg"
        onSearch={({ q, location }) => {
          navigate({
            to: '/search',
            search: {
              ...(q ? { breeds: [q] } : {}),
              ...(location ? { location } : {}),
            },
          })
        }}
      />
      <Categories categories={categories} />
      <section className="px-margin-mobile md:px-margin-desktop mb-24">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="font-display text-[28px] md:text-[32px] font-semibold tracking-[-0.01em] text-primary-container mb-2">
              Pets Looking for Homes
            </h2>
            <p className="text-[16px] text-on-surface-variant">
              These adorable companions are waiting for someone like you.
            </p>
          </div>
          <Link
            to="/search"
            className="hidden md:flex font-label text-[12px] font-medium uppercase tracking-[0.05em] items-center gap-1 text-primary-container hover:text-primary transition-colors"
          >
            View all pets <ArrowRight size={16} />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featured.map((pet) => (
            <PetCardHome
              key={pet.id}
              pet={pet}
              isFavorite={favorites.has(pet.id)}
              onFavoriteClick={(p) => handleFavorite(p.id)}
            />
          ))}
        </div>
        <div className="mt-8 text-center md:hidden">
          <Link
            to="/search"
            className="inline-flex font-label text-[12px] font-medium uppercase tracking-[0.05em] items-center gap-2 hover:bg-surface-container transition-colors px-6 py-3 border border-outline-variant rounded w-full justify-center text-primary-container"
          >
            View all pets <ArrowRight size={16} />
          </Link>
        </div>
      </section>
      <AdoptionProcess />
      <SignInDialog open={signInOpen} onOpenChange={setSignInOpen} />
    </div>
  )
}
