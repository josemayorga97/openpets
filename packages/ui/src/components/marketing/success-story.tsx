import { Star } from 'lucide-react'
import type { SuccessStory as SuccessStoryT } from '@repo/domain'

export interface SuccessStoryProps {
  story: SuccessStoryT
}

export function SuccessStory({ story }: SuccessStoryProps) {
  return (
    <section className="px-margin-mobile md:px-margin-desktop mb-24" id="success-stories">
      <div className="rounded-lg overflow-hidden border border-surface-variant shadow-[0_4px_20px_rgba(0,36,41,0.05)] flex flex-col md:flex-row bg-surface-container-low">
        <div className="w-full md:w-1/2">
          <img
            alt={`Adopted ${story.petName}`}
            className="w-full h-full object-cover min-h-[300px] md:min-h-[400px]"
            src={story.photo}
          />
        </div>
        <div className="w-full md:w-1/2 p-8 md:p-12 lg:p-16 flex flex-col justify-center">
          <div className="flex items-center gap-1 text-primary-container mb-6">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} size={20} fill="currentColor" />
            ))}
          </div>
          <h2 className="font-display text-[28px] md:text-[32px] font-semibold tracking-[-0.01em] text-on-surface mb-4 leading-tight">
            "{story.quote}"
          </h2>
          <p className="text-[16px] text-on-surface-variant mb-8 leading-relaxed">
            "{story.body}"
          </p>
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-surface-container rounded flex items-center justify-center text-on-surface-variant font-label text-[12px] font-medium">
              {story.adopterInitials}
            </div>
            <div>
              <p className="font-label text-[12px] font-medium tracking-[0.05em] uppercase text-on-surface">
                {story.adopterNames}
              </p>
              <p className="text-xs text-on-surface-variant mt-0.5">
                Adopted {story.petName} in {story.year}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
