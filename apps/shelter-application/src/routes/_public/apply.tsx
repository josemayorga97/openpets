import { Outlet, createFileRoute, useNavigate } from '@tanstack/react-router'
import {
  ApplicationFormProvider,
  clearApplicationDraft,
} from '../../lib/application-form'

export const Route = createFileRoute('/_public/apply')({
  component: ApplyLayout,
})

function ApplyLayout() {
  const navigate = useNavigate()
  return (
    <ApplicationFormProvider
      onSubmit={async () => {
        clearApplicationDraft()
        await navigate({ to: '/apply/success' })
      }}
    >
      <Outlet />
    </ApplicationFormProvider>
  )
}
