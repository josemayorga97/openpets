import { Link, createFileRoute } from '@tanstack/react-router'
import { signInWithGoogle } from '@repo/auth'
import { Icon } from '../../components/icon'

export const Route = createFileRoute('/_public/')({
  component: JoinLandingPage,
})

function JoinLandingPage() {
  const handleLogin = async () => {
    await signInWithGoogle('/dashboard')
  }
  return (
    <>
      <header className="w-full bg-surface-container-lowest border-b border-outline-variant py-4 px-container-margin sticky top-0 z-40 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon
            name="pets"
            fill
            className="text-primary text-[28px]"
          />
          <span className="text-headline-md font-extrabold text-primary">
            OpenPets
          </span>
        </div>
        <button
          type="button"
          onClick={handleLogin}
          className="inline-flex items-center gap-2 h-10 px-5 rounded-full bg-primary text-on-primary text-label-md hover:bg-primary/90 transition-colors cursor-pointer"
        >
          <Icon name="login" className="text-[18px]" />
          Login
        </button>
      </header>

      <main className="w-full flex-1 flex flex-col">
        <section className="w-full bg-primary-container text-on-primary-container py-16 px-container-margin">
          <div className="max-w-[1000px] mx-auto flex flex-col md:flex-row gap-8 items-center">
            <div className="flex-1">
              <h1 className="text-headline-xl text-white mb-6">
                Join the OpenPets Community
              </h1>
              <p className="text-body-lg text-primary-fixed max-w-2xl">
                Welcome! We're excited to help you apply for membership. Let's
                go over the application process, step by step, to ensure your
                organization is ready to start finding homes for pets.
              </p>
            </div>
            <div className="md:w-[400px] bg-surface-container-lowest rounded-xl p-6 shadow-lg border border-outline-variant/50 text-on-surface">
              <div className="flex items-center gap-3 mb-4">
                <Icon name="lightbulb" className="text-primary" />
                <h3 className="text-[20px] font-headline-md text-primary">
                  Pro tips to help it go smoothly.
                </h3>
              </div>
              <ul className="list-disc list-inside text-body-sm text-on-surface-variant space-y-2">
                <li>Be ready to complete your application in one session.</li>
                <li>
                  Have your organization's documentation ready (e.g., Tax ID,
                  Vet Reference).
                </li>
                <li>Save any written responses off-site, just in case.</li>
              </ul>
            </div>
          </div>
        </section>

        <div className="flex-1 max-w-[1000px] mx-auto w-full px-container-margin py-12 space-y-16">
          <section>
            <div className="mb-8 text-center">
              <h2 className="text-headline-lg text-on-surface mb-3">
                Eligibility Criteria
              </h2>
              <p className="text-body-lg text-on-surface-variant max-w-2xl mx-auto">
                Before you start your application, review our checklist to see
                which types of organizations are eligible for membership.
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <EligibilityCard
                kind="eligible"
                items={[
                  'Municipal Public Shelters',
                  'Private Shelters',
                  'Rescues with pets in their direct care',
                  'Veterinary Clinics who rehome pets',
                ]}
              />
              <EligibilityCard
                kind="ineligible"
                items={[
                  'Networking or Referral-Only Groups',
                  'Pet guardians rehoming their own pet',
                  'Show or Hobby Breeders',
                  'Any for-profit pet placement',
                ]}
              />
            </div>
          </section>

          <section>
            <div className="mb-8">
              <h2 className="text-headline-lg text-on-surface mb-3">
                Getting Ready
              </h2>
              <p className="text-body-lg text-on-surface-variant">
                Gather your materials and review our guidelines to ensure a
                smooth application process.
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <ReadyCard
                icon="gavel"
                title="Review OpenPets Code of Conduct"
                body="As animal advocates, we want to make sure pets are kept in a professional, caring environment while awaiting adoption."
                cta={{ label: 'REVIEW CODE OF CONDUCT', variant: 'outline' }}
              />
              <ReadyCard
                icon="local_hospital"
                title="Complete Vet Form"
                body={
                  <>
                    Download and fill out the Veterinary Verification Form
                    (you'll need your local veterinarian's signature). Then
                    email the form to{' '}
                    <a
                      href="mailto:registration@openpets.org"
                      className="text-primary underline font-medium"
                    >
                      registration@openpets.org
                    </a>
                    .
                  </>
                }
                hint="Tip: Email the form on the same day you submit your application."
                cta={{
                  label: 'DOWNLOAD VET FORM',
                  icon: 'download',
                  variant: 'solid',
                }}
                alert="Application review can only begin after we receive your completed Vet Form."
              />
              <div className="md:col-span-2">
                <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant shadow-sm flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <Icon name="request_quote" className="text-primary" />
                  </div>
                  <div>
                    <h3 className="text-[18px] font-headline-md text-on-surface mb-2">
                      Locate Your Federal Tax ID Number (if Applicable)
                    </h3>
                    <p className="text-body-md text-on-surface-variant mb-2">
                      If you are a 501(c)(3) charity, you will need your EIN to
                      complete the application.
                    </p>
                    <p className="text-body-md text-on-surface-variant">
                      If you're unsure of your federal 501(c)(3) status, verify
                      that you appear in the IRS charity search.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="bg-primary-container rounded-2xl p-8 md:p-12 text-center relative overflow-hidden shadow-lg mt-8">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent" />
            <div className="relative z-10 max-w-2xl mx-auto flex flex-col items-center">
              <h2 className="text-headline-lg text-white mb-4">
                Start and Complete Your Application
              </h2>
              <div className="bg-surface-container-lowest/10 backdrop-blur-sm border border-surface-container-lowest/20 rounded-lg p-5 mb-8 w-full">
                <p className="text-body-md text-primary-fixed flex items-center justify-center gap-2">
                  <Icon name="warning" className="text-status-warning" />
                  <span>
                    As you complete your application, don't close the tab you're
                    working in; you'll lose all progress.
                  </span>
                </p>
              </div>
              <Link
                to="/apply/about-adoptions"
                className="inline-flex items-center justify-center h-14 px-10 rounded-full bg-surface-container-lowest text-primary text-[18px] font-headline-md hover:bg-surface-container transition-all shadow-md gap-3 hover:scale-105 duration-200"
              >
                START APPLICATION
                <Icon name="arrow_forward" className="text-[24px]" />
              </Link>
            </div>
          </section>

          <section className="flex flex-col items-center text-center py-8">
            <Icon
              name="hourglass_empty"
              className="text-primary/40 text-[40px] mb-3"
            />
            <h2 className="text-headline-md text-on-surface mb-2">
              We'll be in touch soon!
            </h2>
            <p className="text-body-md text-on-surface-variant max-w-xl">
              Once you submit your application, keep up the good work of
              helping pets find great homes! We'll review your information and
              get back to you within 3–5 business days.
            </p>
          </section>
        </div>
      </main>
    </>
  )
}

