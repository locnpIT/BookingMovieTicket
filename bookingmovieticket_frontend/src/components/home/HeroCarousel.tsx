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
      {/* Cinema Spotlight Effect Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-red-500/5 to-transparent pointer-events-none z-20" />
      
      {slides.map((s, i) => (
        <div
          key={i}
          className={`absolute inset-0 transition-all duration-1000 ease-in-out ${i === idx ? 'opacity-100 scale-100' : 'opacity-0 scale-105'}`}
          style={{ backgroundImage: `url(${s.imageUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
        >
          {/* Enhanced Cinema Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 via-red-900/20 to-black/30" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/40" />
          
          <div className="absolute left-8 md:left-12 lg:left-16 top-1/2 -translate-y-1/2 text-white max-w-2xl animate-fadeIn z-30">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold drop-shadow-2xl mb-3 leading-tight bg-gradient-to-r from-amber-400 via-white to-amber-400 bg-clip-text text-transparent animate-shimmer">
              {s.title}
            </h2>
            {s.subtitle && (
              <p className="mt-2 max-w-xl text-sm md:text-base text-slate-200 drop-shadow-lg leading-relaxed">
                {s.subtitle}
              </p>
            )}
            <div className="mt-6 flex flex-wrap gap-3">
              <button className="group relative overflow-hidden rounded-xl btn-cinema px-6 py-3 text-sm font-bold text-white shadow-xl transition-all duration-300 hover:shadow-2xl hover:scale-105 active:scale-95">
                <span className="relative z-10 flex items-center gap-2">
                  <span>🎬</span>
                  <span>Đặt vé ngay</span>
                </span>
                <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
              </button>
              <button className="rounded-xl border-2 border-amber-500/60 bg-amber-500/20 backdrop-blur-sm px-6 py-3 text-sm font-bold text-amber-300 transition-all hover:bg-amber-500/30 hover:border-amber-400 hover:text-amber-200 hover:scale-105 active:scale-95 shadow-lg">
                Xem chi tiết
              </button>
            </div>
          </div>
        </div>
      ))}
      <button
        onClick={prev}
        className="group absolute left-4 top-1/2 -translate-y-1/2 z-30 inline-flex h-12 w-12 items-center justify-center rounded-full bg-black/70 backdrop-blur-sm text-white shadow-xl transition-all hover:bg-red-600/80 hover:scale-110 active:scale-95 cursor-pointer border border-amber-500/30"
        aria-label="Previous slide"
      >
        <span className="text-2xl font-bold transition-transform group-hover:-translate-x-0.5">‹</span>
      </button>
      <button
        onClick={next}
        className="group absolute right-4 top-1/2 -translate-y-1/2 z-30 inline-flex h-12 w-12 items-center justify-center rounded-full bg-black/70 backdrop-blur-sm text-white shadow-xl transition-all hover:bg-red-600/80 hover:scale-110 active:scale-95 cursor-pointer border border-amber-500/30"
        aria-label="Next slide"
      >
        <span className="text-2xl font-bold transition-transform group-hover:translate-x-0.5">›</span>
      </button>
      <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-30">
        {slides.map((_, i) => (
          <button 
            key={i} 
            onClick={() => setIdx(i)} 
            className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
              i === idx 
                ? 'w-8 bg-gradient-to-r from-red-600 to-amber-500 shadow-lg shadow-amber-500/50' 
                : 'w-2 bg-white/40 hover:bg-white/60'
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
