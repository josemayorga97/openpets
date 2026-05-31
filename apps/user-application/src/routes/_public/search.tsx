import {
  FiltersSidebar,
  PetCardSearch,
  QuizBanner,
  SearchBar,
} from '@repo/ui'
import type { FiltersValue } from '@repo/ui'
import { SignInDialog, useSession } from '@repo/auth'
import { searchPetsSchema } from '@repo/data-utils/zod-schema/pets'
import { z } from 'zod'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { ChevronDown } from 'lucide-react'
import * as React from 'react'
import { useFavorites } from '#/lib/favorites'
import { searchPetsFn } from '#/lib/server-fns'

type SortKey = 'nearest' | 'newest' | 'oldest'

// Route search state: the backend-validated filters plus UI-only fields
// (distance / free-text location / out-of-town toggle) that drive the
// controls but have no server-side effect yet. The server fn re-validates
// against searchPetsSchema, which strips the UI-only keys.
const searchRouteSchema = searchPetsSchema.extend({
  distance: z.coerce.number().optional(),
  location: z.string().optional(),
  includeOutOfTown: z.boolean().optional(),
})

export const Route = createFileRoute('/_public/search')({
  validateSearch: (s) => searchRouteSchema.parse(s),
  loaderDeps: ({ search }) => search,
  loader: async ({ deps }) => {
    const results = await searchPetsFn({ data: deps })
    return { results }
  },
  component: SearchPage,
})

function SearchPage() {
  const { results } = Route.useLoaderData()
  const search = Route.useSearch()
  const navigate = useNavigate({ from: '/search' })
  const session = useSession()
  const { favorites, toggle } = useFavorites()
  const [signInOpen, setSignInOpen] = React.useState(false)

  const filters: FiltersValue = {
    breeds: search.breeds ?? [],
    ages: search.ages ?? [],
    sizes: search.sizes ?? [],
    includeOutOfTown: search.includeOutOfTown ?? true,
  }

  const updateSearch = (patch: Record<string, unknown>) => {
    navigate({
      search: (prev) => ({ ...prev, ...patch }),
    })
  }

  const onFavorite = (id: string) => {
    if (session.status === 'authed') toggle(id)
    else setSignInOpen(true)
  }

  const petTypeLabel =
    search.petType === 'cat'
      ? 'Cats'
      : search.petType === 'other'
        ? 'Other Pets'
        : 'Dogs & Puppies'
  const locationLabel = search.location ?? 'your area'

  return (
    <div>
      <SearchBar
        value={{
          petType: search.petType,
          distance: search.distance,
          location: search.location,
        }}
        onChange={(next) =>
          updateSearch({
            petType: next.petType,
            distance: next.distance,
            location: next.location,
          })
        }
        onSubmit={() => updateSearch({})}
      />
      <div className="max-w-7xl mx-auto px-margin-mobile md:px-margin-desktop py-8 flex flex-col md:flex-row gap-8">
        <FiltersSidebar
          filters={filters}
          breeds={[]}
          onChange={(next) =>
            updateSearch({
              breeds: next.breeds.length ? next.breeds : undefined,
              ages: next.ages.length ? next.ages : undefined,
              sizes: next.sizes.length ? next.sizes : undefined,
              includeOutOfTown: next.includeOutOfTown,
            })
          }
          onClear={() =>
            navigate({
              search: { petType: search.petType, location: search.location },
            })
          }
        />
        <main className="flex-1">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <div>
              <h1 className="font-display text-[24px] md:text-[28px] font-semibold tracking-[-0.01em] text-primary">
                Search {petTypeLabel} for Adoption in {locationLabel}
              </h1>
              <p className="text-[16px] text-on-surface-variant mt-1">
                <span className="font-bold">{results.total}</span> pet{results.total === 1 ? '' : 's'} found
              </p>
            </div>
            <div className="flex items-center gap-2">
              <label className="font-label text-[12px] font-medium uppercase tracking-[0.05em] text-on-surface-variant">
                Sort By:
              </label>
              <div className="relative">
                <select
                  value={search.sort ?? 'nearest'}
                  onChange={(e) =>
                    updateSearch({ sort: e.target.value as SortKey })
                  }
                  className="bg-transparent border-none font-label text-[12px] font-medium uppercase tracking-[0.05em] text-primary pr-6 focus:ring-0 cursor-pointer appearance-none"
                >
                  <option value="nearest">Nearest</option>
                  <option value="newest">Newest</option>
                  <option value="oldest">Oldest</option>
                </select>
                <ChevronDown
                  size={16}
                  className="absolute right-0 top-1/2 -translate-y-1/2 text-primary pointer-events-none"
                />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {results.results.map((pet, i) => (
              <React.Fragment key={pet.id}>
                {i === 3 && (
                  <div className="col-span-1 sm:col-span-2 xl:col-span-3 lg:hidden my-4">
                    <QuizBanner variant="inline" />
                  </div>
                )}
                <PetCardSearch
                  pet={pet}
                  isFavorite={favorites.has(pet.id)}
                  onFavoriteClick={(p) => onFavorite(p.id)}
                />
              </React.Fragment>
            ))}
          </div>
          <QuizBanner variant="desktop" />
          <div className="mt-12 w-full max-w-3xl mx-auto border border-outline-variant bg-surface-container-lowest h-24 flex items-center justify-center text-on-surface-variant font-label text-[12px] font-medium uppercase tracking-[0.05em] rounded-lg">
            Advertisement Placeholder
          </div>
        </main>
      </div>
      <SignInDialog open={signInOpen} onOpenChange={setSignInOpen} />
    </div>
  )
}

