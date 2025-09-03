import { useEffect, useMemo, useRef, useState } from 'react'
import { reviews } from '../../data/reviews'

function Star({ filled }: { filled: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={`h-4 w-4 ${filled ? 'fill-amber-400' : 'fill-gray-300'}`}
      aria-hidden="true"
    >
      <path d="M12 .587l3.668 7.431 8.2 1.192-5.934 5.787 1.402 8.168L12 18.896l-7.336 3.869 1.402-8.168L.132 9.21l8.2-1.192L12 .587z" />
    </svg>
  )
}

function Stars({ n }: { n: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} filled={i < n} />
      ))}
    </div>
  )
}

export default function TestimonialsSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [idx, setIdx] = useState(0)
  const [paused, setPaused] = useState(false)
  const total = reviews.length

  const scrollToIndex = (i: number, behavior: ScrollBehavior = 'smooth') => {
    const el = containerRef.current
    if (!el) return
    const child = el.children[i] as HTMLElement | undefined
    if (!child) return
    const targetLeft = child.offsetLeft - (el.clientWidth - child.clientWidth) / 2
    el.scrollTo({ left: targetLeft, behavior })
  }

  useEffect(() => {
    scrollToIndex(idx)
  }, [idx])

  // Auto-advance horizontally without causing page scroll
  useEffect(() => {
    if (paused) return
    const id = setInterval(() => setIdx((i) => (i + 1) % total), 5000)
    return () => clearInterval(id)
  }, [total, paused])

  const onPrev = () => setIdx((i) => (i - 1 + total) % total)
  const onNext = () => setIdx((i) => (i + 1) % total)

  const items = useMemo(() => reviews, [])

  return (
    <section className="mt-10">
      <div className="rounded-3xl bg-gradient-to-r from-sky-50 to-indigo-50 p-4 ring-1 ring-white/60 shadow-sm md:p-6">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">Khán giả nói gì về chúng tôi</h2>
            <p className="text-sm text-gray-600">Cảm nhận thật từ những trải nghiệm tại rạp PhuocLocCine</p>
          </div>
          <div className="hidden gap-2 md:flex">
            <button onClick={onPrev} className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white text-gray-700 shadow ring-1 ring-gray-200 hover:bg-gray-50 cursor-pointer">‹</button>
            <button onClick={onNext} className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white text-gray-700 shadow ring-1 ring-gray-200 hover:bg-gray-50 cursor-pointer">›</button>
          </div>
        </div>

        <div className="relative">
          {/* Edge fades */}
          <div className="pointer-events-none absolute left-0 top-0 h-full w-10 bg-gradient-to-r from-sky-50 to-transparent"></div>
          <div className="pointer-events-none absolute right-0 top-0 h-full w-10 bg-gradient-to-l from-indigo-50 to-transparent"></div>

          {/* Track */}
          <div
            ref={containerRef}
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            className="scrollbar-none flex snap-x snap-mandatory gap-4 overflow-x-auto px-1"
          >
            {items.map((r) => (
              <article
                key={r.id}
                className="relative w-80 shrink-0 snap-center rounded-2xl bg-white/80 p-5 shadow-md ring-1 ring-white/60 backdrop-blur-md transition hover:-translate-y-0.5 hover:shadow-lg"
              >
                <div className="absolute -left-2 -top-2 rotate-12 text-4xl text-sky-100">❝</div>
                <div className="absolute right-3 top-3 rounded-full bg-amber-50 px-2 py-0.5 text-xs font-semibold text-amber-700 ring-1 ring-amber-200">★ {r.rating}/5</div>
                <div className="flex items-center gap-3">
                  <img src={r.avatarUrl} alt={r.name} className="h-10 w-10 rounded-full object-cover ring-2 ring-offset-2 ring-sky-200 ring-offset-white" />
                  <div>
                    <div className="text-sm font-semibold text-gray-900">{r.name}</div>
                    <div className="text-xs text-gray-500">{r.location}</div>
                  </div>
                </div>
                <div className="mt-2"><Stars n={r.rating} /></div>
                <p className="mt-2 text-sm leading-relaxed text-gray-700">“{r.comment}”</p>
              </article>
            ))}
          </div>

          {/* Dots */}
          <div className="mt-4 flex justify-center gap-2">
            {items.map((_, i) => (
              <button
                key={i}
                onClick={() => setIdx(i)}
                className={`h-2.5 w-2.5 rounded-full ${i === idx ? 'bg-sky-600' : 'bg-gray-300'} cursor-pointer`}
                aria-label={`Chuyển đến review ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
