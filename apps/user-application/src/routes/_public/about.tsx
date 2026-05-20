import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_public/about')({ component: AboutPage })

function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-margin-mobile md:px-margin-desktop py-16">
      <h1 className="font-display text-[40px] font-bold tracking-[-0.02em] text-on-surface mb-6">
        About OpenPets
      </h1>
      <p className="text-[16px] text-on-surface-variant leading-relaxed mb-4">
        OpenPets is an open adoption network connecting pets in need with loving
        families. We partner with shelters and rescues across the country to
        make pet adoption easier, more transparent, and more joyful.
      </p>
      <p className="text-[16px] text-on-surface-variant leading-relaxed">
        Every pet has a story. Our mission is to help write the next chapter.
      </p>
    </div>
  )
}
