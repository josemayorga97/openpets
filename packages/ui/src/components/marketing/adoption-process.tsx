import { Handshake, Home, Search } from 'lucide-react'

const STEPS = [
  {
    icon: Search,
    title: '1. Search',
    body: 'Browse our extensive database of lovable pets looking for their forever homes.',
  },
  {
    icon: Handshake,
    title: '2. Meet',
    body: 'Schedule a meet-and-greet to ensure you and your potential pet are a perfect match.',
  },
  {
    icon: Home,
    title: '3. Adopt',
    body: 'Complete the adoption process and welcome your new best friend home.',
  },
]

export function AdoptionProcess() {
  return (
    <section className="px-margin-mobile md:px-margin-desktop mb-24">
      <div className="rounded-lg py-16 px-4 border border-surface-variant bg-surface-container-low">
        <div className="text-center mb-12">
          <h2 className="font-display text-[32px] font-semibold tracking-[-0.01em] text-primary-container mb-3">
            Adoption Process
          </h2>
          <p className="text-[16px] text-on-surface-variant max-w-2xl mx-auto">
            Simple steps to bring your new family member home.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 max-w-4xl mx-auto">
          {STEPS.map((step, i) => (
            <div key={step.title} className="text-center flex flex-col items-center">
              <div className="w-16 h-16 bg-surface rounded flex items-center justify-center text-primary-container mb-5 border border-surface-variant relative shadow-sm">
                <step.icon size={32} />
                {i < STEPS.length - 1 && (
                  <div className="hidden md:block absolute w-full h-px bg-surface-variant left-full top-1/2 -z-10" />
                )}
              </div>
              <h3 className="font-display text-[24px] font-semibold text-on-surface mb-2">
                {step.title}
              </h3>
              <p className="text-[16px] text-on-surface-variant">{step.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
