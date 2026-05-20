import { createFileRoute } from '@tanstack/react-router'
import {
  ApplyFooter,
  ApplyHeader,
  ApplyMain,
} from '../../../components/apply-shell'
import {
  FieldsCard,
  InfoBanner,
  RadioGroup,
  Select,
  TextInput,
} from '../../../components/form-field'
import { useApplicationForm } from '../../../lib/application-form'

export const Route = createFileRoute('/_public/apply/about-organization')({
  component: AboutOrganizationStep,
})

const ORG_TYPES = [
  { value: 'municipal', label: 'Municipal Animal Shelter' },
  { value: 'private', label: 'Private Animal Shelter' },
  { value: 'rescue', label: 'Rescue Group / Foster-Based' },
  { value: 'vet', label: 'Veterinary Hospital / Spay-Neuter Clinic' },
  { value: 'boarding', label: 'Boarding Facility' },
  { value: 'other', label: 'Other' },
] as const

const COUNTRY_OPTIONS = [
  { value: 'US', label: 'United States' },
  { value: 'CA', label: 'Canada' },
] as const

const STATE_OPTIONS = [
  { value: 'CA', label: 'California' },
  { value: 'NY', label: 'New York' },
  { value: 'TX', label: 'Texas' },
  { value: 'FL', label: 'Florida' },
] as const

function AboutOrganizationStep() {
  const form = useApplicationForm()
  return (
    <div className="min-h-screen flex flex-col">
      <ApplyHeader current="about-organization" />
      <ApplyMain>
        <form
          className="space-y-10"
          onSubmit={(e) => e.preventDefault()}
        >
          <section className="flex flex-col gap-6">
            <div>
              <h2 className="text-headline-md text-on-surface mb-1">
                Organization Information
              </h2>
              <p className="text-body-sm text-on-surface-variant">
                This contact information is not released to the public.
              </p>
            </div>
            <FieldsCard>
              <form.Field name="orgType">
                {(field) => (
                  <Select
                    field={field}
                    required
                    label="Type of Organization"
                    options={ORG_TYPES}
                  />
                )}
              </form.Field>
              <form.Field name="orgName">
                {(field) => (
                  <TextInput
                    field={field}
                    required
                    label="Name of the Organization"
                  />
                )}
              </form.Field>
              <form.Field name="contactName">
                {(field) => (
                  <TextInput
                    field={field}
                    required
                    label="Contact Name (Director / Manager)"
                  />
                )}
              </form.Field>
              <p className="text-body-sm text-on-surface-variant flex items-center gap-1">
                <span className="text-error">*</span>
                Please provide at least one method of contacting your
                organization (phone or email).
              </p>
              <form.Field name="orgPhone">
                {(field) => (
                  <TextInput
                    field={field}
                    type="tel"
                    label="Phone Number"
                    hint="Example: 444-444-4444"
                  />
                )}
              </form.Field>
              <form.Field name="orgEmail">
                {(field) => (
                  <TextInput
                    field={field}
                    type="email"
                    label="Email Address"
                  />
                )}
              </form.Field>
              <form.Field name="taxId">
                {(field) => (
                  <TextInput
                    field={field}
                    label="If you are a 501(c)(3) nonprofit, please provide your Tax ID number."
                  />
                )}
              </form.Field>
              <InfoBanner>
                US organizations: before applying, verify you appear in the
                IRS charity search.
              </InfoBanner>
            </FieldsCard>
          </section>

          <section className="flex flex-col gap-6 pt-4 border-t border-outline-variant">
            <h2 className="text-headline-md text-on-surface">
              Organization's Physical Address
            </h2>
            <div className="space-y-2">
              <InfoBanner>
                This is the street address of your shelter, or the home street
                address of one of your rescue's officers. It does not appear to
                the public unless you also enter it as your public address
                below.
              </InfoBanner>
              <InfoBanner>
                Both street addresses and PO Boxes are accepted. You can manage
                your public settings from inside your account after approval.
              </InfoBanner>
            </div>
            <FieldsCard>
              <form.Field name="physCountry">
                {(field) => (
                  <Select
                    field={field}
                    required
                    label="Country"
                    options={COUNTRY_OPTIONS}
                  />
                )}
              </form.Field>
              <form.Field name="physAddress1">
                {(field) => (
                  <TextInput field={field} required label="Address" />
                )}
              </form.Field>
              <form.Field name="physAddress2">
                {(field) => (
                  <TextInput field={field} label="Address Line 2" />
                )}
              </form.Field>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <form.Field name="physCity">
                  {(field) => (
                    <TextInput field={field} required label="City / Town" />
                  )}
                </form.Field>
                <form.Field name="physState">
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
              <form.Field name="physZip">
                {(field) => (
                  <TextInput
                    field={field}
                    required
                    label="Zip / Postal Code"
                    hint="Example: 92506"
                  />
                )}
              </form.Field>
            </FieldsCard>
          </section>

          <section className="flex flex-col gap-6 pt-4 border-t border-outline-variant">
            <h2 className="text-headline-md text-on-surface">
              Organization's Mailing Address
            </h2>
            <FieldsCard>
              <form.Field name="mailCountry">
                {(field) => (
                  <Select
                    field={field}
                    required
                    label="Country"
                    options={COUNTRY_OPTIONS}
                  />
                )}
              </form.Field>
              <form.Field name="mailAddress1">
                {(field) => (
                  <TextInput field={field} required label="Address" />
                )}
              </form.Field>
              <form.Field name="mailIsPublic">
                {(field) => (
                  <RadioGroup
                    field={field}
                    label="Is this also the public address?"
                    options={[
                      { value: 'yes', label: 'Yes' },
                      { value: 'no', label: 'No' },
                    ]}
                  />
                )}
              </form.Field>
            </FieldsCard>
          </section>
        </form>
      </ApplyMain>
      <ApplyFooter current="about-organization" />
    </div>
  )
}
