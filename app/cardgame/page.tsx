'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState, useCallback } from 'react'
import SafeImage from '@/components/SafeImage'
import { STAT_LABELS, type Card } from '@/lib/cards'

type GameStatus = 'WAITING' | 'ACTIVE' | 'FINISHED'

interface GameState {
  id: string
  status: GameStatus
  isMyTurn: boolean
  myCard: Card | null
  myDeckSize: number
  oppDeckSize: number
  opponent: { username: string; displayName: string; avatarEmoji: string } | null
  winnerId: string | null
  iWon: boolean
}

interface LobbyGame {
  id: string
  player1: { username: string; displayName: string; avatarEmoji: string }
}

interface RoundResult {
  p1Card: Card
  p2Card: Card
  stat: string
  p1Val: number
  p2Val: number
  roundWinner: string | null
  p1DeckSize: number
  p2DeckSize: number
  status: string
  winnerId: string | null
}

const TIER_BG: Record<string, string> = {
  ICON:      'from-purple-900 via-amber-800 to-yellow-600',
  TOTY:      'from-blue-950 via-blue-800 to-cyan-500',
  TOTS:      'from-green-950 via-green-800 to-green-600',
  RARE_GOLD: 'from-yellow-900 via-amber-800 to-yellow-700',
  SILVER:    'from-gray-700 via-gray-600 to-gray-500',
  BRONZE:    'from-amber-900 via-amber-700 to-amber-600',
}

const TIER_BORDER: Record<string, string> = {
  ICON: 'border-yellow-400', TOTY: 'border-cyan-400', TOTS: 'border-green-400',
  RARE_GOLD: 'border-yellow-500', SILVER: 'border-gray-400', BRONZE: 'border-amber-500',
}

