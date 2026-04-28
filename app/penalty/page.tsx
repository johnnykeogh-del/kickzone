'use client'

import { useState, useEffect, useRef } from 'react'

type Zone = 'TL' | 'TC' | 'TR' | 'ML' | 'MC' | 'MR' | 'BL' | 'BC' | 'BR'

const ZONES: { id: Zone; label: string; emoji: string }[] = [
  { id: 'TL', label: 'Top Left',  emoji: '↖' },
  { id: 'TC', label: 'Top Mid',   emoji: '⬆' },
  { id: 'TR', label: 'Top Right', emoji: '↗' },
  { id: 'ML', label: 'Mid Left',  emoji: '⬅' },
  { id: 'MC', label: 'Centre',    emoji: '🎯' },
  { id: 'MR', label: 'Mid Right', emoji: '➡' },
  { id: 'BL', label: 'Bot Left',  emoji: '↙' },
  { id: 'BC', label: 'Bot Mid',   emoji: '⬇' },
  { id: 'BR', label: 'Bot Right', emoji: '↘' },
]

const LEGENDARY_KEEPERS = [
  { name: 'Peter Schmeichel',  wiki: 'Peter Schmeichel' },
  { name: 'Gianluigi Buffon',  wiki: 'Gianluigi Buffon' },
  { name: 'Iker Casillas',     wiki: 'Iker Casillas' },
  { name: 'Manuel Neuer',      wiki: 'Manuel Neuer' },
  { name: 'David de Gea',      wiki: 'David de Gea' },
  { name: 'Oliver Kahn',       wiki: 'Oliver Kahn' },
]

const KEEPER_WEIGHTS: Record<Zone, number> = {
  TL: 16, TC: 7,  TR: 16,
  ML: 20, MC: 3,  MR: 20,
  BL: 8,  BC: 4,  BR: 8,
}

const CPU_KICK_WEIGHTS: Record<Zone, number> = {
  TL: 10, TC: 6, TR: 10,
  ML: 14, MC: 5, MR: 14,
  BL: 11, BC: 5, BR: 11,
}

function pickZone(w: Record<Zone, number>): Zone {
  const total = Object.values(w).reduce((a, b) => a + b, 0)
  let r = Math.random() * total
  for (const [z, wt] of Object.entries(w) as [Zone, number][]) {
    r -= wt
    if (r <= 0) return z
  }
  return 'ML'
}

interface Kick { zone: Zone; keeper: Zone; goal: boolean }
interface Round { p1: Kick; p2: Kick }
type Mode = '1p' | '2p'

type Phase =
  | 'mode_select'
  | 'p1_kick'
  | 'p1_locked'
  | 'p2_keep'
  | 'p2_kick'
  | 'p2_locked'
  | 'p1_keep'
  | 'revealing'
  | 'done'

interface RevealState {
  kick: Kick
  label: string
  step: 0 | 1 | 2 | 3
}

const TOTAL_KICKS = 5

// ── Sounds (Web Audio API) ────────────────────────────────────────

function playWhistle() {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)()
    const osc = ctx.createOscillator()
    const g = ctx.createGain()
    osc.connect(g); g.connect(ctx.destination)
    osc.type = 'sine'
    osc.frequency.setValueAtTime(2800, ctx.currentTime)
    osc.frequency.exponentialRampToValueAtTime(2400, ctx.currentTime + 0.12)
    g.gain.setValueAtTime(0, ctx.currentTime)
    g.gain.linearRampToValueAtTime(0.4, ctx.currentTime + 0.02)
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.38)
    osc.start(ctx.currentTime); osc.stop(ctx.currentTime + 0.4)
  } catch { /* ignore */ }
}

