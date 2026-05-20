import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_shelter/templates')({
  component: TemplatesPage,
})

function TemplatesPage() {
  return (
    <div>
      <h2 className="text-headline-lg text-on-background mb-2">Templates</h2>
      <p className="text-body-md text-on-surface-variant">
        Document and form templates will live here.
      </p>
    </div>
  )
}
