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
      <div className="rounded-3xl bg-gradient-to-br from-purple-50 to-pink-50 p-8 text-center border border-purple-200">
        <div className="flex items-center justify-center py-8">
          <div className="text-center">
            <div className="inline-block h-10 w-10 animate-spin rounded-full border-4 border-purple-200 border-t-purple-600 mb-4" />
            <div className="text-sm font-medium text-gray-600">Đang tải Pokemon...</div>
          </div>
        </div>
      </div>
    )
  }

  if (!gameStarted) {
    return (
      <div className="rounded-3xl bg-gradient-to-br from-purple-50 to-pink-50 p-8 text-center border border-purple-200">
        <div className="mb-6">
          <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-4xl mb-4 shadow-lg">
            🎴
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Trò chơi Lật Thẻ Pokemon</h2>
          <p className="text-gray-600 mb-4">
            Tìm các cặp Pokemon giống nhau. Càng ít lượt lật, điểm càng cao!
          </p>
          <div className="inline-flex items-center gap-2 rounded-full bg-purple-100 px-4 py-2 text-sm font-semibold text-purple-700">
            <span>💡</span>
            <span>Điểm tối đa: 100 điểm</span>
          </div>
        </div>
        <Button 
          onClick={initializeGame} 
          className="px-8 py-3 text-base"
          disabled={pokemonList.length === 0}
        >
          {pokemonList.length === 0 ? 'Đang tải...' : 'Bắt đầu chơi'}
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between rounded-xl bg-white p-4 shadow-md">
        <div className="text-sm font-medium text-gray-600">
          Lượt lật: <span className="font-bold text-purple-600">{moves}</span>
        </div>
        <div className="text-sm font-medium text-gray-600">
          Đã khớp: <span className="font-bold text-emerald-600">{matches} / {POKEMON_COUNT}</span>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-3">
        {cards.map((card, idx) => (
          <button
            key={idx}
            onClick={() => handleCardClick(idx)}
            disabled={card.flipped || card.matched || gameOver}
            className={`relative h-24 md:h-28 rounded-xl transition-all duration-300 overflow-hidden ${
              card.matched
                ? 'bg-emerald-500 scale-95 cursor-not-allowed ring-4 ring-emerald-300'
                : card.flipped
                ? 'bg-gradient-to-br from-purple-400 to-pink-400 scale-105 shadow-lg cursor-pointer ring-2 ring-purple-300'
                : 'bg-gradient-to-br from-slate-300 to-slate-400 hover:from-slate-400 hover:to-slate-500 hover:scale-105 cursor-pointer'
            } ${gameOver ? 'cursor-not-allowed' : ''}`}
          >
            {card.flipped || card.matched ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center p-2">
                <img
                  src={card.pokemon.image}
                  alt={card.pokemon.name}
                  className="w-full h-full object-contain"
                />
                {card.matched && (
                  <div className="absolute inset-0 bg-emerald-500/80 flex items-center justify-center">
                    <span className="text-white text-3xl font-bold">✓</span>
                  </div>
                )}
              </div>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-4xl">❓</span>
              </div>
            )}
          </button>
        ))}
      </div>

      {gameOver && (
        <div className="rounded-xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 p-4 text-center">
          <div className="text-lg font-bold text-emerald-700 mb-2">🎉 Hoàn thành!</div>
          <div className="text-sm text-gray-600">
            Bạn đã hoàn thành với {moves} lượt lật
          </div>
        </div>
      )}
    </div>
  )
}