function playCrowdGoal() {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    [0, 140, 280].forEach((d, i) => {
      const o = ctx.createOscillator(); const g = ctx.createGain()
      o.connect(g); g.connect(ctx.destination); o.type = 'sawtooth'
      const t = ctx.currentTime + d / 1000
      o.frequency.setValueAtTime(300 + i * 80, t)
      o.frequency.exponentialRampToValueAtTime(640 + i * 120, t + 0.5)
      g.gain.setValueAtTime(0.07, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.9)
      o.start(t); o.stop(t + 0.9)
    })
    const sz = Math.floor(ctx.sampleRate * 1.4)
    const b = ctx.createBuffer(1, sz, ctx.sampleRate)
    const d = b.getChannelData(0)
    for (let i = 0; i < sz; i++) d[i] = (Math.random() * 2 - 1) * Math.max(0, 1 - i / sz)
    const src = ctx.createBufferSource(); src.buffer = b
    const f = ctx.createBiquadFilter(); f.type = 'bandpass'; f.frequency.value = 700; f.Q.value = 0.4
    const ng = ctx.createGain()
    ng.gain.setValueAtTime(0.18, ctx.currentTime)
    ng.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.4)
    src.connect(f); f.connect(ng); ng.connect(ctx.destination); src.start()
  } catch { /* ignore */ }
}

function playSaveGroan() {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)()
    const o = ctx.createOscillator(); const g = ctx.createGain()
    o.connect(g); g.connect(ctx.destination); o.type = 'sine'
    o.frequency.setValueAtTime(370, ctx.currentTime)
    o.frequency.exponentialRampToValueAtTime(130, ctx.currentTime + 0.65)
    g.gain.setValueAtTime(0.22, ctx.currentTime)
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.75)
    o.start(); o.stop(ctx.currentTime + 0.75)
    const sz = Math.floor(ctx.sampleRate * 0.6)
    const buf = ctx.createBuffer(1, sz, ctx.sampleRate)
    const dd = buf.getChannelData(0)
    for (let i = 0; i < sz; i++) dd[i] = (Math.random() * 2 - 1) * (1 - i / sz) * 0.4
    const ns = ctx.createBufferSource(); ns.buffer = buf
    const ff = ctx.createBiquadFilter(); ff.type = 'lowpass'; ff.frequency.value = 450
    const ng = ctx.createGain(); ng.gain.value = 0.08
    ns.connect(ff); ff.connect(ng); ng.connect(ctx.destination); ns.start()
  } catch { /* ignore */ }
}

// ── Component ─────────────────────────────────────────────────────

