import { useEffect, useState } from 'react'

type Slide = { imageUrl: string; title: string; subtitle?: string }

export default function HeroCarousel({ slides, autoMs = 5000 }: { slides: Slide[]; autoMs?: number }) {
  const [idx, setIdx] = useState(0)
  useEffect(() => {
    const id = setInterval(() => setIdx((i) => (i + 1) % slides.length), autoMs)
    return () => clearInterval(id)
  }, [slides.length, autoMs])

  function prev() {
    setIdx((i) => (i - 1 + slides.length) % slides.length)
  }
  function next() {
    setIdx((i) => (i + 1) % slides.length)
  }

  return (
    <div className="relative w-full overflow-hidden h-[42vh] md:h-[55vh] lg:h-[65vh]">
      {slides.map((s, i) => (
        <div
          key={i}
          className={`absolute inset-0 transition-opacity duration-700 ${i === idx ? 'opacity-100' : 'opacity-0'}`}
          style={{ backgroundImage: `url(${s.imageUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />
          <div className="absolute left-8 top-1/2 -translate-y-1/2 text-white">
            <h2 className="text-3xl font-bold drop-shadow">{s.title}</h2>
            {s.subtitle && <p className="mt-2 max-w-xl text-sm opacity-90 drop-shadow">{s.subtitle}</p>}
            <div className="mt-4 flex gap-3">
              <button className="rounded-lg bg-gradient-to-r from-sky-600 to-indigo-600 px-4 py-2 text-sm font-medium text-white hover:from-sky-700 hover:to-indigo-700">Đặt vé ngay</button>
              <button className="rounded-lg bg-white/20 px-4 py-2 text-sm font-medium hover:bg-white/30">Xem chi tiết</button>
            </div>
          </div>
        </div>
      ))}
      <button
        onClick={prev}
        className="absolute left-3 top-1/2 -translate-y-1/2 inline-flex h-10 w-10 items-center justify-center rounded-full bg-black/40 text-white shadow hover:bg-black/60 cursor-pointer"
      >
        ‹
      </button>
      <button
        onClick={next}
        className="absolute right-3 top-1/2 -translate-y-1/2 inline-flex h-10 w-10 items-center justify-center rounded-full bg-black/40 text-white shadow hover:bg-black/60 cursor-pointer"
      >
        ›
      </button>
      <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-2">
        {slides.map((_, i) => (
          <button key={i} onClick={() => setIdx(i)} className={`h-2 w-2 rounded-full ${i === idx ? 'bg-white' : 'bg-white/50'} cursor-pointer`} />
        ))}
      </div>
    </div>
  )
}
