import { Link, createFileRoute } from '@tanstack/react-router'
import { ArrowLeft, Brain } from 'lucide-react'

export const Route = createFileRoute('/_public/quiz')({ component: QuizStub })

function QuizStub() {
  return (
    <div className="max-w-2xl mx-auto px-margin-mobile md:px-margin-desktop py-24 text-center">
      <div className="w-20 h-20 mx-auto bg-primary-container rounded-full flex items-center justify-center mb-6">
        <Brain size={40} className="text-on-primary-container" />
      </div>
      <h1 className="font-display text-[40px] font-bold tracking-[-0.02em] text-on-surface mb-4">
        Match Quiz coming soon
      </h1>
      <p className="text-[16px] text-on-surface-variant mb-8">
        We'll match you with pets that fit your home and lifestyle in 60 seconds.
      </p>
      <Link
        to="/"
        className="font-label text-[12px] font-medium uppercase tracking-[0.05em] text-primary-container hover:underline inline-flex items-center gap-1"
      >
        <ArrowLeft size={16} /> Back home
      </Link>
    </div>
  )
}
