import { createFileRoute } from '@tanstack/react-router'
import {
  ApplyFooter,
  ApplyHeader,
  ApplyMain,
} from '../../../components/apply-shell'
import {
  FieldsCard,
  InfoBanner,
  Select,
  TextInput,
} from '../../../components/form-field'
import { useApplicationForm } from '../../../lib/application-form'

export const Route = createFileRoute('/_public/apply/about-you')({
  component: AboutYouStep,
})

const COUNTRY_OPTIONS = [
  { value: 'US', label: 'United States' },
  { value: 'CA', label: 'Canada' },
] as const

const STATE_OPTIONS = [
  { value: 'CA-state', label: 'California' },
  { value: 'NY', label: 'New York' },
  { value: 'TX', label: 'Texas' },
  { value: 'FL', label: 'Florida' },
] as const

function AboutYouStep() {
  const form = useApplicationForm()
  return (
    <div className="min-h-screen flex flex-col">
      <ApplyHeader current="about-you" />
      <ApplyMain>
        <form
          className="space-y-10"
          onSubmit={(e) => e.preventDefault()}
        >
          <section className="flex flex-col gap-6">
            <div>
              <h2 className="text-headline-md text-on-surface mb-1">
                Confirm your contact information
              </h2>
              <p className="text-body-sm text-on-surface-variant">
                This contact information is not released to the public.
              </p>
            </div>
            <FieldsCard>
              <form.Field name="firstName">
                {(field) => (
                  <TextInput field={field} required label="First Name" />
                )}
              </form.Field>
              <form.Field name="lastName">
                {(field) => (
                  <TextInput field={field} required label="Last Name" />
                )}
              </form.Field>
              <InfoBanner>
                Primary contact is the person primarily responsible for posting
                pets. Additional editors can be added or removed from the
                account after approval.
              </InfoBanner>
              <form.Field name="email">
                {(field) => (
                  <TextInput
                    field={field}
                    required
                    type="email"
                    label="Your Email Address"
                  />
                )}
              </form.Field>
              <form.Field name="phone">
                {(field) => (
                  <TextInput
                    field={field}
                    required
                    type="tel"
                    label="Your Phone Number"
                    hint="Example: 444-444-4444"
                  />
                )}
              </form.Field>
            </FieldsCard>
          </section>

          <section className="flex flex-col gap-6 pt-4 border-t border-outline-variant">
            <div>
              <h2 className="text-headline-md text-on-surface mb-1">
                Your personal address
              </h2>
              <p className="text-body-sm text-on-surface-variant">
                This contact information is not released to the public.
              </p>
            </div>
            <FieldsCard>
              <InfoBanner>
                We use this address only for verification and never share it
                publicly.
              </InfoBanner>
              <form.Field name="personalCountry">
                {(field) => (
                  <Select
                    field={field}
                    required
                    label="Country"
                    options={COUNTRY_OPTIONS}
                  />
                )}
              </form.Field>
              <form.Field name="personalAddress1">
                {(field) => (
                  <TextInput field={field} required label="Address" />
                )}
              </form.Field>
              <form.Field name="personalAddress2">
                {(field) => (
                  <TextInput field={field} label="Address Line 2" />
                )}
              </form.Field>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <form.Field name="personalCity">
                  {(field) => (
                    <TextInput field={field} required label="City / Town" />
                  )}
                </form.Field>
                <form.Field name="personalState">
                  {(field) => (
                    <Select
                      field={field}
                      required
                      label="State / Province"
                      options={STATE_OPTIONS}
                    />
                  )}
                </form.Field>
              </div>
              <div className="md:w-1/2 md:pr-3">
                <form.Field name="personalZip">
                  {(field) => (
                    <TextInput
                      field={field}
                      required
                      label="Zip / Postal Code"
                      hint="Example: 92506"
                    />
                  )}
                </form.Field>
              </div>
            </FieldsCard>
          </section>
        </form>
      </ApplyMain>
      <ApplyFooter current="about-you" />
    </div>
  )
}
