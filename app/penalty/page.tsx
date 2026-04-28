'use client'

import { useState, useEffect } from 'react'

type Zone = 'TL' | 'TC' | 'TR' | 'ML' | 'MC' | 'MR' | 'BL' | 'BC' | 'BR'

const ZONES: { id: Zone; label: string; emoji: string }[] = [
  { id: 'TL', label: 'Top Left',   emoji: '↖' },
  { id: 'TC', label: 'Top Mid',    emoji: '⬆' },
  { id: 'TR', label: 'Top Right',  emoji: '↗' },
  { id: 'ML', label: 'Mid Left',   emoji: '⬅' },
  { id: 'MC', label: 'Centre',     emoji: '🎯' },
  { id: 'MR', label: 'Mid Right',  emoji: '➡' },
  { id: 'BL', label: 'Bot Left',   emoji: '↙' },
  { id: 'BC', label: 'Bot Mid',    emoji: '⬇' },
  { id: 'BR', label: 'Bot Right',  emoji: '↘' },
]

// Keeper dive weights — bottom corners hardest to reach (low weight = easier to score)
const KEEPER_WEIGHTS: Record<Zone, number> = {
  TL: 16, TC: 7,  TR: 16,
  ML: 20, MC: 3,  MR: 20,
  BL: 8,  BC: 4,  BR: 8,
}

// CPU kicker zone preference
const CPU_KICK_WEIGHTS: Record<Zone, number> = {
  TL: 10, TC: 6, TR: 10,
  ML: 14, MC: 5, MR: 14,
  BL: 11, BC: 5, BR: 11,
}

function pickZone(weights: Record<Zone, number>): Zone {
  const total = Object.values(weights).reduce((a, b) => a + b, 0)
  let r = Math.random() * total
  for (const [z, w] of Object.entries(weights) as [Zone, number][]) {
    r -= w
    if (r <= 0) return z
  }
  return 'ML'
}

interface Kick { zone: Zone; keeper: Zone; goal: boolean }
interface Round { player: Kick; cpu: Kick }

type Phase = 'pick' | 'player_reveal' | 'cpu_kicking' | 'cpu_reveal' | 'done'

const TOTAL_KICKS   = 5
const XP_PER_GOAL   = 2
const XP_BONUS_5    = 10

