import * as React from 'react'
import { createFileRoute } from '@tanstack/react-router'
import {
  ApplyFooter,
  ApplyHeader,
  ApplyMain,
} from '../../../components/apply-shell'
import { useApplicationForm } from '../../../lib/application-form'
import type { ApplicationValues } from '../../../lib/application-schema'

export const Route = createFileRoute('/_public/apply/agreement')({
  component: AgreementStep,
})

const AGREEMENTS: Array<{
  key: keyof Pick<
    ApplicationValues,
    | 'agreement1'
    | 'agreement2'
    | 'agreement3'
    | 'agreement4'
    | 'agreementTerms'
  >
  label: React.ReactNode
  highlighted?: boolean
}> = [
  {
    key: 'agreement1',
    label:
      'You are a shelter, rescue, or adoption group operating in a not-for-profit manner, even if you do not have official non-profit status. Your adoption fees reflect the spirit of shelter pet adoption, and you do not require an upfront application fee or deposit.',
  },
  {
    key: 'agreement2',
    label:
      'If your organization is not a municipal open-admission shelter, you spay/neuter all cats and dogs, regardless of age, before adoption or include the cost of future spay/neuter in your adoption fee.',
  },
  {
    key: 'agreement3',
    label:
      'You will post each adoptable pet only once on OpenPets, in the city where the pet is currently being fostered or sheltered, and if applicable, will use Transport Destination as the location type in secondary locations.',
  },
  {
    key: 'agreement4',
    label:
      'You will give truthful information about your pets and fees, and will remove adopted pets from your adoptable pet list.',
  },
  {
    key: 'agreementTerms',
    label: (
      <>
        You have read and accept the full{' '}
        <a
          href="#"
          className="text-primary font-bold underline hover:text-primary-container"
        >
          OpenPets Member terms of service and code of conduct
        </a>
        .
      </>
    ),
    highlighted: true,
  },
]

function AgreementStep() {
  const form = useApplicationForm()
  const [submitting, setSubmitting] = React.useState(false)

  return (
    <div className="min-h-screen flex flex-col">
      <ApplyHeader current="agreement" />
      <ApplyMain>
        <div className="max-w-[800px] mx-auto w-full bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant p-8 md:p-12">
          <h1 className="text-headline-md text-on-surface mb-8 font-bold">
            By posting pets on OpenPets you agree that
          </h1>
          <div className="space-y-6">
            {AGREEMENTS.map((a) => (
              <form.Field key={a.key} name={a.key}>
                {(field) => {
                  const checked = Boolean(field.state.value)
                  return (
                    <label
                      className={`flex items-start gap-4 p-4 rounded-lg transition-colors cursor-pointer border ${
                        a.highlighted
                          ? 'bg-surface-container-low border-primary-container/30 hover:bg-surface-container'
                          : 'border-transparent hover:bg-surface-muted hover:border-outline-variant/50'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={(e) => field.handleChange(e.target.checked)}
                        className="mt-1 w-5 h-5 accent-primary"
                      />
                      <div className="text-body-md text-on-surface leading-relaxed">
                        {a.label}
                      </div>
                    </label>
                  )
                }}
              </form.Field>
            ))}
          </div>
          <p className="mt-8 text-body-sm text-on-surface-variant italic">
            Note: In order to submit your application, all checkboxes must be
            selected.
          </p>
        </div>
      </ApplyMain>
      <form.Subscribe
        selector={(state) =>
          AGREEMENTS.every((a) => Boolean(state.values[a.key]))
        }
      >
        {(canSubmit) => (
          <ApplyFooter
            current="agreement"
            canSubmit={canSubmit}
            submitting={submitting}
            onSubmit={async () => {
              setSubmitting(true)
              try {
                await form.handleSubmit()
              } finally {
                setSubmitting(false)
              }
            }}
          />
        )}
      </form.Subscribe>
    </div>
  )
}
