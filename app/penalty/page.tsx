'use client'

import { useState, useEffect } from 'react'

type Zone = 'TL' | 'TC' | 'TR' | 'ML' | 'MC' | 'MR'

const ZONES: { id: Zone; label: string; emoji: string }[] = [
  { id: 'TL', label: 'Top Left',    emoji: '↖' },
  { id: 'TC', label: 'Top Centre',  emoji: '⬆' },
  { id: 'TR', label: 'Top Right',   emoji: '↗' },
  { id: 'ML', label: 'Mid Left',    emoji: '⬅' },
  { id: 'MC', label: 'Centre',      emoji: '🎯' },
  { id: 'MR', label: 'Mid Right',   emoji: '➡' },
]

// Keeper dive weights — more likely to dive left/right than stay centre
const KEEPER_WEIGHTS: Record<Zone, number> = {
  TL: 18, TC: 8, TR: 18,
  ML: 22, MC: 4, MR: 22,
}

function pickKeeperZone(): Zone {
  const total = Object.values(KEEPER_WEIGHTS).reduce((a, b) => a + b, 0)
  let r = Math.random() * total
  for (const [zone, w] of Object.entries(KEEPER_WEIGHTS) as [Zone, number][]) {
    r -= w
    if (r <= 0) return zone
  }
  return 'ML'
}

interface Kick { player: Zone; keeper: Zone; goal: boolean }

const TOTAL_KICKS = 5
const XP_PER_GOAL = 2
const XP_BONUS_5 = 10

