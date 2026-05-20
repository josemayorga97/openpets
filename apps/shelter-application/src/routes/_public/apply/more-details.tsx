import { createFileRoute } from '@tanstack/react-router'
import {
  ApplyFooter,
  ApplyHeader,
  ApplyMain,
} from '../../../components/apply-shell'
import {
  CheckboxGroup,
  InfoBanner,
  TextArea,
  TextInput,
  VisibilityBanner,
} from '../../../components/form-field'
import { useApplicationForm } from '../../../lib/application-form'

export const Route = createFileRoute('/_public/apply/more-details')({
  component: MoreDetailsStep,
})

const ANIMAL_OPTIONS = [
  { value: 'small-furry', label: 'Small & Furry' },
  { value: 'dog', label: 'Dog' },
  { value: 'cat', label: 'Cat' },
  { value: 'bird', label: 'Bird' },
  { value: 'scales-fins', label: 'Scales, Fins & Other' },
  { value: 'barnyard', label: 'Barnyard' },
  { value: 'rabbit', label: 'Rabbit' },
  { value: 'horse', label: 'Horse' },
] as const

const SERVICE_OPTIONS = [
  { value: 'bully-breed', label: 'Bully Breed Rescue' },
  { value: 'greyhound', label: 'Greyhound Rescue' },
  { value: 'specific-dog-breed', label: 'Other Specific Dog Breed' },
  { value: 'specific-cat-breed', label: 'Other Specific Cat Breed' },
  { value: 'young-only', label: 'Young Pets Only' },
  { value: 'senior', label: 'Senior Pet Rescue' },
  { value: 'special-needs', label: 'Special Needs Pet Rescue' },
  { value: 'transport', label: 'Transport Group (Continental N. America)' },
  { value: 'overseas', label: 'Overseas Adoptions' },
  { value: 'tnr', label: 'Trap / Neuter / Return' },
  {
    value: 'support-veterans',
    label: 'Support for Veterans, Homeless, or Domestic Abuse victims',
    full: true,
  },
  { value: 'other-rescue', label: 'Other Specialized Rescue' },
] as const

function Card({ children }: { children: React.ReactNode }) {
  return (
    <section className="bg-surface-container-lowest rounded-xl p-6 md:p-8 border border-outline-variant shadow-sm space-y-4">
      {children}
    </section>
  )
}

function MoreDetailsStep() {
  const form = useApplicationForm()
  return (
    <div className="min-h-screen flex flex-col">
      <ApplyHeader current="more-details" />
      <ApplyMain>
        <div className="space-y-10">
          <Card>
            <form.Field name="animals">
              {(field) => (
                <CheckboxGroup
                  field={field}
                  required
                  label="What animals do you place for adoption?"
                  options={ANIMAL_OPTIONS as unknown as ReadonlyArray<{
                    value: string
                    label: string
                  }>}
                />
              )}
            </form.Field>
          </Card>

          <Card>
            <form.Field name="missionStatement">
              {(field) => (
                <TextArea
                  field={field}
                  required
                  label="Mission statement"
                  description="What is your organization's mission statement?"
                  placeholder="Enter mission statement…"
                />
              )}
            </form.Field>
            <VisibilityBanner>
              Mission statement will be publicly visible on your organization's
              public profile page.
            </VisibilityBanner>
          </Card>

          <Card>
            <form.Field name="adoptionApplicationUrl">
              {(field) => (
                <TextInput
                  field={field}
                  type="url"
                  label="Would you like us to link to your adoption application?"
                  hint="Example: www.mywebsite.com/adoption"
                  placeholder="https://"
                />
              )}
            </form.Field>
            <InfoBanner>
              If you already host your adoption application on another website,
              OpenPets can add a link to its URL from your shelter page.
            </InfoBanner>
          </Card>

          <Card>
            <form.Field name="adoptionPolicies">
              {(field) => (
                <TextArea
                  field={field}
                  required
                  label="Adoption Policies"
                  description="How would you describe your adoption policies for potential adopters?"
                  placeholder="Describe policies…"
                />
              )}
            </form.Field>
            <VisibilityBanner>
              Adoption Policies will be publicly visible on your organization's
              public profile page.
            </VisibilityBanner>
          </Card>

          <Card>
            <form.Field name="specialServices">
              {(field) => (
                <CheckboxGroup
                  field={field}
                  label="Does your organization offer any of the following special services?"
                  description="Select any that describes your organization's capabilities."
                  options={SERVICE_OPTIONS as unknown as ReadonlyArray<{
                    value: string
                    label: string
                    full?: boolean
                  }>}
                />
              )}
            </form.Field>
          </Card>

          <Card>
            <h2 className="text-headline-md font-bold mb-2">
              Where do you post your pets today?
            </h2>
            <div className="space-y-3 mb-4">
              <InfoBanner>
                You will be able to update and set public preferences from your
                account later.
              </InfoBanner>
              <InfoBanner>
                Adding your social media links can boost your organization's
                visibility and increase engagement opportunities!
              </InfoBanner>
            </div>
            <div className="space-y-6">
              <form.Field name="websiteUrl">
                {(field) => (
                  <TextInput
                    field={field}
                    type="url"
                    label="Organization Website"
                    placeholder="https://"
                  />
                )}
              </form.Field>
              <form.Field name="facebookUrl">
                {(field) => (
                  <TextInput
                    field={field}
                    type="url"
                    label="Facebook Page URL"
                    placeholder="https://facebook.com/"
                  />
                )}
              </form.Field>
              <form.Field name="instagramUrl">
                {(field) => (
                  <TextInput
                    field={field}
                    type="url"
                    label="Instagram URL"
                    placeholder="https://instagram.com/"
                  />
                )}
              </form.Field>
              <form.Field name="youtubeUrl">
                {(field) => (
                  <TextInput
                    field={field}
                    type="url"
                    label="YouTube Channel URL"
                    placeholder="https://youtube.com/"
                  />
                )}
              </form.Field>
              <form.Field name="xUrl">
                {(field) => (
                  <TextInput
                    field={field}
                    type="url"
                    label="X Profile URL"
                    hint="Formerly Twitter"
                    placeholder="https://x.com/"
                  />
                )}
              </form.Field>
              <form.Field name="otherUrl">
                {(field) => (
                  <TextInput
                    field={field}
                    type="url"
                    label="Other"
                    placeholder="https://"
                  />
                )}
              </form.Field>
            </div>
          </Card>
        </div>
      </ApplyMain>
      <ApplyFooter current="more-details" />
    </div>
  )
}
