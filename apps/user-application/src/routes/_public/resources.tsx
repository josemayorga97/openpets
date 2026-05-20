import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_public/resources')({ component: ResourcesPage })

function ResourcesPage() {
  return (
    <div className="max-w-3xl mx-auto px-margin-mobile md:px-margin-desktop py-16">
      <h1 className="font-display text-[40px] font-bold tracking-[-0.02em] text-on-surface mb-6">
        Resource Center
      </h1>
      <p className="text-[16px] text-on-surface-variant leading-relaxed">
        Guides, checklists, and tips for new and prospective pet parents are
        coming soon.
      </p>
    </div>
  )
}
