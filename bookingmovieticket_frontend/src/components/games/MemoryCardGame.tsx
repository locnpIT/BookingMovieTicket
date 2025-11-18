import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { gameApi, type GameType } from '../../services/gameApi'
import Button from '../ui/Button'

type Pokemon = {
  id: number
  name: string
  image: string
}

type Card = {
  id: number
  pokemon: Pokemon
  flipped: boolean
  matched: boolean
}

const POKEMON_COUNT = 8

export default function MemoryCardGame({ onGameEnd }: { onGameEnd: (score: number, points: number) => void }) {
  const { token } = useAuth()
  const [cards, setCards] = useState<Card[]>([])
  const [flippedCards, setFlippedCards] = useState<number[]>([])
  const [moves, setMoves] = useState(0)
  const [matches, setMatches] = useState(0)
  const [gameStarted, setGameStarted] = useState(false)
  const [gameOver, setGameOver] = useState(false)
  const [loading, setLoading] = useState(false)
  const [loadingPokemon, setLoadingPokemon] = useState(false)
  const [pokemonList, setPokemonList] = useState<Pokemon[]>([])

  useEffect(() => {
    loadPokemon()
  }, [])

  async function loadPokemon() {
    setLoadingPokemon(true)
    try {
      const pokemonPromises = []
      for (let i = 1; i <= POKEMON_COUNT; i++) {
        pokemonPromises.push(
          fetch(`https://pokeapi.co/api/v2/pokemon/${i}`)
            .then(res => res.json())
            .then(data => ({
              id: data.id,
              name: data.name,
              image: data.sprites.other['official-artwork'].front_default || data.sprites.front_default
            }))
        )
      }
      const pokemon = await Promise.all(pokemonPromises)
      setPokemonList(pokemon)
    } catch (e) {
      console.error('Failed to load Pokemon', e)
      // Fallback to numbers if API fails
      setPokemonList([])
    } finally {
      setLoadingPokemon(false)
    }
  }

  const initializeGame = () => {
    if (pokemonList.length === 0) {
      alert('Đang tải Pokemon... Vui lòng thử lại sau!')
      return
    }

    // Create pairs of Pokemon
    const cardPairs = [...pokemonList, ...pokemonList]
    const shuffled = cardPairs
      .map((pokemon, index) => ({ 
        id: index, 
        pokemon, 
        flipped: false, 
        matched: false 
      }))
      .sort(() => Math.random() - 0.5)
    
    setCards(shuffled)
    setFlippedCards([])
    setMoves(0)
    setMatches(0)
    setGameStarted(true)
    setGameOver(false)
  }

  const handleCardClick = (cardId: number) => {
    if (flippedCards.length >= 2 || cards[cardId].flipped || cards[cardId].matched || gameOver) return

    setCards(prev => prev.map((card, idx) =>
      idx === cardId ? { ...card, flipped: true } : card
    ))

    const newFlipped = [...flippedCards, cardId]
    setFlippedCards(newFlipped)

    if (newFlipped.length === 2) {
      setMoves(prev => {
        const newMoves = prev + 1
        
        setTimeout(() => {
          setCards(prev => {
            const [first, second] = newFlipped
            const firstCard = prev[first]
            const secondCard = prev[second]

            if (firstCard.pokemon.id === secondCard.pokemon.id) {
              // Match found
              setMatches(prevMatches => {
                const newMatches = prevMatches + 1
                if (newMatches === POKEMON_COUNT) {
                  // Game won
                  setTimeout(() => finishGame(newMoves), 100)
                }
                return newMatches
              })
              return prev.map((card, idx) =>
                idx === first || idx === second ? { ...card, matched: true, flipped: false } : card
              )
            } else {
              // No match
              return prev.map((card, idx) =>
                idx === first || idx === second ? { ...card, flipped: false } : card
              )
            }
          })
          setFlippedCards([])
        }, 1000)
        
        return newMoves
      })
    }
  }

  async function finishGame(finalMoves: number) {
    setGameOver(true)
    setLoading(true)
    try {
      // Score = 100 - moves (lower moves = higher score)
      const score = Math.max(0, 100 - finalMoves * 5)
      const result = await gameApi.submitGame(token!, {
        gameType: 'MEMORY_CARD',
        score,
        gameData: JSON.stringify({ moves: finalMoves, matches: POKEMON_COUNT })
      })
      onGameEnd(score, result.pointsEarned)
    } catch (e) {
      console.error('Failed to submit game result', e)
    } finally {
      setLoading(false)
    }
  }

  if (loadingPokemon) {
    return (
      <div className="rounded-3xl glass-cinema p-8 text-center border border-red-500/30">
        <div className="flex items-center justify-center py-8">
          <div className="text-center">
            <div className="inline-block h-10 w-10 animate-spin rounded-full border-4 border-red-500/30 border-t-amber-500 mb-4" />
            <div className="text-sm font-medium text-slate-300">Đang tải Pokemon...</div>
          </div>
        </div>
      </div>
    )
  }

  if (!gameStarted) {
    return (
      <div className="rounded-3xl glass-cinema p-8 text-center border border-red-500/30">
        <div className="mb-6">
          <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-red-600 via-red-500 to-amber-500 text-4xl mb-4 shadow-lg ring-2 ring-amber-500/50 animate-pulse-glow">
            🎴
          </div>
          <h2 className="text-2xl font-bold gradient-text-cinema mb-2">Trò chơi Lật Thẻ Pokemon</h2>
          <p className="text-slate-300 mb-4">
            Tìm các cặp Pokemon giống nhau. Càng ít lượt lật, điểm càng cao!
          </p>
          <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-red-500/20 to-amber-500/20 border border-amber-500/30 px-4 py-2 text-sm font-semibold text-amber-300">
            <span>💡</span>
            <span>Điểm tối đa: 100 điểm</span>
          </div>
        </div>
        <Button 
          onClick={initializeGame} 
          className="px-8 py-3 text-base btn-cinema"
          disabled={pokemonList.length === 0}
        >
          {pokemonList.length === 0 ? 'Đang tải...' : 'Bắt đầu chơi'}
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between rounded-xl glass-cinema border border-red-500/30 p-4 shadow-lg">
        <div className="text-sm font-medium text-slate-300">
          Lượt lật: <span className="font-bold text-amber-400">{moves}</span>
        </div>
        <div className="text-sm font-medium text-slate-300">
          Đã khớp: <span className="font-bold text-emerald-400">{matches} / {POKEMON_COUNT}</span>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-3 md:gap-4 perspective-1000">
        {cards.map((card, idx) => (
          <button
            key={`${card.id}-${idx}`}
            onClick={() => handleCardClick(idx)}
            disabled={card.flipped || card.matched || gameOver}
            className={`relative h-24 md:h-32 w-full rounded-xl transition-all duration-500 overflow-hidden preserve-3d ${
              card.matched
                ? 'scale-95 cursor-not-allowed'
                : card.flipped
                ? 'scale-105 cursor-pointer'
                : 'hover:scale-105 cursor-pointer'
            } ${gameOver ? 'cursor-not-allowed' : ''} ${
              card.flipped ? 'rotate-y-180' : ''
            }`}
            style={{
              transformStyle: 'preserve-3d',
              transform: card.flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
            }}
          >
            {/* Card Back (Question Mark) */}
            <div 
              className={`absolute inset-0 rounded-xl backface-hidden flex items-center justify-center transition-all duration-500 ${
                card.flipped || card.matched
                  ? 'opacity-0 rotate-y-180'
                  : 'opacity-100 rotate-y-0'
              }`}
              style={{
                transform: card.flipped || card.matched ? 'rotateY(180deg)' : 'rotateY(0deg)',
                backfaceVisibility: 'hidden',
              }}
            >
              <div className="relative w-full h-full bg-gradient-to-br from-slate-700 via-slate-800 to-slate-900 rounded-xl border-2 border-amber-500/30 shadow-lg hover:border-amber-500/60 transition-all duration-300">
                {/* Shimmer effect on back */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-500/20 to-transparent animate-shimmer bg-[length:200%_100%]" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-4xl md:text-5xl drop-shadow-lg filter brightness-110">❓</span>
                </div>
                {/* Glow effect */}
                <div className="absolute inset-0 rounded-xl shadow-[0_0_20px_rgba(234,179,8,0.3)] opacity-0 hover:opacity-100 transition-opacity duration-300" />
              </div>
            </div>

            {/* Card Front (Pokemon Image) */}
            <div 
              className={`absolute inset-0 rounded-xl backface-hidden flex flex-col items-center justify-center p-2 transition-all duration-500 ${
                card.flipped || card.matched
                  ? 'opacity-100 rotate-y-0'
                  : 'opacity-0 rotate-y-180'
              }`}
              style={{
                transform: card.flipped || card.matched ? 'rotateY(0deg)' : 'rotateY(180deg)',
                backfaceVisibility: 'hidden',
              }}
            >
              <div className={`relative w-full h-full rounded-xl overflow-hidden ${
                card.matched
                  ? 'bg-gradient-to-br from-emerald-500 via-emerald-600 to-emerald-700 ring-4 ring-emerald-400/50 shadow-[0_0_30px_rgba(16,185,129,0.6)]'
                  : 'bg-gradient-to-br from-red-600 via-red-500 to-amber-500 ring-2 ring-amber-400/50 shadow-lg'
              } transition-all duration-500`}>
                {/* Glow effect when flipped */}
                {card.flipped && !card.matched && (
                  <div className="absolute inset-0 bg-gradient-to-br from-amber-500/30 to-red-500/30 animate-pulse" />
                )}
                
                {/* Pokemon Image */}
                <div className="relative w-full h-full flex items-center justify-center p-2">
                  <img
                    src={card.pokemon.image}
                    alt={card.pokemon.name}
                    className="w-full h-full object-contain drop-shadow-2xl filter brightness-110"
                  />
                </div>

                {/* Match Success Overlay */}
                {card.matched && (
                  <>
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/90 to-emerald-600/90 flex items-center justify-center animate-scaleIn">
                      <div className="text-center">
                        <span className="text-4xl md:text-5xl font-bold text-white drop-shadow-2xl animate-bounce">✓</span>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-20 h-20 rounded-full bg-emerald-400/50 animate-ping" />
                        </div>
                      </div>
                    </div>
                    {/* Sparkle particles effect */}
                    {[...Array(8)].map((_, i) => (
                      <div
                        key={i}
                        className="absolute w-2 h-2 bg-yellow-300 rounded-full animate-ping"
                        style={{
                          top: `${20 + (i * 10)}%`,
                          left: `${15 + (i * 12)}%`,
                          animationDelay: `${i * 0.1}s`,
                          animationDuration: '1s',
                        }}
                      />
                    ))}
                  </>
                )}
              </div>
            </div>
          </button>
        ))}
      </div>

      {gameOver && (
        <div className="rounded-xl bg-gradient-to-r from-emerald-900/40 to-emerald-800/40 border border-emerald-500/50 p-4 text-center shadow-lg shadow-emerald-500/20 animate-scaleIn">
          <div className="text-lg font-bold gradient-text-cinema mb-2 flex items-center justify-center gap-2">
            <span className="text-2xl animate-bounce">🎉</span>
            <span>Hoàn thành!</span>
          </div>
          <div className="text-sm text-slate-300">
            Bạn đã hoàn thành với <span className="font-bold text-amber-400">{moves}</span> lượt lật
          </div>
        </div>
      )}
    </div>
  )
}
