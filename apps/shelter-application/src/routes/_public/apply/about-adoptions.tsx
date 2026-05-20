import { createFileRoute } from '@tanstack/react-router'
import { ApplyHeader, ApplyFooter, ApplyMain } from '../../../components/apply-shell'
import {
  FieldsCard,
  InfoBanner,
  MoneyRange,
  RadioGroup,
  Select,
  TextArea,
} from '../../../components/form-field'
import { useApplicationForm } from '../../../lib/application-form'

export const Route = createFileRoute('/_public/apply/about-adoptions')({
  component: AboutAdoptionsStep,
})

function AboutAdoptionsStep() {
  const form = useApplicationForm()
  return (
    <div className="min-h-screen flex flex-col">
      <ApplyHeader current="about-adoptions" />
      <ApplyMain>
        <form className="space-y-10" onSubmit={(e) => e.preventDefault()}>
          <form.Field name="petsAvailable">
            {(field) => (
              <Select
                field={field}
                required
                label="Approximately how many pets does your organization currently have available for adoption?"
                options={[
                  { value: '1-10', label: '1 – 10' },
                  { value: '11-50', label: '11 – 50' },
                  { value: '51-100', label: '51 – 100' },
                  { value: '100+', label: 'More than 100' },
                ]}
              />
            )}
          </form.Field>

          <form.Field name="acquisitionDescription">
            {(field) => (
              <TextArea
                field={field}
                required
                label="Briefly describe how you acquire the pets you place for adoption."
                rows={5}
              />
            )}
          </form.Field>

          <form.Field name="hasAdoptionContract">
            {(field) => (
              <div className="space-y-2">
                <RadioGroup
                  field={field}
                  required
                  label="Do you have an adoption contract to transfer animals from your care to the adopter's?"
                  options={[
                    { value: 'yes', label: 'Yes' },
                    { value: 'no', label: 'No' },
                  ]}
                />
                <InfoBanner>
                  An adoption contract transfers ownership of the pet from you
                  to the adopter, and it is not the application used to screen
                  adopters.
                </InfoBanner>
              </div>
            )}
          </form.Field>

          <FieldsCard>
            <form.Field name="feeMin">
              {(fieldMin) => (
                <form.Field name="feeMax">
                  {(fieldMax) => (
                    <MoneyRange
                      label="Adoption Fee Range"
                      description="General range regardless of age, species, or breed"
                      fieldMin={fieldMin}
                      fieldMax={fieldMax}
                    />
                  )}
                </form.Field>
              )}
            </form.Field>
          </FieldsCard>

          <form.Field name="spayPolicy">
            {(field) => (
              <RadioGroup
                field={field}
                required
                label="Are all unsterilized pets spayed or neutered by your organization?"
                options={[
                  { value: 'usual', label: 'Yes, this is our usual policy' },
                  {
                    value: 'exceptions',
                    label:
                      'No, there are some exceptions when adopters cover the cost',
                  },
                  {
                    value: 'adopters',
                    label:
                      'No, adopters are generally responsible for sterilizing their new pet',
                  },
                  { value: 'na', label: 'Not applicable to my organization' },
                ]}
              />
            )}
          </form.Field>

          <form.Field name="sterilizationApproach">
            {(field) => (
              <TextArea
                field={field}
                required
                label="Briefly describe your sterilization approach."
                description="If there are different protocols for adults vs. young pets, describe them separately."
                rows={4}
              />
            )}
          </form.Field>

          <form.Field name="medicalCareDescription">
            {(field) => (
              <TextArea
                field={field}
                required
                label="Briefly describe the standard medical care pets receive before adoption."
                description="If there are different protocols for adults vs. young pets, describe them separately."
                rows={4}
              />
            )}
          </form.Field>
        </form>
      </ApplyMain>
      <ApplyFooter current="about-adoptions" />
    </div>
  )
}

