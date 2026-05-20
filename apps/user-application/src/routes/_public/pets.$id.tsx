import { Link, createFileRoute } from '@tanstack/react-router'
import { ArrowLeft, PawPrint } from 'lucide-react'
import { fetchPet } from '#/lib/server-fns'

export const Route = createFileRoute('/_public/pets/$id')({
  loader: ({ params }) => fetchPet({ data: { id: params.id } }),
  component: PetDetailStub,
})

function PetDetailStub() {
  const pet = Route.useLoaderData()
  if (!pet) {
    return (
      <div className="max-w-3xl mx-auto px-margin-mobile md:px-margin-desktop py-16 text-center">
        <h1 className="font-display text-[28px] font-semibold mb-4">Pet not found</h1>
        <Link
          to="/search"
          className="font-label text-[12px] font-medium uppercase tracking-[0.05em] text-primary-container hover:underline inline-flex items-center gap-1"
        >
          <ArrowLeft size={16} /> Back to search
        </Link>
      </div>
    )
  }
  return (
    <div className="max-w-3xl mx-auto px-margin-mobile md:px-margin-desktop py-12">
      <Link
        to="/search"
        className="font-label text-[12px] font-medium uppercase tracking-[0.05em] text-primary-container hover:underline inline-flex items-center gap-1 mb-8"
      >
        <ArrowLeft size={16} /> Back to results
      </Link>
      <div className="bg-surface-container-lowest rounded-lg border border-outline-variant overflow-hidden shadow-[0_4px_20px_rgba(0,36,41,0.05)]">
        <div className="aspect-video bg-surface-container flex items-center justify-center">
          {pet.photos[0] ? (
            <img alt={pet.name} src={pet.photos[0]} className="w-full h-full object-cover" />
          ) : (
            <PawPrint size={64} className="text-outline-variant" />
          )}
        </div>
        <div className="p-8">
          <h1 className="font-display text-[40px] font-bold tracking-[-0.02em] text-on-surface mb-2">
            {pet.name}
          </h1>
          <p className="text-[16px] text-on-surface-variant mb-6">
            {pet.breed} • {pet.ageLabel} • {pet.location.city}, {pet.location.state}
          </p>
          <p className="text-[16px] text-on-surface mb-6">{pet.description}</p>
          <p className="font-label text-[12px] font-medium uppercase tracking-[0.05em] text-on-surface-variant">
            Full profile coming soon
          </p>
        </div>
      </div>
    </div>
  )
}
