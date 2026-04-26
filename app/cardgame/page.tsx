'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState, useCallback, useRef } from 'react'
import SafeImage from '@/components/SafeImage'
import { STAT_LABELS, CARDS, shuffle, type Card } from '@/lib/cards'

type GameStatus = 'WAITING' | 'ACTIVE' | 'FINISHED'

// ---------- Multiplayer types ----------
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
  roundWinner: 'me' | 'cpu' | 'draw'
  myDeckSize: number
  oppDeckSize: number
  finished: boolean
  iWon: boolean
}

// ---------- Shared card UI ----------
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

const STATS = ['pac','sho','pas','dri','def','phy'] as const

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
        {STATS.map(s => (
          <div key={s} className={`flex items-center gap-1 text-[9px] font-bold ${statKey === s ? 'text-volt-400' : 'text-white/70'}`}>
            <span className="w-5">{s.toUpperCase()}</span>
            <span className={statKey === s ? 'text-volt-400 font-extrabold' : ''}>{card[s]}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ============================================================
// VS COMPUTER GAME
// ============================================================
type Difficulty = 'easy' | 'medium' | 'hard'

function cpuPickStat(card: Card, difficulty: Difficulty): string {
  const best = STATS.reduce((b, s) => card[s] > card[b as typeof s] ? s : b, 'pac' as string)
  if (difficulty === 'hard') return best
  if (difficulty === 'easy') return STATS[Math.floor(Math.random() * STATS.length)]
  // medium: 50/50
  return Math.random() < 0.5 ? best : STATS[Math.floor(Math.random() * STATS.length)]
}

const DIFFICULTY_CONFIG = {
  easy:   { label: '🟢 Easy',   desc: 'CPU picks randomly',       color: 'border-green-500 bg-green-500/10' },
  medium: { label: '🟡 Medium', desc: 'CPU sometimes picks best', color: 'border-yellow-500 bg-yellow-500/10' },
  hard:   { label: '🔴 Hard',   desc: 'CPU always picks best',    color: 'border-red-500 bg-red-500/10' },
}

function VsComputer({ onBack }: { onBack: () => void }) {
  const [difficulty, setDifficulty] = useState<Difficulty | null>(null)
  const [myDeck, setMyDeck] = useState<Card[]>([])
  const [cpuDeck, setCpuDeck] = useState<Card[]>([])
  const [roundResult, setRoundResult] = useState<RoundResult | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [cpuThinking, setCpuThinking] = useState(false)
  const [myTurn, setMyTurn] = useState(true)
  const [finished, setFinished] = useState(false)
  const [iWon, setIWon] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const startGame = (diff: Difficulty) => {
    setDifficulty(diff)
    const shuffled = shuffle([...CARDS])
    const mid = Math.floor(shuffled.length / 2)
    setMyDeck(shuffled.slice(0, mid))
    setCpuDeck(shuffled.slice(mid))
    setMyTurn(true)
  }

  const resolveRound = useCallback((stat: string, mDeck: Card[], cDeck: Card[], isMyPick: boolean, diff: Difficulty) => {
    const myCard = mDeck[0]
    const cpuCard = cDeck[0]
    const myVal = myCard[stat as keyof Card] as number
    const cpuVal = cpuCard[stat as keyof Card] as number

    let newMyDeck = mDeck.slice(1)
    let newCpuDeck = cDeck.slice(1)
    let winner: RoundResult['roundWinner'] = 'draw'

    if (myVal > cpuVal) {
      winner = 'me'
      newMyDeck = [...newMyDeck, myCard, cpuCard]
    } else if (cpuVal > myVal) {
      winner = 'cpu'
      newCpuDeck = [...newCpuDeck, cpuCard, myCard]
    } else {
      newMyDeck = [...newMyDeck, myCard]
      newCpuDeck = [...newCpuDeck, cpuCard]
    }

    const gameOver = newMyDeck.length === 0 || newCpuDeck.length === 0
    const won = newCpuDeck.length === 0

    setMyDeck(newMyDeck)
    setCpuDeck(newCpuDeck)
    setRoundResult({ p1Card: myCard, p2Card: cpuCard, stat, p1Val: myVal, p2Val: cpuVal, roundWinner: winner, myDeckSize: newMyDeck.length, oppDeckSize: newCpuDeck.length, finished: gameOver, iWon: won })
    setShowResult(true)

    if (gameOver) {
      setFinished(true)
      setIWon(won)
      return
    }

    timerRef.current = setTimeout(() => {
      setShowResult(false)
      setMyTurn(winner === 'me' || (winner === 'draw' && isMyPick))
      if (winner === 'cpu' || (winner === 'draw' && !isMyPick)) {
        setCpuThinking(true)
        timerRef.current = setTimeout(() => {
          setCpuThinking(false)
          resolveRound(cpuPickStat(newCpuDeck[0], diff), newMyDeck, newCpuDeck, false, diff)
        }, 1200)
      }
    }, 2200)
  }, [])

  useEffect(() => {
    return () => { if (timerRef.current) clearTimeout(timerRef.current) }
  }, [])

  // Difficulty picker
  if (!difficulty) {
    return (
      <div className="space-y-4">
        <h2 className="text-xl font-extrabold text-white text-center">Choose Difficulty</h2>
        <div className="space-y-3">
          {(Object.entries(DIFFICULTY_CONFIG) as [Difficulty, typeof DIFFICULTY_CONFIG.easy][]).map(([key, cfg]) => (
            <button key={key} onClick={() => startGame(key)}
              className={`w-full card border ${cfg.color} text-left p-4 hover:scale-[1.02] transition-all`}>
              <div className="font-extrabold text-white text-lg">{cfg.label}</div>
              <div className="text-white/50 text-sm">{cfg.desc}</div>
            </button>
          ))}
        </div>
        <button onClick={onBack} className="text-white/30 text-sm hover:text-white/60 transition-colors w-full text-center">← Back</button>
      </div>
    )
  }

  const pickStat = (stat: string) => {
    if (!myTurn || showResult || cpuThinking || myDeck.length === 0 || !difficulty) return
    resolveRound(stat, myDeck, cpuDeck, true, difficulty)
  }

  if (myDeck.length === 0 && cpuDeck.length === 0) {
    return <div className="card text-center py-12"><div className="text-white/50">Setting up game...</div></div>
  }

  return (
    <div className="space-y-4">
      {/* Score bar */}
      <div className="card flex items-center justify-between">
        <div className="text-center">
          <div className="text-2xl">😊</div>
          <div className="font-bold text-white text-sm">You</div>
          <div className="text-volt-400 font-extrabold text-xl">{myDeck.length} 🃏</div>
        </div>
        <div className="text-white/30 font-bold text-xl">VS</div>
        <div className="text-center">
          <div className="text-2xl">🤖</div>
          <div className="font-bold text-white text-sm">Computer</div>
          <div className="text-red-400 font-extrabold text-xl">{cpuDeck.length} 🃏</div>
        </div>
      </div>

      {/* Round result */}
      {showResult && roundResult && (
        <div className="flex justify-center gap-6 items-start">
          <div className="text-center space-y-1">
            <p className="text-white/50 text-xs font-bold">YOU</p>
            <MiniCard card={roundResult.p1Card} statKey={roundResult.stat} highlight={roundResult.roundWinner === 'me'} />
            <div className="text-2xl font-extrabold text-volt-400">{roundResult.p1Val}</div>
          </div>
          <div className="flex flex-col items-center pt-10 gap-2">
            <div className="text-white/30 font-bold">VS</div>
            <div className="text-xs font-bold text-white/50">{STAT_LABELS[roundResult.stat]}</div>
            {roundResult.roundWinner === 'draw'
              ? <div className="text-yellow-400 font-extrabold">DRAW!</div>
              : roundResult.roundWinner === 'me'
                ? <div className="text-volt-400 font-extrabold">YOU WIN! 🎉</div>
                : <div className="text-red-400 font-extrabold">CPU WINS 🤖</div>
            }
          </div>
          <div className="text-center space-y-1">
            <p className="text-white/50 text-xs font-bold">CPU</p>
            <MiniCard card={roundResult.p2Card} statKey={roundResult.stat} highlight={roundResult.roundWinner === 'cpu'} />
            <div className="text-2xl font-extrabold text-red-400">{roundResult.p2Val}</div>
          </div>
        </div>
      )}

      {/* Game over */}
      {finished && !showResult && (
        <div className="card text-center py-10 space-y-4">
          <div className="text-6xl">{iWon ? '🏆' : '😢'}</div>
          <h2 className="text-3xl font-extrabold text-white">{iWon ? 'You Won!' : 'CPU Won!'}</h2>
          <p className="text-white/50">{iWon ? 'You beat the computer! 🎉' : 'The computer got all the cards! 💪'}</p>
          <div className="flex gap-3 justify-center flex-wrap">
            <button onClick={() => { setFinished(false); setShowResult(false); const s = shuffle([...CARDS]); const m = Math.floor(s.length/2); setMyDeck(s.slice(0,m)); setCpuDeck(s.slice(m)); setMyTurn(true) }} className="btn-primary px-6 py-3">Play Again ⚽</button>
            <button onClick={() => { setFinished(false); setShowResult(false); setDifficulty(null) }} className="btn px-6 py-3 text-white/70 hover:text-white border border-white/20">Change Difficulty</button>
            <button onClick={onBack} className="btn px-6 py-3 text-white/50 hover:text-white">Back to Lobby</button>
          </div>
        </div>
      )}

      {/* My card + stat picker */}
      {!finished && !showResult && myDeck.length > 0 && (
        <div className="flex flex-col items-center gap-4">
          <MiniCard card={myDeck[0]} />
          {myTurn && !cpuThinking ? (
            <div className="w-full space-y-2">
              <p className="text-center text-volt-400 font-bold">Your turn! Pick a stat:</p>
              <div className="grid grid-cols-2 gap-2">
                {STATS.map(stat => (
                  <button key={stat} onClick={() => pickStat(stat)} className="flex items-center justify-between bg-white/10 hover:bg-volt-400/20 border border-white/10 hover:border-volt-400/40 rounded-xl px-4 py-3 transition-all">
                    <span className="text-white/70 text-sm font-bold">{STAT_LABELS[stat]}</span>
                    <span className="text-volt-400 font-extrabold text-lg">{myDeck[0][stat]}</span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="card text-center py-6">
              <div className="text-3xl animate-pulse mb-2">🤖</div>
              <p className="text-white/50">Computer is thinking...</p>
            </div>
          )}
        </div>
      )}

      <button onClick={onBack} className="text-white/30 text-sm hover:text-white/60 transition-colors w-full text-center">← Back to lobby</button>
    </div>
  )
}

// ============================================================
// MULTIPLAYER GAME
// ============================================================
function Multiplayer({ session }: { session: any }) {
  const [view, setView] = useState<'lobby' | 'waiting' | 'playing' | 'result'>('lobby')
  const [lobby, setLobby] = useState<LobbyGame[]>([])
  const [gameId, setGameId] = useState<string | null>(null)
  const [gameState, setGameState] = useState<GameState | null>(null)
  const [lastRound, setLastRound] = useState<any | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [loading, setLoading] = useState(false)

  const fetchLobby = useCallback(async () => {
    const res = await fetch('/api/game/lobby')
    if (res.ok) {
      const data = await res.json()
      setLobby(data.waiting)
      if (data.myActiveGameId) { setGameId(data.myActiveGameId); setView('playing') }
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

  useEffect(() => { fetchLobby() }, [fetchLobby])

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
    setGameId(data.gameId); setView('waiting'); setLoading(false)
  }

  const joinGame = async (id: string) => {
    setLoading(true)
    await fetch('/api/game/join', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ gameId: id }) })
    setGameId(id); setLoading(false)
  }

  const makeMove = async (stat: string) => {
    if (!gameId || !gameState?.isMyTurn) return
    setLoading(true)
    const res = await fetch('/api/game/move', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ gameId, stat }) })
    const data = await res.json()
    setLastRound(data); setShowResult(true)
    setTimeout(() => { setShowResult(false); fetchGame() }, 2500)
    setLoading(false)
  }

  const resetGame = () => { setGameId(null); setGameState(null); setLastRound(null); setShowResult(false); setView('lobby'); fetchLobby() }
  const user = session?.user as any

  return (
    <div className="space-y-4">
      {view === 'lobby' && (
        <div className="space-y-4">
          <button onClick={createGame} disabled={loading} className="btn-primary w-full text-lg py-4">{loading ? '⏳ Creating...' : '⚡ Create New Game'}</button>
          {lobby.length > 0 ? (
            <div className="card space-y-3">
              <h2 className="font-bold text-white text-lg">🎮 Games Waiting</h2>
              {lobby.map(g => (
                <div key={g.id} className="flex items-center justify-between bg-white/5 rounded-xl px-4 py-3">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{g.player1.avatarEmoji}</span>
                    <div>
                      <div className="font-bold text-white">{g.player1.displayName}</div>
                      <div className="text-white/40 text-xs">@{g.player1.username}</div>
                    </div>
                  </div>
                  <button onClick={() => joinGame(g.id)} disabled={loading} className="btn-primary text-sm px-4 py-2">Join ⚽</button>
                </div>
              ))}
            </div>
          ) : (
            <div className="card text-center py-8">
              <div className="text-4xl mb-3">😴</div>
              <p className="text-white/50">No games waiting. Create one and challenge a friend!</p>
            </div>
          )}
        </div>
      )}

      {view === 'waiting' && (
        <div className="card text-center py-12 space-y-4">
          <div className="text-5xl animate-bounce">⏳</div>
          <h2 className="text-2xl font-extrabold text-white">Waiting for opponent...</h2>
          <p className="text-white/50">Tell a friend to go to <span className="text-volt-400 font-bold">mykickzone.vercel.app/cardgame</span></p>
          <button onClick={resetGame} className="text-white/40 text-sm hover:text-white">Cancel</button>
        </div>
      )}

      {view === 'playing' && gameState && !showResult && (
        <div className="space-y-4">
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
          {gameState.myCard && (
            <div className="flex flex-col items-center gap-4">
              <MiniCard card={gameState.myCard} />
              {gameState.isMyTurn ? (
                <div className="w-full space-y-2">
                  <p className="text-center text-volt-400 font-bold">Your turn! Pick a stat:</p>
                  <div className="grid grid-cols-2 gap-2">
                    {STATS.map(stat => (
                      <button key={stat} onClick={() => makeMove(stat)} disabled={loading} className="flex items-center justify-between bg-white/10 hover:bg-volt-400/20 border border-white/10 hover:border-volt-400/40 rounded-xl px-4 py-3 transition-all">
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

      {showResult && lastRound && (
        <div className="flex justify-center gap-6 items-start">
          <div className="text-center space-y-1">
            <p className="text-white/50 text-xs font-bold">YOU</p>
            <MiniCard card={lastRound.p1Card} statKey={lastRound.stat} highlight={lastRound.p1Val > lastRound.p2Val} />
            <div className="text-2xl font-extrabold text-volt-400">{lastRound.p1Val}</div>
          </div>
          <div className="flex flex-col items-center pt-10 gap-2">
            <div className="text-white/30 font-bold">VS</div>
            <div className="text-xs font-bold text-white/50">{STAT_LABELS[lastRound.stat]}</div>
            {lastRound.roundWinner === null ? <div className="text-yellow-400 font-extrabold">DRAW!</div>
              : lastRound.p1Val > lastRound.p2Val ? <div className="text-volt-400 font-extrabold">YOU WIN! 🎉</div>
              : <div className="text-red-400 font-extrabold">THEY WIN 😬</div>}
          </div>
          <div className="text-center space-y-1">
            <p className="text-white/50 text-xs font-bold">OPPONENT</p>
            <MiniCard card={lastRound.p2Card} statKey={lastRound.stat} highlight={lastRound.p2Val > lastRound.p1Val} />
            <div className="text-2xl font-extrabold text-red-400">{lastRound.p2Val}</div>
          </div>
        </div>
      )}

      {view === 'result' && gameState && (
        <div className="card text-center py-12 space-y-4">
          <div className="text-6xl">{gameState.iWon ? '🏆' : '😢'}</div>
          <h2 className="text-3xl font-extrabold text-white">{gameState.iWon ? 'You Won!' : 'You Lost!'}</h2>
          <p className="text-white/50">{gameState.iWon ? 'Amazing! 🎉' : 'Better luck next time! 💪'}</p>
          <button onClick={resetGame} className="btn-primary px-8 py-3">Play Again ⚽</button>
        </div>
      )}
    </div>
  )
}

// ============================================================
// MAIN PAGE
// ============================================================
export default function CardGamePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [mode, setMode] = useState<'choose' | 'cpu' | 'multi'>('choose')

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/login?next=/cardgame')
  }, [status, router])

  if (status === 'loading' || status === 'unauthenticated') {
    return <div className="flex items-center justify-center min-h-96"><div className="text-white/50">Loading...</div></div>
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
      <div className="text-center">
        <div className="inline-flex items-center gap-2 bg-volt-400/10 border border-volt-400/20 rounded-full px-4 py-1.5 mb-3">
          <span className="text-volt-400 font-bold text-sm">🃏 Card Battle</span>
        </div>
        <h1 className="text-4xl font-extrabold text-white">Top <span className="text-volt-400">Trumps</span></h1>
        <p className="text-white/50 mt-1">Pick your best stat and beat your opponent!</p>
      </div>

      {mode === 'choose' && (
        <div className="grid grid-cols-1 gap-4">
          <button onClick={() => setMode('cpu')} className="card hover:border-volt-400/40 border border-white/10 text-left p-6 transition-all hover:scale-[1.02] group">
            <div className="text-4xl mb-3">🤖</div>
            <h2 className="text-xl font-extrabold text-white group-hover:text-volt-400 transition-colors">vs Computer</h2>
            <p className="text-white/40 text-sm mt-1">Practice your skills against the AI — play solo anytime!</p>
          </button>
          <button onClick={() => setMode('multi')} className="card hover:border-pitch-400/40 border border-white/10 text-left p-6 transition-all hover:scale-[1.02] group">
            <div className="text-4xl mb-3">👥</div>
            <h2 className="text-xl font-extrabold text-white group-hover:text-pitch-400 transition-colors">vs Another Kid</h2>
            <p className="text-white/40 text-sm mt-1">Challenge a friend online — create a game and share the link!</p>
          </button>
        </div>
      )}

      {mode === 'cpu' && <VsComputer onBack={() => setMode('choose')} />}
      {mode === 'multi' && <Multiplayer session={session} />}
    </div>
  )
}
