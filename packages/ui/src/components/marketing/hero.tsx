import { ArrowRight, MapPin, Search } from 'lucide-react'
import * as React from 'react'
import { Button } from '../ui/button'

export interface HeroProps {
  bgImage: string
  onSearch: (args: { q: string; location: string }) => void
}

export function Hero({ bgImage, onSearch }: HeroProps) {
  const [q, setQ] = React.useState('')
  const [loc, setLoc] = React.useState('')
  return (
    <section className="relative min-h-[500px] md:min-h-[600px] flex items-center mb-16 md:mb-24 overflow-hidden rounded-b-lg">
      <div className="absolute inset-0 z-0">
        <div
          className="w-full h-full bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url('${bgImage}')` }}
        />
      </div>
      <div
        className="absolute inset-0 z-10 md:w-3/4"
        style={{
          background:
            'linear-gradient(90deg, rgba(248,250,251,0.95) 0%, rgba(248,250,251,0.7) 50%, rgba(248,250,251,0.2) 100%)',
        }}
      />
      <div className="relative z-20 w-full px-margin-mobile md:px-margin-desktop py-12 md:py-24 max-w-2xl">
        <h1 className="font-display text-[40px] md:text-[56px] font-bold leading-[1.1] tracking-[-0.02em] text-on-surface mb-6">
          Find your new best friend
        </h1>
        <p className="text-[16px] text-on-surface-variant mb-10 max-w-xl">
          Every pet deserves a loving home. Start your journey today and discover
          the joy of adopting a rescue animal.
        </p>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            onSearch({ q, location: loc })
          }}
          className="bg-surface rounded-lg p-4 shadow-[0_4px_20px_rgba(0,36,41,0.05)] border border-surface-variant flex flex-col md:flex-row gap-4 items-center"
        >
          <div className="w-full md:w-2/5 flex items-center bg-surface-container-low rounded px-4 py-3 border border-surface-variant focus-within:border-primary-container focus-within:ring-1 focus-within:ring-primary-container transition-all">
            <Search size={20} className="text-outline mr-3 shrink-0" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="w-full bg-transparent border-none focus:ring-0 outline-none p-0 text-on-surface placeholder:text-outline-variant text-[16px]"
              placeholder="Search breeds..."
              type="text"
            />
          </div>
          <div className="w-full md:w-2/5 flex items-center bg-surface-container-low rounded px-4 py-3 border border-surface-variant focus-within:border-primary-container focus-within:ring-1 focus-within:ring-primary-container transition-all">
            <MapPin size={20} className="text-outline mr-3 shrink-0" />
            <input
              value={loc}
              onChange={(e) => setLoc(e.target.value)}
              className="w-full bg-transparent border-none focus:ring-0 outline-none p-0 text-on-surface placeholder:text-outline-variant text-[16px]"
              placeholder="Zip code or City"
              type="text"
            />
          </div>
          <Button type="submit" variant="default" className="w-full md:w-auto">
            Search <ArrowRight size={18} />
          </Button>
        </form>
      </div>
    </section>
  )
}