export default function PenaltyPage() {
  const [phase,          setPhase]         = useState<Phase>('pick')
  const [rounds,         setRounds]        = useState<Round[]>([])
  const [kickNum,        setKickNum]        = useState(1)
  const [lastPlayer,     setLastPlayer]     = useState<Kick | null>(null)
  const [lastCpu,        setLastCpu]        = useState<Kick | null>(null)
  const [suddenDeath,    setSuddenDeath]    = useState(false)
  const [winner,         setWinner]         = useState<'player' | 'cpu' | null>(null)
  const [storedXP,       setStoredXP]       = useState(0)
  const [earnedXP,       setEarnedXP]       = useState(0)

  useEffect(() => {
    setStoredXP(parseInt(localStorage.getItem('kickzone_xp') || '0'))
  }, [])

  const playerScore = rounds.filter(r => r.player.goal).length
  const cpuScore    = rounds.filter(r => r.cpu.goal).length
  const kicksDone   = rounds.length

  // Can the player still win / must they score?
  const remaining      = TOTAL_KICKS - kicksDone
  const playerCanWin   = playerScore + remaining > cpuScore
  const mustScore      = !suddenDeath && remaining > 0 && playerScore + remaining - 1 <= cpuScore && playerScore < cpuScore + 1

  function endGame(result: 'player' | 'cpu', pScore: number) {
    const xp = pScore * XP_PER_GOAL + (result === 'player' && !suddenDeath && pScore === TOTAL_KICKS ? XP_BONUS_5 : 0)
    const newTotal = storedXP + xp
    setStoredXP(newTotal)
    setEarnedXP(xp)
    localStorage.setItem('kickzone_xp', String(newTotal))
    setWinner(result)
    setPhase('done')
  }

  function shoot(zone: Zone) {
    if (phase !== 'pick') return

    // Player kick
    const keeper    = pickZone(KEEPER_WEIGHTS)
    const goal      = keeper !== zone
    const playerKick: Kick = { zone, keeper, goal }
    setLastPlayer(playerKick)
    setPhase('player_reveal')

    setTimeout(() => {
      setPhase('cpu_kicking')

      setTimeout(() => {
        // CPU kick
        const cpuZone   = pickZone(CPU_KICK_WEIGHTS)
        const cpuKeeper = pickZone(KEEPER_WEIGHTS)
        const cpuGoal   = cpuKeeper !== cpuZone
        const cpuKick: Kick = { zone: cpuZone, keeper: cpuKeeper, goal: cpuGoal }
        setLastCpu(cpuKick)
        setPhase('cpu_reveal')

        const newRounds   = [...rounds, { player: playerKick, cpu: cpuKick }]
        const pScore      = newRounds.filter(r => r.player.goal).length
        const cScore      = newRounds.filter(r => r.cpu.goal).length

        setTimeout(() => {
          setRounds(newRounds)

          if (suddenDeath) {
            if (goal && !cpuGoal)       endGame('player', pScore)
            else if (!goal && cpuGoal)  endGame('cpu', pScore)
            else { setKickNum(k => k + 1); setPhase('pick') }
            return
          }

          const rem = TOTAL_KICKS - newRounds.length
          if (pScore + rem < cScore)            { endGame('cpu', pScore);    return }
          if (cScore + rem < pScore)            { endGame('player', pScore); return }
          if (newRounds.length >= TOTAL_KICKS) {
            if (pScore > cScore)                { endGame('player', pScore); return }
            if (cScore > pScore)                { endGame('cpu', pScore);    return }
            setSuddenDeath(true)
          }
          setKickNum(k => k + 1)
          setPhase('pick')
        }, 1800)
      }, 1800)
    }, 1500)
  }

  function reset() {
    setPhase('pick'); setRounds([]); setKickNum(1)
    setLastPlayer(null); setLastCpu(null)
    setSuddenDeath(false); setWinner(null); setEarnedXP(0)
  }

  const scoreLabel = `${playerScore} – ${cpuScore}`

  return (
    <div className="max-w-xl mx-auto px-4 sm:px-6 py-8 space-y-5">

      {/* Header */}
      <div className="text-center">
        <div className="text-6xl mb-2">⚽</div>
        <h1 className="text-4xl font-extrabold text-white mb-1">
          Penalty <span className="text-volt-400">Shootout</span>
        </h1>
        <p className="text-white/50 text-sm">5 kicks each — beat the computer to win!</p>
        <div className="mt-2 inline-flex items-center gap-2 bg-volt-400/10 border border-volt-400/20 rounded-full px-4 py-1">
          <span className="text-volt-400 font-bold text-sm">⚡ XP: {storedXP}</span>
        </div>
      </div>

      {/* Scoreboard */}
      <div className="card flex items-center justify-between gap-4">
        {/* You */}
        <div className="flex-1 text-center">
          <div className="text-xs text-white/40 font-semibold mb-1">YOU</div>
          <div className="text-4xl font-extrabold text-volt-400">{playerScore}</div>
          <div className="flex gap-1 justify-center mt-2 flex-wrap">
            {Array.from({ length: Math.min(kicksDone, TOTAL_KICKS) }).map((_, i) => {
              const r = rounds[i]
              return (
                <span key={i} className={`text-base ${r?.player.goal ? 'text-volt-400' : 'text-red-400'}`}>
                  {r?.player.goal ? '⚽' : '🧤'}
                </span>
              )
            })}
            {Array.from({ length: Math.max(0, (suddenDeath ? kicksDone : TOTAL_KICKS) - kicksDone) }).map((_, i) => (
              <span key={`e${i}`} className="text-white/20 text-base">○</span>
            ))}
          </div>
        </div>

        {/* VS */}
        <div className="text-center shrink-0">
          <div className={`text-3xl font-extrabold ${phase === 'done' ? (winner === 'player' ? 'text-volt-400' : 'text-red-400') : 'text-white'}`}>
            {scoreLabel}
          </div>
          <div className="text-white/30 text-xs mt-1">
            {phase === 'done' ? 'FT' : suddenDeath ? 'SD' : `Kick ${Math.min(kickNum, TOTAL_KICKS)}/5`}
          </div>
        </div>

        {/* CPU */}
        <div className="flex-1 text-center">
          <div className="text-xs text-white/40 font-semibold mb-1">CPU</div>
          <div className="text-4xl font-extrabold text-red-400">{cpuScore}</div>
          <div className="flex gap-1 justify-center mt-2 flex-wrap">
            {Array.from({ length: Math.min(kicksDone, TOTAL_KICKS) }).map((_, i) => {
              const r = rounds[i]
              return (
                <span key={i} className={`text-base ${r?.cpu.goal ? 'text-red-400' : 'text-volt-400'}`}>
                  {r?.cpu.goal ? '⚽' : '🧤'}
                </span>
              )
            })}
            {Array.from({ length: Math.max(0, (suddenDeath ? kicksDone : TOTAL_KICKS) - kicksDone) }).map((_, i) => (
              <span key={`e${i}`} className="text-white/20 text-base">○</span>
            ))}
          </div>
        </div>
      </div>

      {/* Must score / sudden death banners */}
      {mustScore && phase === 'pick' && (
        <div className="bg-red-500/10 border border-red-500/40 rounded-2xl py-3 text-center animate-pulse">
          <p className="text-red-400 font-extrabold text-lg">⚠️ YOU MUST SCORE THIS!</p>
        </div>
      )}
      {suddenDeath && phase === 'pick' && (
        <div className="bg-yellow-400/10 border border-yellow-400/40 rounded-2xl py-3 text-center">
          <p className="text-yellow-400 font-extrabold text-lg">⚡ SUDDEN DEATH!</p>
          <p className="text-white/50 text-xs mt-0.5">Score and don't let CPU score to win</p>
        </div>
      )}

      {/* Goal grid — player picks zone */}
      {phase !== 'done' && (
        <div className="card p-0 overflow-hidden">
          <div className="bg-white/10 h-2 w-full" />
          <div
            className="relative p-3"
            style={{
              background: 'repeating-linear-gradient(0deg,transparent,transparent 29px,rgba(255,255,255,0.04) 29px,rgba(255,255,255,0.04) 30px),repeating-linear-gradient(90deg,transparent,transparent 29px,rgba(255,255,255,0.04) 29px,rgba(255,255,255,0.04) 30px)',
            }}
          >
            {/* CPU kicking overlay */}
            {phase === 'cpu_kicking' && (
              <div className="absolute inset-3 bg-dark-800/80 backdrop-blur-sm rounded-xl flex flex-col items-center justify-center z-10 gap-2">
                <div className="text-4xl animate-bounce">⚽</div>
                <p className="text-white/70 font-bold text-sm">CPU is stepping up…</p>
              </div>
            )}

            <div className="grid grid-cols-3 gap-2">
              {ZONES.map(z => {
                const isPlayerZone = lastPlayer?.zone === z.id
                const isKeeperZone = lastPlayer?.keeper === z.id
                const isGoal       = phase === 'player_reveal' && isPlayerZone && lastPlayer?.goal
                const isSaved      = phase === 'player_reveal' && isPlayerZone && !lastPlayer?.goal
                const interactive  = phase === 'pick'

                return (
                  <button
                    key={z.id}
                    onClick={() => shoot(z.id)}
                    disabled={!interactive}
                    className={`
                      relative h-[72px] rounded-xl font-extrabold text-2xl transition-all flex flex-col items-center justify-center gap-1
                      ${interactive
                        ? 'bg-white/5 hover:bg-pitch-500/20 hover:border-pitch-500/60 border border-white/10 hover:scale-105 cursor-pointer active:scale-95'
                        : 'cursor-default border border-white/5'
                      }
                      ${isGoal  ? 'bg-volt-400/20 border-2 border-volt-400 scale-105' : ''}
                      ${isSaved ? 'bg-red-500/20 border-2 border-red-500' : ''}
                      ${isKeeperZone && phase === 'player_reveal' ? 'ring-2 ring-blue-400/60' : ''}
                    `}
                  >
                    {phase === 'player_reveal' ? (
                      <>
                        {isKeeperZone  && <span className="text-xl">🧤</span>}
                        {isPlayerZone  && lastPlayer?.goal  && <span className="text-xl">⚽</span>}
                        {isPlayerZone  && !lastPlayer?.goal && <span className="text-xl">❌</span>}
                        {!isPlayerZone && !isKeeperZone     && <span className="text-white/10 text-lg">{z.emoji}</span>}
                      </>
                    ) : (
                      <>
                        <span className="text-xl">{z.emoji}</span>
                        <span className="text-[9px] text-white/30 font-semibold leading-none">{z.label}</span>
                      </>
                    )}
                  </button>
                )
              })}
            </div>
          </div>
          <div className="bg-white/5 h-5 flex items-center justify-center">
            <div className="w-20 h-0.5 bg-white/20 rounded" />
          </div>
        </div>
      )}

      {/* Player kick feedback */}
      {phase === 'player_reveal' && lastPlayer && (
        <div className={`card text-center py-4 border-2 ${lastPlayer.goal ? 'border-volt-400/50 bg-volt-400/5' : 'border-red-500/40 bg-red-500/5'}`}>
          <div className="text-4xl mb-1">{lastPlayer.goal ? '⚽' : '🧤'}</div>
          <p className={`text-xl font-extrabold ${lastPlayer.goal ? 'text-volt-400' : 'text-red-400'}`}>
            {lastPlayer.goal ? 'YOUR GOAL! 🔥' : 'YOUR SHOT SAVED! 😤'}
          </p>
          <p className="text-white/40 text-xs mt-1">
            {lastPlayer.goal
              ? `Keeper dived ${ZONES.find(z => z.id === lastPlayer.keeper)?.label} — you scored ${ZONES.find(z => z.id === lastPlayer.zone)?.label}!`
              : `Keeper saved it going ${ZONES.find(z => z.id === lastPlayer.keeper)?.label}`
            }
          </p>
        </div>
      )}

      {/* CPU kick feedback */}
      {phase === 'cpu_reveal' && lastCpu && (
        <div className={`card text-center py-4 border-2 ${lastCpu.goal ? 'border-red-500/40 bg-red-500/5' : 'border-volt-400/50 bg-volt-400/5'}`}>
          <div className="text-4xl mb-1">{lastCpu.goal ? '⚽' : '🧤'}</div>
          <p className={`text-xl font-extrabold ${lastCpu.goal ? 'text-red-400' : 'text-volt-400'}`}>
            {lastCpu.goal ? 'CPU SCORED! 😤' : 'CPU MISSED! 🎉'}
          </p>
          <p className="text-white/40 text-xs mt-1">
            CPU aimed {ZONES.find(z => z.id === lastCpu.zone)?.label}
            {lastCpu.goal ? '' : ' — your keeper saved it!'}
          </p>
        </div>
      )}

      {/* Game over */}
      {phase === 'done' && (
        <div className={`card text-center py-8 border-2 ${winner === 'player' ? 'border-volt-400/50 bg-volt-400/5' : 'border-red-500/40 bg-red-500/5'}`}>
          <div className="text-6xl mb-3">{winner === 'player' ? '🏆' : '😬'}</div>
          <div className="text-5xl font-extrabold text-white mb-1">{playerScore} – {cpuScore}</div>
          <p className={`text-2xl font-extrabold mb-4 ${winner === 'player' ? 'text-volt-400' : 'text-red-400'}`}>
            {winner === 'player'
              ? suddenDeath ? 'YOU WIN! Incredible! ⚡' : playerScore === TOTAL_KICKS ? 'PERFECT! Penalty King! 👑' : 'YOU WIN! 🔥'
              : 'CPU WINS! Better luck next time 😂'
            }
          </p>
          {earnedXP > 0 && (
            <div className="inline-flex items-center gap-2 bg-volt-400/10 border border-volt-400/30 rounded-xl px-4 py-2 mb-5">
              <span className="text-volt-400 font-extrabold">+{earnedXP} XP earned</span>
              {playerScore === TOTAL_KICKS && !suddenDeath && (
                <span className="text-xs text-volt-400/70">(incl. +{XP_BONUS_5} perfect bonus!)</span>
              )}
            </div>
          )}
          <br />
          <button onClick={reset} className="btn-volt px-8 py-3 text-base">🔄 Play Again</button>
        </div>
      )}

      {/* XP guide */}
      <div className="card flex justify-center gap-6 text-sm text-white/40">
        <span>⚽ +{XP_PER_GOAL} XP per goal</span>
        <span>🏆 +{XP_BONUS_5} XP bonus for 5/5 perfect</span>
      </div>

    </div>
  )
}
