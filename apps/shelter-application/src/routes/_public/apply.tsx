import { Outlet, createFileRoute, useNavigate } from '@tanstack/react-router'
import { signIn } from '@repo/auth'
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
      onSubmit={async (values) => {
        signIn({
          email: values.email,
          name:
            [values.firstName, values.lastName].filter(Boolean).join(' ') ||
            values.email,
        })
        clearApplicationDraft()
        await navigate({ to: '/apply/success' })
      }}
    >
      <Outlet />
    </ApplicationFormProvider>
  )
}