function MiniCard({ card, highlight, statKey }: { card: Card; highlight?: boolean; statKey?: string }) {
  return (
    <div className={`rounded-2xl border-2 ${TIER_BORDER[card.tier]} bg-gradient-to-b ${TIER_BG[card.tier]} p-3 w-36 shadow-xl ${highlight ? 'ring-4 ring-volt-400 scale-105' : ''} transition-all`}>
      <div className="flex justify-between items-start mb-1">
        <span className="text-[9px] font-extrabold bg-black/30 px-1.5 py-0.5 rounded text-white/80">{card.tier}</span>
        <span className="text-xl font-extrabold text-yellow-300">{card.rating}</span>
      </div>
      <div className="w-full h-20 rounded-lg overflow-hidden bg-black/20 mb-2">
        <SafeImage src={`/api/player-image/${card.wikiName}`} alt={card.name} className="w-full h-full object-cover object-top" fallback="⚽" />
      </div>
      <div className="text-center text-[10px] font-extrabold text-white uppercase tracking-wider mb-2">{card.shortName}</div>
      <div className="grid grid-cols-2 gap-x-1 gap-y-0.5">
        {(['pac','sho','pas','dri','def','phy'] as const).map(s => (
          <div key={s} className={`flex items-center gap-1 text-[9px] font-bold ${statKey === s ? 'text-volt-400' : 'text-white/70'}`}>
            <span className="w-5">{s.toUpperCase()}</span>
            <span className={statKey === s ? 'text-volt-400 font-extrabold' : ''}>{card[s]}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function CardGamePage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  const [view, setView] = useState<'lobby' | 'waiting' | 'playing' | 'result'>('lobby')
  const [lobby, setLobby] = useState<LobbyGame[]>([])
  const [gameId, setGameId] = useState<string | null>(null)
  const [gameState, setGameState] = useState<GameState | null>(null)
  const [lastRound, setLastRound] = useState<RoundResult | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/login?next=/cardgame')
  }, [status, router])

  const fetchLobby = useCallback(async () => {
    const res = await fetch('/api/game/lobby')
    if (res.ok) {
      const data = await res.json()
      setLobby(data.waiting)
      if (data.myActiveGameId) {
        setGameId(data.myActiveGameId)
        setView('playing')
      }
    }
  }, [])

  const fetchGame = useCallback(async () => {
    if (!gameId) return
    const res = await fetch(`/api/game/${gameId}`)
    if (res.ok) {
      const data = await res.json()
      setGameState(data)
      if (data.status === 'ACTIVE') setView('playing')
      if (data.status === 'FINISHED') setView('result')
    }
  }, [gameId])

  useEffect(() => {
    if (status !== 'authenticated') return
    fetchLobby()
  }, [status, fetchLobby])

  useEffect(() => {
    if (!gameId) return
    const interval = setInterval(fetchGame, 2000)
    fetchGame()
    return () => clearInterval(interval)
  }, [gameId, fetchGame])

  const createGame = async () => {
    setLoading(true)
    const res = await fetch('/api/game/create', { method: 'POST' })
    const data = await res.json()
    setGameId(data.gameId)
    setView('waiting')
    setLoading(false)
  }

  const joinGame = async (id: string) => {
    setLoading(true)
    await fetch('/api/game/join', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ gameId: id }) })
    setGameId(id)
    setLoading(false)
  }

  const makeMove = async (stat: string) => {
    if (!gameId || !gameState?.isMyTurn) return
    setLoading(true)
    const res = await fetch('/api/game/move', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ gameId, stat }),
    })
    const data = await res.json()
    setLastRound(data)
    setShowResult(true)
    setTimeout(() => {
      setShowResult(false)
      fetchGame()
    }, 2500)
    setLoading(false)
  }

  const resetGame = () => {
    setGameId(null)
    setGameState(null)
    setLastRound(null)
    setShowResult(false)
    setView('lobby')
    fetchLobby()
  }

  if (status === 'loading' || status === 'unauthenticated') {
    return <div className="flex items-center justify-center min-h-96"><div className="text-white/50">Loading...</div></div>
  }

  const user = session?.user as any

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
      <div className="text-center">
        <div className="inline-flex items-center gap-2 bg-volt-400/10 border border-volt-400/20 rounded-full px-4 py-1.5 mb-3">
          <span className="text-volt-400 font-bold text-sm">🃏 Card Battle</span>
        </div>
        <h1 className="text-4xl font-extrabold text-white">Top <span className="text-volt-400">Trumps</span></h1>
        <p className="text-white/50 mt-1">Pick your best stat and beat your opponent!</p>
      </div>

      {/* LOBBY */}
      {view === 'lobby' && (
        <div className="space-y-4">
          <button onClick={createGame} disabled={loading} className="btn-primary w-full text-lg py-4">
            {loading ? '⏳ Creating...' : '⚡ Create New Game'}
          </button>

          {lobby.length > 0 && (
            <div className="card space-y-3">
              <h2 className="font-bold text-white text-lg">🎮 Games Waiting for Players</h2>
              {lobby.map(g => (
                <div key={g.id} className="flex items-center justify-between bg-white/5 rounded-xl px-4 py-3">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{g.player1.avatarEmoji}</span>
                    <div>
                      <div className="font-bold text-white">{g.player1.displayName}</div>
                      <div className="text-white/40 text-xs">@{g.player1.username}</div>
                    </div>
                  </div>
                  <button onClick={() => joinGame(g.id)} disabled={loading} className="btn-primary text-sm px-4 py-2">
                    Join ⚽
                  </button>
                </div>
              ))}
            </div>
          )}

          {lobby.length === 0 && (
            <div className="card text-center py-8">
              <div className="text-4xl mb-3">😴</div>
              <p className="text-white/50">No games waiting. Create one and challenge a friend!</p>
            </div>
          )}
        </div>
      )}

      {/* WAITING FOR OPPONENT */}
      {view === 'waiting' && (
        <div className="card text-center py-12 space-y-4">
          <div className="text-5xl animate-bounce">⏳</div>
          <h2 className="text-2xl font-extrabold text-white">Waiting for opponent...</h2>
          <p className="text-white/50">Share your game! Tell a friend to go to <span className="text-volt-400 font-bold">mykickzone.vercel.app/cardgame</span></p>
          <div className="text-white/30 text-sm font-mono bg-black/30 rounded-lg px-4 py-2 inline-block">Game ID: {gameId}</div>
          <button onClick={resetGame} className="btn text-sm text-white/50 hover:text-white">Cancel</button>
        </div>
      )}

      {/* PLAYING */}
      {view === 'playing' && gameState && !showResult && (
        <div className="space-y-4">
          {/* Score bar */}
          <div className="card flex items-center justify-between">
            <div className="text-center">
              <div className="text-2xl">{user.avatarEmoji}</div>
              <div className="font-bold text-white text-sm">{user.displayName}</div>
              <div className="text-volt-400 font-extrabold text-xl">{gameState.myDeckSize} 🃏</div>
            </div>
            <div className="text-white/30 font-bold text-xl">VS</div>
            <div className="text-center">
              <div className="text-2xl">{gameState.opponent?.avatarEmoji ?? '❓'}</div>
              <div className="font-bold text-white text-sm">{gameState.opponent?.displayName ?? 'Waiting...'}</div>
              <div className="text-red-400 font-extrabold text-xl">{gameState.oppDeckSize} 🃏</div>
            </div>
          </div>

          {/* My card */}
          {gameState.myCard && (
            <div className="flex flex-col items-center gap-4">
              <MiniCard card={gameState.myCard} />

              {gameState.isMyTurn ? (
                <div className="w-full space-y-2">
                  <p className="text-center text-volt-400 font-bold">Your turn! Pick a stat:</p>
                  <div className="grid grid-cols-2 gap-2">
                    {(['pac','sho','pas','dri','def','phy'] as const).map(stat => (
                      <button
                        key={stat}
                        onClick={() => makeMove(stat)}
                        disabled={loading}
                        className="flex items-center justify-between bg-white/10 hover:bg-volt-400/20 border border-white/10 hover:border-volt-400/40 rounded-xl px-4 py-3 transition-all"
                      >
                        <span className="text-white/70 text-sm font-bold">{STAT_LABELS[stat]}</span>
                        <span className="text-volt-400 font-extrabold text-lg">{gameState.myCard![stat]}</span>
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="card text-center py-6">
                  <div className="text-3xl animate-pulse mb-2">⏳</div>
                  <p className="text-white/50">Waiting for <span className="text-white font-bold">{gameState.opponent?.displayName}</span> to pick...</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ROUND RESULT OVERLAY */}
      {showResult && lastRound && (
        <div className="space-y-4">
          <div className="flex justify-center gap-6 items-start">
            <div className="text-center space-y-1">
              <p className="text-white/50 text-xs font-bold">YOU</p>
              <MiniCard card={lastRound.p1Card} statKey={lastRound.stat} highlight={lastRound.roundWinner !== null && lastRound.p1Val > lastRound.p2Val} />
              <div className="text-2xl font-extrabold text-volt-400">{lastRound.p1Val}</div>
            </div>
            <div className="flex flex-col items-center pt-12 gap-2">
              <div className="text-white/30 font-bold">VS</div>
              <div className="text-sm font-bold text-white/50">{STAT_LABELS[lastRound.stat]}</div>
              {lastRound.roundWinner === null
                ? <div className="text-yellow-400 font-extrabold text-lg">DRAW!</div>
                : lastRound.p1Val > lastRound.p2Val
                  ? <div className="text-volt-400 font-extrabold text-lg">YOU WIN! 🎉</div>
                  : <div className="text-red-400 font-extrabold text-lg">THEY WIN 😬</div>
              }
            </div>
            <div className="text-center space-y-1">
              <p className="text-white/50 text-xs font-bold">OPPONENT</p>
              <MiniCard card={lastRound.p2Card} statKey={lastRound.stat} highlight={lastRound.roundWinner !== null && lastRound.p2Val > lastRound.p1Val} />
              <div className="text-2xl font-extrabold text-red-400">{lastRound.p2Val}</div>
            </div>
          </div>
        </div>
      )}

      {/* GAME OVER */}
      {view === 'result' && gameState && (
        <div className="card text-center py-12 space-y-4">
          <div className="text-6xl">{gameState.iWon ? '🏆' : '😢'}</div>
          <h2 className="text-3xl font-extrabold text-white">
            {gameState.iWon ? 'You Won!' : 'You Lost!'}
          </h2>
          <p className="text-white/50">
            {gameState.iWon ? 'Amazing! You took all the cards! 🎉' : 'Better luck next time! 💪'}
          </p>
          <button onClick={resetGame} className="btn-primary px-8 py-3">
            Play Again ⚽
          </button>
        </div>
      )}
    </div>
  )
}