export default function PenaltyPage() {
  const [phase, setPhase]       = useState<'pick' | 'reveal' | 'done'>('pick')
  const [kicks, setKicks]       = useState<Kick[]>([])
  const [lastKick, setLastKick] = useState<Kick | null>(null)
  const [storedXP, setStoredXP] = useState(0)

  useEffect(() => {
    setStoredXP(parseInt(localStorage.getItem('kickzone_xp') || '0'))
  }, [])

  const goals   = kicks.filter(k => k.goal).length
  const current = kicks.length + 1
  const done    = kicks.length >= TOTAL_KICKS

  const shoot = (zone: Zone) => {
    if (phase !== 'pick' || done) return
    const keeper = pickKeeperZone()
    const goal   = keeper !== zone
    const kick   = { player: zone, keeper, goal }
    setLastKick(kick)
    setPhase('reveal')
    setTimeout(() => {
      const next = [...kicks, kick]
      setKicks(next)
      if (next.length >= TOTAL_KICKS) {
        const scored   = next.filter(k => k.goal).length
        const xp       = scored * XP_PER_GOAL + (scored === TOTAL_KICKS ? XP_BONUS_5 : 0)
        const newTotal = storedXP + xp
        setStoredXP(newTotal)
        localStorage.setItem('kickzone_xp', String(newTotal))
        setPhase('done')
      } else {
        setPhase('pick')
      }
    }, 1800)
  }

  const reset = () => {
    setKicks([])
    setLastKick(null)
    setPhase('pick')
  }

  const scored = kicks.filter(k => k.goal).length
  const xpEarned = scored * XP_PER_GOAL + (scored === TOTAL_KICKS ? XP_BONUS_5 : 0)

  return (
    <div className="max-w-xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="text-6xl mb-3">⚽</div>
        <h1 className="text-4xl font-extrabold text-white mb-1">
          Penalty <span className="text-volt-400">Shootout</span>
        </h1>
        <p className="text-white/50">5 kicks — pick your spot, beat the keeper!</p>
        <div className="mt-3 inline-flex items-center gap-2 bg-volt-400/10 border border-volt-400/20 rounded-full px-4 py-1.5">
          <span className="text-volt-400 font-bold text-sm">⚡ Total XP: {storedXP}</span>
        </div>
      </div>

      {/* Score tracker */}
      <div className="card flex items-center justify-between">
        <div className="text-center">
          <div className="text-3xl font-extrabold text-volt-400">{scored}</div>
          <div className="text-white/40 text-xs">Goals</div>
        </div>
        <div className="flex gap-2">
          {Array.from({ length: TOTAL_KICKS }).map((_, i) => {
            const k = kicks[i]
            return (
              <div key={i} className={`w-9 h-9 rounded-full border-2 flex items-center justify-center text-lg transition-all ${
                !k ? 'border-white/20 bg-white/5 text-white/20' :
                k.goal ? 'border-volt-400 bg-volt-400/20 text-volt-400' :
                'border-red-500 bg-red-500/20 text-red-400'
              }`}>
                {!k ? (i === kicks.length ? '⚽' : '–') : k.goal ? '⚽' : '🧤'}
              </div>
            )
          })}
        </div>
        <div className="text-center">
          <div className="text-xl font-extrabold text-white/50">
            {done ? 'FT' : `${current}/5`}
          </div>
          <div className="text-white/30 text-xs">Kick</div>
        </div>
      </div>

      {/* Goal visual */}
      <div className="card p-0 overflow-hidden">
        {/* Crossbar */}
        <div className="bg-white/10 h-2 w-full" />
        {/* Net with zones */}
        <div
          className="relative p-3"
          style={{
            background: 'repeating-linear-gradient(0deg,transparent,transparent 19px,rgba(255,255,255,0.04) 19px,rgba(255,255,255,0.04) 20px),repeating-linear-gradient(90deg,transparent,transparent 19px,rgba(255,255,255,0.04) 19px,rgba(255,255,255,0.04) 20px)',
          }}
        >
          <div className="grid grid-cols-3 gap-2">
            {ZONES.map(z => {
              const isPlayerZone = lastKick?.player === z.id
              const isKeeperZone = lastKick?.keeper === z.id
              const isGoal       = phase === 'reveal' && isPlayerZone && lastKick?.goal
              const isSaved      = phase === 'reveal' && isPlayerZone && !lastKick?.goal

              return (
                <button
                  key={z.id}
                  onClick={() => shoot(z.id)}
                  disabled={phase !== 'pick' || done}
                  className={`
                    relative h-20 rounded-xl font-extrabold text-2xl transition-all flex flex-col items-center justify-center gap-1
                    ${phase === 'pick' && !done
                      ? 'bg-white/5 hover:bg-pitch-500/20 hover:border-pitch-500/60 border border-white/10 hover:scale-105 cursor-pointer active:scale-95'
                      : 'cursor-default border border-white/5'
                    }
                    ${isGoal   ? 'bg-volt-400/20 border-2 border-volt-400 scale-105' : ''}
                    ${isSaved  ? 'bg-red-500/20 border-2 border-red-500' : ''}
                    ${isKeeperZone && phase === 'reveal' ? 'ring-2 ring-blue-400/60' : ''}
                  `}
                >
                  {phase === 'reveal' ? (
                    <>
                      {isKeeperZone && <span className="text-2xl">🧤</span>}
                      {isPlayerZone && lastKick?.goal && <span className="text-2xl">⚽</span>}
                      {isPlayerZone && !lastKick?.goal && <span className="text-2xl">❌</span>}
                      {!isPlayerZone && !isKeeperZone && <span className="text-white/10 text-xl">{z.emoji}</span>}
                    </>
                  ) : (
                    <>
                      <span className="text-xl">{z.emoji}</span>
                      <span className="text-[10px] text-white/40 font-semibold">{z.label}</span>
                    </>
                  )}
                </button>
              )
            })}
          </div>
        </div>
        {/* Goal line */}
        <div className="bg-white/5 h-6 flex items-center justify-center">
          <div className="w-24 h-1 bg-white/20 rounded" />
        </div>
      </div>

      {/* Feedback */}
      {phase === 'reveal' && lastKick && (
        <div className={`card text-center py-6 border-2 transition-all ${lastKick.goal ? 'border-volt-400/60 bg-volt-400/5' : 'border-red-500/40 bg-red-500/5'}`}>
          <div className="text-5xl mb-2">{lastKick.goal ? '⚽' : '🧤'}</div>
          <p className={`text-2xl font-extrabold ${lastKick.goal ? 'text-volt-400' : 'text-red-400'}`}>
            {lastKick.goal ? 'GOAL! 🔥' : 'SAVED! 😤'}
          </p>
          {lastKick.goal
            ? <p className="text-white/50 text-sm mt-1">You aimed {ZONES.find(z => z.id === lastKick.player)?.label}!</p>
            : <p className="text-white/50 text-sm mt-1">Keeper dived {ZONES.find(z => z.id === lastKick.keeper)?.label}!</p>
          }
        </div>
      )}

      {/* Game over */}
      {phase === 'done' && (
        <div className={`card text-center py-8 border-2 ${scored >= 4 ? 'border-volt-400/50 bg-volt-400/5' : scored >= 2 ? 'border-pitch-500/40' : 'border-red-500/30'}`}>
          <div className="text-6xl mb-3">{scored === 5 ? '🏆' : scored >= 4 ? '🥇' : scored >= 3 ? '⚽' : scored >= 2 ? '😅' : '😬'}</div>
          <div className="text-5xl font-extrabold text-white mb-1">{scored} / 5</div>
          <p className={`text-xl font-bold mb-4 ${scored === 5 ? 'text-volt-400' : scored >= 3 ? 'text-pitch-400' : 'text-white/60'}`}>
            {scored === 5 ? 'PERFECT! You\'re a penalty king! 👑' : scored >= 4 ? 'Brilliant! Nearly perfect!' : scored >= 3 ? 'Decent! 3 from 5.' : scored >= 2 ? 'Tough day on the spot!' : 'The keeper had your number! 😂'}
          </p>
          <div className="inline-flex items-center gap-2 bg-volt-400/10 border border-volt-400/30 rounded-xl px-4 py-2 mb-5">
            <span className="text-volt-400 font-extrabold">+{xpEarned} XP earned</span>
            {scored === 5 && <span className="text-xs text-volt-400/70">(incl. +{XP_BONUS_5} perfect bonus!)</span>}
          </div>
          <br />
          <button onClick={reset} className="btn-volt px-8 py-3 text-base">🔄 Take Another 5</button>
        </div>
      )}

      {/* XP guide */}
      <div className="card flex justify-center gap-6 text-sm text-white/40">
        <span>⚽ +{XP_PER_GOAL} XP per goal</span>
        <span>🏆 +{XP_BONUS_5} XP bonus for 5/5</span>
      </div>
    </div>
  )
}
