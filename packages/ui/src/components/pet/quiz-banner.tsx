import { Link } from '@tanstack/react-router'
import { Brain } from 'lucide-react'

export interface QuizBannerProps {
  variant?: 'inline' | 'desktop'
}

export function QuizBanner({ variant = 'inline' }: QuizBannerProps) {
  if (variant === 'desktop') {
    return (
      <div className="mt-12 hidden lg:flex bg-surface-container-low border border-outline-variant rounded-2xl p-6 items-center justify-between gap-6 shadow-sm">
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 bg-primary-container rounded-full flex items-center justify-center shrink-0">
            <Brain size={36} className="text-on-primary-container" />
          </div>
          <div>
            <h3 className="font-display text-[28px] font-semibold text-primary mb-1">
              Find Your Best Match
            </h3>
            <p className="text-[18px] text-on-surface-variant">
              It only takes 60 seconds to find your new best friend!
            </p>
          </div>
        </div>
        <Link
          to="/quiz"
          className="bg-primary text-on-primary font-label text-[12px] font-medium uppercase tracking-[0.05em] py-3 px-8 rounded-full whitespace-nowrap hover:bg-primary-container transition-colors shadow-sm"
        >
          Take the Quiz
        </Link>
      </div>
    )
  }
  return (
    <div className="bg-surface-container-low border border-outline-variant rounded-xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 bg-primary-container rounded-full flex items-center justify-center shrink-0">
          <Brain size={28} className="text-on-primary-container" />
        </div>
        <div>
          <h3 className="font-display text-[20px] font-semibold text-primary">
            Find Your Best Match
          </h3>
          <p className="text-[16px] text-on-surface-variant">
            It only takes 60 seconds!
          </p>
        </div>
      </div>
      <Link
        to="/quiz"
        className="bg-primary text-on-primary font-label text-[12px] font-medium uppercase tracking-[0.05em] py-3 px-6 rounded-full whitespace-nowrap w-full sm:w-auto hover:bg-primary-container transition-colors text-center"
      >
        Take the Quiz
      </Link>
    </div>
  )
}
