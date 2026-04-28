'use client'

import { useState, useEffect, useMemo } from 'react'
import { CARDS, type Card } from '@/lib/cards'

// Filter out duplicate ICON/TOTY variants — keep only unique real players
const PLAYER_POOL: Card[] = (() => {
  const seen = new Set<string>()
  return CARDS.filter(c => {
    const key = c.name.replace(/ ICON| TOTY| TOTS/i, '').trim()
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
})()

function dailySeed(): number {
  const d = new Date()
  return d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate()
}

function getTodaysPlayer(): Card {
  const seed = dailySeed()
  const idx  = seed % PLAYER_POOL.length
  return PLAYER_POOL[idx]
}

function ratingBand(r: number) {
  if (r >= 90) return '90+'
  if (r >= 85) return '85–89'
  if (r >= 80) return '80–84'
  return '<80'
}

type HintKey = 'nationality' | 'position' | 'team' | 'ratingBand' | 'name'
type HintState = 'correct' | 'wrong'

interface GuessResult {
  card: Card
  hints: Record<HintKey, HintState>
}

const COLUMNS: { key: HintKey; label: string; getValue: (c: Card) => string }[] = [
  { key: 'nationality', label: 'Flag',     getValue: c => c.nationality },
  { key: 'position',    label: 'Position', getValue: c => c.position },
  { key: 'team',        label: 'Club',     getValue: c => c.team },
  { key: 'ratingBand',  label: 'Rating',   getValue: c => ratingBand(c.rating) },
]

const HINT_COLORS: Record<HintState, string> = {
  correct: 'bg-volt-400/20 border-volt-400/60 text-volt-400',
  wrong:   'bg-white/5    border-white/10    text-white/50',
}

const MAX_GUESSES = 6

export default function WordlePage() {
  const answer = useMemo(() => getTodaysPlayer(), [])

  const [input,   setInput]   = useState('')
  const [guesses, setGuesses] = useState<GuessResult[]>([])
  const [won,     setWon]     = useState(false)
  const [lost,    setLost]    = useState(false)
  const [matches, setMatches] = useState<Card[]>([])

  // Load saved state for today
  useEffect(() => {
    const raw = localStorage.getItem(`kickzone_wordle_${dailySeed()}`)
    if (!raw) return
    const saved = JSON.parse(raw)
    setGuesses(saved.guesses || [])
    setWon(saved.won || false)
    setLost(saved.lost || false)
  }, [])

  const persist = (g: GuessResult[], w: boolean, l: boolean) => {
    localStorage.setItem(`kickzone_wordle_${dailySeed()}`, JSON.stringify({ guesses: g, won: w, lost: l }))
  }

  const filterMatches = (val: string) => {
    if (val.length < 2) { setMatches([]); return }
    const q = val.toLowerCase()
    const guessedIds = new Set(guesses.map(g => g.card.id))
    setMatches(
      PLAYER_POOL.filter(c => !guessedIds.has(c.id) && c.name.toLowerCase().includes(q)).slice(0, 6)
    )
  }

  const makeGuess = (card: Card) => {
    if (won || lost) return
    const isCorrect = card.id === answer.id

    const hints: Record<HintKey, HintState> = {
      nationality: card.nationality === answer.nationality ? 'correct' : 'wrong',
      position:    card.position    === answer.position    ? 'correct' : 'wrong',
      team:        card.team        === answer.team        ? 'correct' : 'wrong',
      ratingBand:  ratingBand(card.rating) === ratingBand(answer.rating) ? 'correct' : 'wrong',
      name:        isCorrect ? 'correct' : 'wrong',
    }

    const next = [...guesses, { card, hints }]
    const nowWon  = isCorrect
    const nowLost = !isCorrect && next.length >= MAX_GUESSES

    setGuesses(next)
    setWon(nowWon)
    setLost(nowLost)
    setInput('')
    setMatches([])
    persist(next, nowWon, nowLost)
  }

  const done = won || lost
  const remaining = MAX_GUESSES - guesses.length

  return (
    <div className="max-w-xl mx-auto px-4 sm:px-6 py-8 space-y-6">

      {/* Header */}
      <div className="text-center">
        <div className="text-6xl mb-3">🟩</div>
        <h1 className="text-4xl font-extrabold text-white mb-1">
          Footie <span className="text-volt-400">Wordle</span>
        </h1>
        <p className="text-white/50">Guess today's mystery player in {MAX_GUESSES} tries!</p>
        <p className="text-white/30 text-xs mt-1">Resets daily · {PLAYER_POOL.length} players in pool</p>
      </div>

      {/* Column headers */}
      <div className="grid grid-cols-5 gap-2 text-center">
        <div className="text-xs font-extrabold text-white/30 uppercase col-span-1">Player</div>
        {COLUMNS.map(c => (
          <div key={c.key} className="text-xs font-extrabold text-white/30 uppercase">{c.label}</div>
        ))}
      </div>

      {/* Guess rows */}
      <div className="space-y-2">
        {guesses.map((g, i) => (
          <div key={i} className="grid grid-cols-5 gap-2 items-center">
            <div className={`col-span-1 rounded-xl border px-2 py-3 text-center text-xs font-bold leading-tight ${
              g.hints.name === 'correct' ? HINT_COLORS.correct : HINT_COLORS.wrong
            }`}>
              {g.card.shortName}
            </div>
            {COLUMNS.map(col => (
              <div key={col.key} className={`rounded-xl border px-1 py-3 text-center text-xs font-bold leading-tight transition-all ${HINT_COLORS[g.hints[col.key]]}`}>
                {col.getValue(g.card)}
              </div>
            ))}
          </div>
        ))}

        {/* Empty rows */}
        {!done && Array.from({ length: remaining }).map((_, i) => (
          <div key={`empty-${i}`} className="grid grid-cols-5 gap-2">
            {Array.from({ length: 5 }).map((_, j) => (
              <div key={j} className="rounded-xl border border-white/5 bg-white/2 h-12" />
            ))}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex justify-center gap-4 text-xs">
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-4 rounded bg-volt-400/20 border border-volt-400/60" />
          <span className="text-white/40">Correct</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-4 rounded bg-white/5 border border-white/10" />
          <span className="text-white/40">Wrong</span>
        </div>
      </div>

      {/* Win / Loss */}
      {(won || lost) && (
        <div className={`card text-center py-8 border-2 ${won ? 'border-volt-400/50 bg-volt-400/5' : 'border-red-500/30 bg-red-500/5'}`}>
          <div className="text-5xl mb-3">{won ? '🏆' : '😬'}</div>
          <p className={`text-2xl font-extrabold mb-2 ${won ? 'text-volt-400' : 'text-red-400'}`}>
            {won ? `Got it in ${guesses.length}!` : 'Unlucky!'}
          </p>
          <p className="text-white/60 text-sm mb-1">
            Today's player was <span className="text-white font-bold">{answer.name}</span>
          </p>
          <p className="text-white/30 text-xs">{answer.team} · {answer.position} · {answer.nationality}</p>
          <p className="text-white/30 text-xs mt-3">Come back tomorrow for a new player!</p>
        </div>
      )}

      {/* Search input */}
      {!done && (
        <div className="relative">
          <input
            type="text"
            placeholder="Type a player name to guess…"
            value={input}
            onChange={e => { setInput(e.target.value); filterMatches(e.target.value) }}
            className="w-full bg-white/5 border border-white/20 rounded-2xl px-4 py-3.5 text-white placeholder-white/30 focus:outline-none focus:border-volt-400/50 text-sm"
          />
          {matches.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-dark-800 border border-white/10 rounded-2xl overflow-hidden shadow-2xl z-10">
              {matches.map(c => (
                <button
                  key={c.id}
                  onClick={() => makeGuess(c)}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 text-left transition-colors"
                >
                  <span className="text-lg">{c.nationality}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-white">{c.name}</p>
                    <p className="text-xs text-white/40">{c.team} · {c.position}</p>
                  </div>
                  <span className="text-xs font-bold text-white/40">{c.rating}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Hint guide */}
      <div className="card space-y-1 text-sm text-white/40">
        <p className="font-bold text-white/60 text-xs uppercase tracking-wider mb-2">How to play</p>
        <p>🟩 Green = that clue matches the mystery player exactly</p>
        <p>⬜ Grey = that clue doesn't match — try again!</p>
        <p>Hints: flag, position, club, rating band</p>
      </div>

    </div>
  )
}