function EligibilityCard({
  kind,
  items,
}: {
  kind: 'eligible' | 'ineligible'
  items: ReadonlyArray<string>
}) {
  const isEligible = kind === 'eligible'
  return (
    <div
      className={`bg-surface-container-lowest p-8 rounded-2xl border-2 shadow-sm relative overflow-hidden ${
        isEligible ? 'border-status-success/20' : 'border-error/20'
      }`}
    >
      <div
        className={`absolute top-0 left-0 w-full h-2 ${
          isEligible ? 'bg-status-success' : 'bg-error'
        }`}
      />
      <div className="flex items-center gap-3 mb-6">
        <Icon
          name={isEligible ? 'check_circle' : 'cancel'}
          className={`text-[32px] ${
            isEligible ? 'text-status-success' : 'text-error'
          }`}
        />
        <h3 className="text-[24px] font-headline-md text-on-surface">
          {isEligible ? 'Eligible' : 'Not Eligible'}
        </h3>
      </div>
      <ul className="space-y-4">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-3">
            <div
              className={`w-1.5 h-1.5 rounded-full mt-2 shrink-0 ${
                isEligible ? 'bg-status-success' : 'bg-error'
              }`}
            />
            <span className="text-body-md text-on-surface">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

function ReadyCard({
  icon,
  title,
  body,
  hint,
  cta,
  alert,
}: {
  icon: string
  title: string
  body: React.ReactNode
  hint?: string
  cta: { label: string; icon?: string; variant: 'outline' | 'solid' }
  alert?: string
}) {
  const isSolid = cta.variant === 'solid'
  return (
    <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant shadow-sm flex flex-col h-full">
      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
        <Icon name={icon} className="text-primary" />
      </div>
      <h3 className="text-[18px] font-headline-md text-on-surface mb-3">
        {title}
      </h3>
      <p className="text-body-sm text-on-surface-variant mb-3">{body}</p>
      {hint ? (
        <p className="text-body-sm text-on-surface-variant italic mb-6">
          {hint}
        </p>
      ) : null}
      {alert ? (
        <div className="mt-auto space-y-4">
          <div className="bg-surface-variant/50 rounded p-3 flex gap-2 items-start">
            <Icon name="info" className="text-primary text-[18px] mt-0.5" />
            <span className="text-[13px] leading-tight text-on-surface-variant">
              {alert}
            </span>
          </div>
          <button
            type="button"
            className={`w-full flex items-center justify-center h-10 px-4 rounded text-label-md gap-2 transition-colors ${
              isSolid
                ? 'bg-primary text-on-primary hover:bg-primary/90'
                : 'border border-primary text-primary hover:bg-primary hover:text-on-primary'
            }`}
          >
            {cta.icon ? <Icon name={cta.icon} className="text-[18px]" /> : null}
            {cta.label}
          </button>
        </div>
      ) : (
        <button
          type="button"
          className={`mt-auto w-full flex items-center justify-center h-10 px-4 rounded text-label-md transition-colors ${
            isSolid
              ? 'bg-primary text-on-primary hover:bg-primary/90'
              : 'border border-primary text-primary hover:bg-primary hover:text-on-primary'
          }`}
        >
          {cta.label}
        </button>
      )}
    </div>
  )
}