export default function PenaltyPage() {
  const [mode,        setMode]        = useState<Mode | null>(null)
  const [phase,       setPhase]       = useState<Phase>('mode_select')
  const [keeper,      setKeeper]      = useState(LEGENDARY_KEEPERS[0])
  const [rounds,      setRounds]      = useState<Round[]>([])
  const [kickNum,     setKickNum]     = useState(1)
  const [suddenDeath, setSuddenDeath] = useState(false)
  const [winner,      setWinner]      = useState<'p1' | 'p2' | null>(null)
  const [storedXP,    setStoredXP]    = useState(0)
  const [earnedXP,    setEarnedXP]    = useState(0)
  const [reveal,      setReveal]      = useState<RevealState | null>(null)

  const pendingP1 = useRef<Kick | null>(null)
  const pendingP2Zone = useRef<Zone | null>(null)

  useEffect(() => {
    setStoredXP(parseInt(localStorage.getItem('kickzone_xp') || '0'))
  }, [])

  const p1Score = rounds.filter(r => r.p1.goal).length
  const p2Score = rounds.filter(r => r.p2.goal).length

  // ── Reveal sequence ──────────────────────────────────────────────
  // Shows: whistle → ball in zone (400ms) → keeper dives (800ms) → result sound → onDone (1000ms)
  function runReveal(kick: Kick, label: string, onDone: () => void) {
    playWhistle()
    setReveal({ kick, label, step: 0 })
    setTimeout(() => {
      setReveal(r => r ? { ...r, step: 1 } : r)          // ball shown
      setTimeout(() => {
        setReveal(r => r ? { ...r, step: 2 } : r)         // keeper shown
        if (kick.goal) playCrowdGoal(); else playSaveGroan()
        setTimeout(() => {
          setReveal(r => r ? { ...r, step: 3 } : r)
          setTimeout(() => { setReveal(null); onDone() }, 1000)
        }, 500)
      }, 800)
    }, 400)
  }

  // ── End game ─────────────────────────────────────────────────────
  function endGame(result: 'p1' | 'p2', pScore: number, isSD: boolean) {
    const xp = pScore * 2 + (result === 'p1' && !isSD && pScore === TOTAL_KICKS ? 10 : 0)
    const newTotal = storedXP + xp
    setStoredXP(newTotal); setEarnedXP(xp)
    localStorage.setItem('kickzone_xp', String(newTotal))
    setWinner(result); setPhase('done')
  }

  function checkEnd(newRounds: Round[], isSD: boolean) {
    const pScore = newRounds.filter(r => r.p1.goal).length
    const cScore = newRounds.filter(r => r.p2.goal).length

    if (isSD) {
      const last = newRounds[newRounds.length - 1]
      if (last.p1.goal && !last.p2.goal) { endGame('p1', pScore, true);  return }
      if (!last.p1.goal && last.p2.goal) { endGame('p2', pScore, true);  return }
      setKickNum(k => k + 1); setPhase('p1_kick'); return
    }

    const rem = TOTAL_KICKS - newRounds.length
    if (pScore + rem < cScore) { endGame('p2', pScore, false); return }
    if (cScore + rem < pScore) { endGame('p1', pScore, false); return }
    if (newRounds.length >= TOTAL_KICKS) {
      if (pScore > cScore) { endGame('p1', pScore, false); return }
      if (cScore > pScore) { endGame('p2', pScore, false); return }
      setSuddenDeath(true); setKickNum(k => k + 1); setPhase('p1_kick'); return
    }
    setKickNum(k => k + 1); setPhase('p1_kick')
  }

  // ── 1P: player kicks ─────────────────────────────────────────────
  function on1PKick(zone: Zone) {
    const keeper = pickZone(KEEPER_WEIGHTS)
    const goal = keeper !== zone
    const p1Kick: Kick = { zone, keeper, goal }
    const capturedRounds = rounds
    const capturedSD = suddenDeath

    setPhase('revealing')
    runReveal(p1Kick, 'You', () => {
      // CPU kicks
      const cpuZone = pickZone(CPU_KICK_WEIGHTS)
      const cpuKeeper = pickZone(KEEPER_WEIGHTS)
      const cpuGoal = cpuKeeper !== cpuZone
      const cpuKick: Kick = { zone: cpuZone, keeper: cpuKeeper, goal: cpuGoal }
      runReveal(cpuKick, 'CPU', () => {
        const newRounds = [...capturedRounds, { p1: p1Kick, p2: cpuKick }]
        setRounds(newRounds)
        checkEnd(newRounds, capturedSD)
      })
    })
  }

  // ── 2P flows ─────────────────────────────────────────────────────
  function on2PP1Kick(zone: Zone) {
    pendingP1.current = { zone, keeper: 'ML', goal: false }
    setPhase('p1_locked')
  }

  function on2PP2Keep(zone: Zone) {
    const p1Zone = pendingP1.current!.zone
    const goal = zone !== p1Zone
    const p1Kick: Kick = { zone: p1Zone, keeper: zone, goal }
    pendingP1.current = p1Kick
    setPhase('revealing')
    runReveal(p1Kick, 'Player 1', () => setPhase('p2_kick'))
  }

  function on2PP2Kick(zone: Zone) {
    pendingP2Zone.current = zone
    setPhase('p2_locked')
  }

  function on2PP1Keep(zone: Zone) {
    const p2Zone = pendingP2Zone.current!
    const goal = zone !== p2Zone
    const p2Kick: Kick = { zone: p2Zone, keeper: zone, goal }
    const capturedRounds = rounds
    const capturedP1Kick = pendingP1.current!
    const capturedSD = suddenDeath
    setPhase('revealing')
    runReveal(p2Kick, 'Player 2', () => {
      const newRounds = [...capturedRounds, { p1: capturedP1Kick, p2: p2Kick }]
      setRounds(newRounds)
      checkEnd(newRounds, capturedSD)
    })
  }

  function onZonePick(zone: Zone) {
    if (phase === 'revealing') return
    if (mode === '1p' && phase === 'p1_kick') { on1PKick(zone); return }
    if (mode === '2p') {
      if (phase === 'p1_kick')  on2PP1Kick(zone)
      if (phase === 'p2_keep')  on2PP2Keep(zone)
      if (phase === 'p2_kick')  on2PP2Kick(zone)
      if (phase === 'p1_keep')  on2PP1Keep(zone)
    }
  }

  function reset() {
    setMode(null); setPhase('mode_select'); setRounds([]); setKickNum(1)
    setSuddenDeath(false); setWinner(null); setEarnedXP(0); setReveal(null)
    pendingP1.current = null; pendingP2Zone.current = null
  }

  // ── Derived UI values ─────────────────────────────────────────────
  const p1Label = mode === '2p' ? 'Player 1' : 'You'
  const p2Label = mode === '2p' ? 'Player 2' : 'CPU'

  const gridActive = ['p1_kick', 'p2_keep', 'p2_kick', 'p1_keep'].includes(phase)
  const isRevealing = phase === 'revealing'

  const mustScore = !suddenDeath && rounds.length < TOTAL_KICKS &&
    phase === 'p1_kick' &&
    p1Score + (TOTAL_KICKS - rounds.length) - 1 <= p2Score

  const gridInstruction = (): { title: string; sub: string } => {
    if (phase === 'p1_kick') return mode === '2p'
      ? { title: 'Player 1 — pick your spot! 🎯', sub: 'Player 2, look away! 🙈' }
      : { title: 'Pick your spot!', sub: 'Choose where to aim' }
    if (phase === 'p2_keep') return { title: 'Player 2 — where do you DIVE? 🧤', sub: 'Player 1 has kicked — choose fast!' }
    if (phase === 'p2_kick') return { title: 'Player 2 — pick your spot! 🎯', sub: 'Player 1, look away! 🙈' }
    if (phase === 'p1_keep') return { title: 'Player 1 — where do you DIVE? 🧤', sub: 'Player 2 has kicked — choose fast!' }
    return { title: '', sub: '' }
  }

  // ── Mode select screen ───────────────────────────────────────────
  if (phase === 'mode_select') {
    return (
      <div className="max-w-xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        <div className="text-center">
          <div className="text-6xl mb-3">⚽</div>
          <h1 className="text-4xl font-extrabold text-white mb-1">
            Penalty <span className="text-volt-400">Shootout</span>
          </h1>
          <p className="text-white/50">Who are you playing against?</p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => {
              const k = LEGENDARY_KEEPERS[Math.floor(Math.random() * LEGENDARY_KEEPERS.length)]
              setKeeper(k); setMode('1p'); setPhase('p1_kick')
            }}
            className="card hover:border-volt-400/40 transition-all text-center py-8 space-y-3 cursor-pointer group"
          >
            <div className="text-5xl">🤖</div>
            <h3 className="font-extrabold text-white group-hover:text-volt-400 text-lg">vs Computer</h3>
            <p className="text-white/40 text-xs">CPU kicks back — 5 kicks each</p>
          </button>
          <button
            onClick={() => {
              const k = LEGENDARY_KEEPERS[Math.floor(Math.random() * LEGENDARY_KEEPERS.length)]
              setKeeper(k); setMode('2p'); setPhase('p1_kick')
            }}
            className="card hover:border-pitch-500/40 transition-all text-center py-8 space-y-3 cursor-pointer group"
          >
            <div className="text-5xl">👥</div>
            <h3 className="font-extrabold text-white group-hover:text-pitch-400 text-lg">2 Players</h3>
            <p className="text-white/40 text-xs">Pass & play — you choose where to dive!</p>
          </button>
        </div>
        <div className="card text-xs text-white/30 text-center space-y-1">
          <p>🔊 Sounds play on kick — unmute your device!</p>
          <p>🧤 Bottom corners are hardest for the keeper to reach</p>
        </div>
      </div>
    )
  }

  const inst = gridInstruction()

  // ── Main game ────────────────────────────────────────────────────
  return (
    <div className="max-w-xl mx-auto px-4 sm:px-6 py-8 space-y-4">

      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-extrabold text-white">
          ⚽ <span className="text-volt-400">Penalty</span>
          <span className="text-white/30 text-sm ml-2 font-normal">{mode === '2p' ? '👥 2P' : '🤖 vs CPU'}</span>
        </h1>
        <span className="text-volt-400 font-bold text-sm bg-volt-400/10 border border-volt-400/20 rounded-full px-3 py-1">
          ⚡ {storedXP} XP
        </span>
      </div>

      {/* Scoreboard */}
      <div className="card flex items-center justify-between gap-3 py-4">
        <div className="flex-1 text-center">
          <div className="text-xs font-extrabold text-volt-400 mb-1">{p1Label.toUpperCase()}</div>
          <div className="text-4xl font-extrabold text-volt-400">{p1Score}</div>
          <div className="flex gap-1 justify-center mt-2 flex-wrap">
            {rounds.map((r, i) => (
              <span key={i} className={`text-sm ${r.p1.goal ? 'text-volt-400' : 'text-red-400'}`}>
                {r.p1.goal ? '⚽' : '🧤'}
              </span>
            ))}
            {!suddenDeath && Array.from({ length: TOTAL_KICKS - rounds.length }).map((_, i) => (
              <span key={i} className="text-white/20 text-sm">○</span>
            ))}
          </div>
        </div>
        <div className="text-center shrink-0">
          <div className={`text-3xl font-extrabold ${phase === 'done' ? (winner === 'p1' ? 'text-volt-400' : 'text-red-400') : 'text-white'}`}>
            {p1Score} – {p2Score}
          </div>
          <div className="text-white/30 text-xs mt-1">
            {phase === 'done' ? 'FT' : suddenDeath ? '⚡ SD' : `Kick ${Math.min(kickNum, TOTAL_KICKS)}/5`}
          </div>
        </div>
        <div className="flex-1 text-center">
          <div className="text-xs font-extrabold text-red-400 mb-1">{p2Label.toUpperCase()}</div>
          <div className="text-4xl font-extrabold text-red-400">{p2Score}</div>
          <div className="flex gap-1 justify-center mt-2 flex-wrap">
            {rounds.map((r, i) => (
              <span key={i} className={`text-sm ${r.p2.goal ? 'text-red-400' : 'text-volt-400'}`}>
                {r.p2.goal ? '⚽' : '🧤'}
              </span>
            ))}
            {!suddenDeath && Array.from({ length: TOTAL_KICKS - rounds.length }).map((_, i) => (
              <span key={i} className="text-white/20 text-sm">○</span>
            ))}
          </div>
        </div>
      </div>

      {/* Jeopardy banners */}
      {mustScore && (
        <div className="bg-red-500/10 border border-red-500/40 rounded-2xl py-3 text-center animate-pulse">
          <p className="text-red-400 font-extrabold text-lg">⚠️ MUST SCORE OR IT'S OVER!</p>
        </div>
      )}
      {suddenDeath && (phase === 'p1_kick' || phase === 'p2_keep') && (
        <div className="bg-yellow-400/10 border border-yellow-400/40 rounded-2xl py-3 text-center">
          <p className="text-yellow-400 font-extrabold text-lg">⚡ SUDDEN DEATH!</p>
          <p className="text-white/40 text-xs mt-0.5">Score and stop the other side to win</p>
        </div>
      )}

      {/* 2P cover screens */}
      {phase === 'p1_locked' && (
        <div className="card text-center py-12 border-2 border-volt-400/30 bg-volt-400/5">
          <div className="text-5xl mb-3">🔒</div>
          <p className="text-volt-400 font-extrabold text-2xl mb-2">Player 1 locked in!</p>
          <p className="text-white/50 mb-6">Pass to Player 2 — you're the keeper! 🧤</p>
          <button onClick={() => setPhase('p2_keep')} className="btn-volt px-8 py-3 text-base">
            I'm Player 2 — Ready! 🧤
          </button>
        </div>
      )}
      {phase === 'p2_locked' && (
        <div className="card text-center py-12 border-2 border-pitch-500/30 bg-pitch-500/5">
          <div className="text-5xl mb-3">🔒</div>
          <p className="text-pitch-400 font-extrabold text-2xl mb-2">Player 2 locked in!</p>
          <p className="text-white/50 mb-6">Pass to Player 1 — you're the keeper now! 🧤</p>
          <button onClick={() => setPhase('p1_keep')} className="btn-primary px-8 py-3 text-base">
            I'm Player 1 — Ready! 🧤
          </button>
        </div>
      )}

      {/* Goal grid */}
      {(gridActive || isRevealing) && phase !== 'p1_locked' && phase !== 'p2_locked' && phase !== 'done' && (
        <>
          {/* Instructions / reveal text */}
          <div className="text-center min-h-[48px] flex flex-col items-center justify-center">
            {isRevealing && reveal && reveal.step === 0 && (
              <p className="text-white/40 text-sm animate-pulse">🎵 Whistle…</p>
            )}
            {isRevealing && reveal && reveal.step >= 1 && (
              <>
                <p className="text-white font-extrabold text-lg">
                  {reveal.label} aimed {ZONES.find(z => z.id === reveal.kick.zone)?.label}…
                  {reveal.step >= 2 && (
                    <span className={reveal.kick.goal ? ' text-volt-400' : ' text-red-400'}>
                      {reveal.kick.goal ? ' ⚽ GOAL!' : ' 🧤 SAVED!'}
                    </span>
                  )}
                </p>
                {reveal.step >= 2 && (
                  <p className="text-white/40 text-xs mt-0.5">
                    Keeper dived {ZONES.find(z => z.id === reveal.kick.keeper)?.label}
                  </p>
                )}
              </>
            )}
            {!isRevealing && inst.title && (
              <>
                <p className="text-white font-extrabold text-lg">{inst.title}</p>
                {inst.sub && <p className="text-white/40 text-sm">{inst.sub}</p>}
              </>
            )}
          </div>

          {/* Goal net */}
          <div className="card p-0 overflow-hidden">
            <div className="bg-white/10 h-2 w-full" />
            <div
              className="relative p-3"
              style={{
                background:
                  'repeating-linear-gradient(0deg,transparent,transparent 29px,rgba(255,255,255,0.04) 29px,rgba(255,255,255,0.04) 30px),' +
                  'repeating-linear-gradient(90deg,transparent,transparent 29px,rgba(255,255,255,0.04) 29px,rgba(255,255,255,0.04) 30px)',
              }}
            >
              <div className="grid grid-cols-3 gap-2">
                {ZONES.map(z => {
                  const isBall = isRevealing && reveal && reveal.step >= 1 && reveal.kick.zone === z.id
                  const isGoal = isBall && reveal?.kick.goal && reveal.step >= 2
                  const isSaved = isBall && !reveal?.kick.goal && reveal && reveal.step >= 2

                  return (
                    <button
                      key={z.id}
                      onClick={() => !isRevealing && gridActive && onZonePick(z.id)}
                      disabled={isRevealing || !gridActive}
                      className={[
                        'relative h-[72px] rounded-xl font-extrabold transition-all flex flex-col items-center justify-center gap-1',
                        gridActive && !isRevealing
                          ? 'bg-white/5 hover:bg-pitch-500/20 hover:border-pitch-500/60 border border-white/10 hover:scale-105 cursor-pointer active:scale-95'
                          : 'cursor-default border border-white/5',
                        isBall && reveal?.step === 1 ? 'bg-volt-400/15 border border-volt-400/40' : '',
                        isGoal  ? 'bg-volt-400/20 border-2 border-volt-400 scale-105' : '',
                        isSaved ? 'bg-red-500/20 border-2 border-red-500' : '',
                      ].filter(Boolean).join(' ')}
                    >
                      {isRevealing ? (
                        <>
                          {isBall && reveal && reveal.step === 1 && <span className="text-xl">⚽</span>}
                          {isBall && isGoal  && <span className="text-xl">⚽</span>}
                          {isBall && isSaved && <span className="text-xl">❌</span>}
                          {!isBall && <span className="text-white/10 text-lg">{z.emoji}</span>}
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

              {/* Animated goalkeeper — slides to keeper zone on reveal */}
              {isRevealing && reveal && reveal.step >= 1 && (() => {
                const kz = reveal.kick.keeper
                const col = kz.endsWith('L') ? 0 : kz.endsWith('R') ? 2 : 1
                const row = kz.startsWith('T') ? 0 : kz.startsWith('B') ? 2 : 1
                const leftPct = [16, 50, 84][col]
                const topPct  = [22, 52, 80][row]
                const atTarget = reveal.step >= 2

                // Dive rotation: lean toward the zone
                const diveLeft  = col === 0
                const diveRight = col === 2
                const isTop     = row === 0
                let rotate = 0
                if (diveLeft)  rotate = isTop ? -55 : -40
                if (diveRight) rotate = isTop ?  55 :  40
                if (!diveLeft && !diveRight && isTop) rotate = 0

                return (
                  <div
                    className="absolute pointer-events-none z-10 select-none"
                    style={{
                      left: atTarget ? `${leftPct}%` : '50%',
                      top:  atTarget ? `${topPct}%`  : '52%',
                      transform: `translate(-50%, -50%) rotate(${atTarget ? rotate : 0}deg)`,
                      transition: 'left 0.55s cubic-bezier(.4,0,.2,1), top 0.55s cubic-bezier(.4,0,.2,1), transform 0.55s cubic-bezier(.4,0,.2,1)',
                    }}
                  >
                    {/* Gloves flanking the photo */}
                    <div className="flex items-center gap-1">
                      <span className="text-2xl drop-shadow-lg" style={{ transform: 'scaleX(-1)' }}>🧤</span>
                      <img
                        src={`/api/player-image/${encodeURIComponent(keeper.wiki)}?pos=Goalkeeper`}
                        alt={keeper.name}
                        width={52}
                        height={52}
                        className="rounded-full object-cover border-2 border-yellow-400 bg-dark-800 shrink-0"
                        style={{
                          width: 52, height: 52,
                          boxShadow: '0 0 12px rgba(0,0,0,0.8)',
                        }}
                      />
                      <span className="text-2xl drop-shadow-lg">🧤</span>
                    </div>
                    <p className="text-[9px] text-white/60 font-bold text-center mt-0.5 whitespace-nowrap">
                      {keeper.name.split(' ').pop()}
                    </p>
                  </div>
                )
              })()}
            </div>
            <div className="bg-white/5 h-6 flex items-center justify-center gap-2">
              <div className="w-16 h-0.5 bg-white/20 rounded" />
              <span className="text-white/30 text-[10px] font-semibold shrink-0">🧤 {keeper.name}</span>
              <div className="w-16 h-0.5 bg-white/20 rounded" />
            </div>
          </div>
        </>
      )}

      {/* Game over */}
      {phase === 'done' && (
        <div className={`card text-center py-8 border-2 ${winner === 'p1' ? 'border-volt-400/50 bg-volt-400/5' : 'border-red-500/40 bg-red-500/5'}`}>
          <div className="text-6xl mb-3">
            {winner === 'p1' ? (p1Score === TOTAL_KICKS && !suddenDeath ? '👑' : '🏆') : '😬'}
          </div>
          <div className="text-5xl font-extrabold text-white mb-1">{p1Score} – {p2Score}</div>
          <p className={`text-2xl font-extrabold mb-4 ${winner === 'p1' ? 'text-volt-400' : 'text-red-400'}`}>
            {winner === 'p1'
              ? suddenDeath ? `${p1Label} WINS in sudden death! ⚡` : p1Score === TOTAL_KICKS ? 'PERFECT! Penalty King! 👑' : `${p1Label} WINS! 🔥`
              : mode === '2p' ? `${p2Label} WINS! 🎉` : 'CPU WINS! Better luck! 😂'
            }
          </p>
          {earnedXP > 0 && (
            <div className="inline-flex items-center gap-2 bg-volt-400/10 border border-volt-400/30 rounded-xl px-4 py-2 mb-5">
              <span className="text-volt-400 font-extrabold">+{earnedXP} XP earned</span>
              {p1Score === TOTAL_KICKS && !suddenDeath && winner === 'p1' && (
                <span className="text-xs text-volt-400/70">(incl. +10 perfect bonus!)</span>
              )}
            </div>
          )}
          <br />
          <button onClick={reset} className="btn-volt px-8 py-3 text-base">🔄 Play Again</button>
        </div>
      )}

      {/* XP guide */}
      <div className="card flex justify-center gap-6 text-sm text-white/40">
        <span>⚽ +2 XP per goal</span>
        <span>🏆 +10 XP bonus for 5/5 perfect</span>
      </div>
    </div>
  )
}
