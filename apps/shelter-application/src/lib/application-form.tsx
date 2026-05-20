import * as React from 'react'
import { useForm, type ReactFormExtendedApi } from '@tanstack/react-form'
import {
  type ApplicationValues,
  defaultApplicationValues,
} from './application-schema'

const DRAFT_KEY = 'openpets.shelter-application-draft'

function loadDraft(): ApplicationValues {
  if (typeof window === 'undefined') return defaultApplicationValues
  try {
    const raw = window.localStorage.getItem(DRAFT_KEY)
    if (!raw) return defaultApplicationValues
    return { ...defaultApplicationValues, ...JSON.parse(raw) }
  } catch {
    return defaultApplicationValues
  }
}

function saveDraft(values: ApplicationValues) {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(DRAFT_KEY, JSON.stringify(values))
  } catch {
    // ignore quota errors
  }
}

export function clearApplicationDraft() {
  if (typeof window === 'undefined') return
  window.localStorage.removeItem(DRAFT_KEY)
}

type ApplicationForm = ReactFormExtendedApi<
  ApplicationValues,
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  any
>

const ApplicationFormContext = React.createContext<ApplicationForm | null>(null)

export function ApplicationFormProvider({
  children,
  onSubmit,
}: {
  children: React.ReactNode
  onSubmit: (values: ApplicationValues) => Promise<void> | void
}) {
  const [initial] = React.useState<ApplicationValues>(() => loadDraft())

  const form = useForm({
    defaultValues: initial,
    onSubmit: async ({ value }) => {
      await onSubmit(value as ApplicationValues)
    },
  }) as unknown as ApplicationForm

  React.useEffect(() => {
    const sub = form.store.subscribe(() => {
      saveDraft(form.store.state.values as ApplicationValues)
    })
    return () => sub.unsubscribe()
  }, [form])

  return (
    <ApplicationFormContext.Provider value={form}>
      {children}
    </ApplicationFormContext.Provider>
  )
}

export function useApplicationForm(): ApplicationForm {
  const ctx = React.useContext(ApplicationFormContext)
  if (!ctx)
    throw new Error(
      'useApplicationForm must be used within ApplicationFormProvider',
    )
  return ctx
}
