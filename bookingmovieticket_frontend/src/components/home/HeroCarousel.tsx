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
    <div className="relative w-full overflow-hidden h-[42vh] md:h-[55vh] lg:h-[68vh] rounded-b-3xl shadow-2xl">
      {slides.map((s, i) => (
        <div
          key={i}
          className={`absolute inset-0 transition-all duration-1000 ease-in-out ${i === idx ? 'opacity-100 scale-100' : 'opacity-0 scale-105'}`}
          style={{ backgroundImage: `url(${s.imageUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-black/20" />
          <div className="absolute left-8 md:left-12 lg:left-16 top-1/2 -translate-y-1/2 text-white max-w-2xl animate-fadeIn">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold drop-shadow-2xl mb-3 leading-tight">{s.title}</h2>
            {s.subtitle && <p className="mt-2 max-w-xl text-sm md:text-base opacity-95 drop-shadow-lg leading-relaxed">{s.subtitle}</p>}
            <div className="mt-6 flex flex-wrap gap-3">
              <button className="group relative overflow-hidden rounded-xl bg-gradient-to-r from-sky-600 to-indigo-600 px-6 py-3 text-sm font-bold text-white shadow-xl transition-all duration-300 hover:from-sky-700 hover:to-indigo-700 hover:scale-105 active:scale-95">
                <span className="relative z-10">Đặt vé ngay</span>
                <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
              </button>
              <button className="rounded-xl border-2 border-white/40 bg-white/15 backdrop-blur-sm px-6 py-3 text-sm font-bold text-white transition-all hover:bg-white/25 hover:border-white/60 hover:scale-105 active:scale-95">
                Xem chi tiết
              </button>
            </div>
          </div>
        </div>
      ))}
      <button
        onClick={prev}
        className="group absolute left-4 top-1/2 -translate-y-1/2 z-10 inline-flex h-12 w-12 items-center justify-center rounded-full bg-black/50 backdrop-blur-sm text-white shadow-xl transition-all hover:bg-black/70 hover:scale-110 active:scale-95 cursor-pointer"
        aria-label="Previous slide"
      >
        <span className="text-2xl font-bold transition-transform group-hover:-translate-x-0.5">‹</span>
      </button>
      <button
        onClick={next}
        className="group absolute right-4 top-1/2 -translate-y-1/2 z-10 inline-flex h-12 w-12 items-center justify-center rounded-full bg-black/50 backdrop-blur-sm text-white shadow-xl transition-all hover:bg-black/70 hover:scale-110 active:scale-95 cursor-pointer"
        aria-label="Next slide"
      >
        <span className="text-2xl font-bold transition-transform group-hover:translate-x-0.5">›</span>
      </button>
      <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-10">
        {slides.map((_, i) => (
          <button 
            key={i} 
            onClick={() => setIdx(i)} 
            className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
              i === idx 
                ? 'w-8 bg-white shadow-lg' 
                : 'w-2 bg-white/50 hover:bg-white/75'
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
