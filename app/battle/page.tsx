'use client'

import { useState } from 'react'
import SafeImage from '@/components/SafeImage'

interface BattlePlayer {
  id: number
  name: string
  team: string
  nationality: string
  position: string
  photo: string
  teamId: number
  stats: {
    pace: number
    shooting: number
    passing: number
    dribbling: number
    defending: number
    physical: number
    goals: number
    assists: number
    marketValue: number
    rating: number
  }
}

const PLAYERS: BattlePlayer[] = [
  { id: 1,  name: 'Erling Haaland',   team: 'Man City',    nationality: '🇳🇴', position: 'ST',  teamId: 65, photo: 'https://img.a.transfermarkt.technology/portrait/big/418560-1701275689.jpg',  stats: { pace: 89, shooting: 93, passing: 65, dribbling: 80, defending: 45, physical: 88, goals: 27, assists: 5,  marketValue: 180, rating: 91 } },
  { id: 2,  name: 'Kylian Mbappé',    team: 'Real Madrid', nationality: '🇫🇷', position: 'ST',  teamId: 86, photo: 'https://img.a.transfermarkt.technology/portrait/big/342229-1682683695.jpg',  stats: { pace: 97, shooting: 91, passing: 81, dribbling: 93, defending: 36, physical: 76, goals: 24, assists: 8,  marketValue: 180, rating: 92 } },
  { id: 3,  name: 'Vinicius Jr.',      team: 'Real Madrid', nationality: '🇧🇷', position: 'LW',  teamId: 86, photo: 'https://img.a.transfermarkt.technology/portrait/big/371998-1695892614.jpg',  stats: { pace: 95, shooting: 85, passing: 78, dribbling: 93, defending: 30, physical: 68, goals: 18, assists: 11, marketValue: 180, rating: 91 } },
  { id: 4,  name: 'Bukayo Saka',       team: 'Arsenal',     nationality: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', position: 'RW',  teamId: 57, photo: 'https://img.a.transfermarkt.technology/portrait/big/433177-1695897072.jpg',  stats: { pace: 88, shooting: 83, passing: 85, dribbling: 88, defending: 62, physical: 68, goals: 15, assists: 12, marketValue: 150, rating: 89 } },
  { id: 5,  name: 'Jude Bellingham',  team: 'Real Madrid', nationality: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', position: 'CM',  teamId: 86, photo: 'https://img.a.transfermarkt.technology/portrait/big/581678-1695892766.jpg',  stats: { pace: 83, shooting: 82, passing: 85, dribbling: 90, defending: 71, physical: 82, goals: 16, assists: 6,  marketValue: 180, rating: 91 } },
  { id: 6,  name: 'Mohamed Salah',    team: 'Liverpool',   nationality: '🇪🇬', position: 'RW',  teamId: 64, photo: 'https://img.a.transfermarkt.technology/portrait/big/148669-1695893577.jpg',  stats: { pace: 91, shooting: 88, passing: 80, dribbling: 88, defending: 48, physical: 75, goals: 20, assists: 13, marketValue: 60,  rating: 89 } },
  { id: 7,  name: 'Harry Kane',       team: 'Bayern',      nationality: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', position: 'ST',  teamId: 5,  photo: 'https://img.a.transfermarkt.technology/portrait/big/132098-1695893440.jpg',  stats: { pace: 72, shooting: 94, passing: 83, dribbling: 82, defending: 42, physical: 80, goals: 28, assists: 7,  marketValue: 100, rating: 89 } },
  { id: 8,  name: 'Lamine Yamal',     team: 'Barcelona',   nationality: '🇪🇸', position: 'RW',  teamId: 81, photo: 'https://img.a.transfermarkt.technology/portrait/big/945518-1695893343.jpg',  stats: { pace: 90, shooting: 80, passing: 82, dribbling: 92, defending: 38, physical: 58, goals: 12, assists: 14, marketValue: 180, rating: 87 } },
  { id: 9,  name: 'Florian Wirtz',    team: 'Leverkusen',  nationality: '🇩🇪', position: 'CAM', teamId: 3,  photo: 'https://img.a.transfermarkt.technology/portrait/big/521361-1695893792.jpg',  stats: { pace: 78, shooting: 84, passing: 86, dribbling: 90, defending: 58, physical: 66, goals: 14, assists: 12, marketValue: 150, rating: 88 } },
  { id: 10, name: 'Phil Foden',       team: 'Man City',    nationality: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', position: 'CAM', teamId: 65, photo: 'https://img.a.transfermarkt.technology/portrait/big/406635-1695893168.jpg',  stats: { pace: 82, shooting: 85, passing: 85, dribbling: 90, defending: 53, physical: 62, goals: 12, assists: 10, marketValue: 150, rating: 88 } },
]

const STAT_KEYS: { key: keyof BattlePlayer['stats']; label: string; emoji: string; format?: (v: number) => string }[] = [
  { key: 'pace',        label: 'Pace',         emoji: '⚡' },
  { key: 'shooting',    label: 'Shooting',     emoji: '⚽' },
  { key: 'passing',     label: 'Passing',      emoji: '🎯' },
  { key: 'dribbling',   label: 'Dribbling',    emoji: '🪄' },
  { key: 'defending',   label: 'Defending',    emoji: '🛡' },
  { key: 'physical',    label: 'Physical',     emoji: '💪' },
  { key: 'goals',       label: 'Goals',        emoji: '🥅' },
  { key: 'assists',     label: 'Assists',      emoji: '🎁' },
  { key: 'marketValue', label: 'Market Value', emoji: '💶', format: (v) => `€${v}M` },
  { key: 'rating',      label: 'FC26 Rating',  emoji: '🎮' },
]

function PlayerSelect({ value, onChange, label }: { value: BattlePlayer | null; onChange: (p: BattlePlayer) => void; label: string }) {
  return (
    <div className="flex-1 space-y-3">
      <p className="text-white/50 text-sm font-semibold text-center">{label}</p>
      <select
        className="input w-full"
        value={value?.id ?? ''}
        onChange={e => {
          const p = PLAYERS.find(p => p.id === parseInt(e.target.value))
          if (p) onChange(p)
        }}
      >
        <option value="">— Pick a player —</option>
        {PLAYERS.map(p => (
          <option key={p.id} value={p.id}>{p.name} ({p.team})</option>
        ))}
      </select>
      {value && (
        <div className="card text-center py-4">
          <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-pitch-500/40 mx-auto mb-2">
            <SafeImage src={value.photo} alt={value.name} className="w-full h-full object-cover object-top" fallback="⚽" />
          </div>
          <p className="font-extrabold text-white">{value.name}</p>
          <p className="text-sm text-white/40">{value.nationality} {value.team} · {value.position}</p>
        </div>
      )}
    </div>
  )
}

function StatRow({ stat, p1, p2 }: { stat: typeof STAT_KEYS[0]; p1: BattlePlayer; p2: BattlePlayer }) {
  const v1 = p1.stats[stat.key] as number
  const v2 = p2.stats[stat.key] as number
  const max = Math.max(v1, v2, 1)
  const p1wins = v1 > v2
  const p2wins = v2 > v1
  const fmt = stat.format ?? ((v: number) => String(v))

  return (
    <div className="group">
      <div className="flex items-center gap-2 mb-1">
        <span className="text-sm">{stat.emoji}</span>
        <span className="text-white/50 text-xs font-semibold flex-1 text-center">{stat.label}</span>
      </div>
      <div className="flex items-center gap-2">
        {/* P1 bar */}
        <div className="flex-1 flex items-center gap-1.5 justify-end">
          <span className={`text-sm font-extrabold ${p1wins ? 'text-pitch-400' : 'text-white/50'}`}>{fmt(v1)}</span>
          <div className="h-3 bg-dark-700 rounded-full overflow-hidden w-full max-w-32 flex justify-end">
            <div
              className={`h-full rounded-full transition-all duration-700 ${p1wins ? 'bg-pitch-500' : 'bg-white/20'}`}
              style={{ width: `${(v1 / max) * 100}%` }}
            />
          </div>
        </div>

        {/* Crown or tie */}
        <div className="text-base w-6 text-center shrink-0">
          {p1wins ? '👑' : p2wins ? '' : '🤝'}
        </div>

        {/* P2 bar */}
        <div className="flex-1 flex items-center gap-1.5">
          <div className="h-3 bg-dark-700 rounded-full overflow-hidden w-full max-w-32">
            <div
              className={`h-full rounded-full transition-all duration-700 ${p2wins ? 'bg-volt-400' : 'bg-white/20'}`}
              style={{ width: `${(v2 / max) * 100}%` }}
            />
          </div>
          <span className={`text-sm font-extrabold ${p2wins ? 'text-volt-400' : 'text-white/50'}`}>{fmt(v2)}</span>
        </div>
      </div>
    </div>
  )
}

export default function BattlePage() {
  const [p1, setP1] = useState<BattlePlayer | null>(null)
  const [p2, setP2] = useState<BattlePlayer | null>(null)
  const [battling, setBattling] = useState(false)

  const handleBattle = () => {
    if (p1 && p2) setBattling(true)
  }

  let p1wins = 0, p2wins = 0
  if (p1 && p2) {
    STAT_KEYS.forEach(s => {
      const v1 = p1.stats[s.key] as number
      const v2 = p2.stats[s.key] as number
      if (v1 > v2) p1wins++
      else if (v2 > v1) p2wins++
    })
  }

  const winner = p1wins > p2wins ? p1 : p2wins > p1wins ? p2 : null

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-8">

      {/* Header */}
      <div className="text-center">
        <div className="text-6xl mb-4">⚔️</div>
        <h1 className="text-4xl font-extrabold text-white mb-2">
          Player <span className="text-fire-400">Battle</span>
        </h1>
        <p className="text-white/50 text-lg">Pick two players and see who wins the stat war!</p>
      </div>

      {/* Player selectors */}
      <div className="flex flex-col sm:flex-row gap-4 items-start">
        <PlayerSelect value={p1} onChange={p => { setP1(p); setBattling(false) }} label="⚔️ Player 1" />
        <div className="flex items-center justify-center py-4 sm:py-16">
          <div className="text-3xl font-extrabold text-white/20">VS</div>
        </div>
        <PlayerSelect value={p2} onChange={p => { setP2(p); setBattling(false) }} label="⚔️ Player 2" />
      </div>

      {p1 && p2 && p1.id === p2.id && (
        <div className="card border-red-500/30 text-center text-red-400 text-sm font-semibold">
          ⚠️ Pick two different players!
        </div>
      )}

      {p1 && p2 && p1.id !== p2.id && !battling && (
        <div className="text-center">
          <button onClick={handleBattle} className="btn-primary px-10 py-4 text-lg">
            ⚔️ BATTLE!
          </button>
        </div>
      )}

      {/* Battle results */}
      {battling && p1 && p2 && (
        <div className="space-y-6">
          {/* Player names row */}
          <div className="flex items-center gap-2">
            <div className="flex-1 text-center">
              <span className="font-extrabold text-pitch-400">{p1.name}</span>
            </div>
            <div className="text-white/20 font-bold text-sm shrink-0">VS</div>
            <div className="flex-1 text-center">
              <span className="font-extrabold text-volt-400">{p2.name}</span>
            </div>
          </div>

          {/* Stats comparison */}
          <div className="card space-y-4">
            {STAT_KEYS.map(stat => (
              <StatRow key={stat.key} stat={stat} p1={p1} p2={p2} />
            ))}
          </div>

          {/* Verdict */}
          <div className={`card text-center py-6 border-2 ${winner ? 'border-volt-400/40 bg-volt-400/5' : 'border-white/10'}`}>
            <div className="text-5xl mb-3">{winner ? '🏆' : '🤝'}</div>
            {winner ? (
              <>
                <h2 className="text-2xl font-extrabold text-white mb-1">{winner.name} WINS!</h2>
                <p className="text-white/50">
                  {winner.id === p1.id
                    ? `${p1.name} won ${p1wins} stats vs ${p2wins}`
                    : `${p2.name} won ${p2wins} stats vs ${p1wins}`}
                </p>
              </>
            ) : (
              <>
                <h2 className="text-2xl font-extrabold text-white mb-1">It's a Draw!</h2>
                <p className="text-white/50">Both players won {p1wins} stats each — too close to call!</p>
              </>
            )}
          </div>

          <div className="text-center">
            <button
              onClick={() => { setBattling(false); setP1(null); setP2(null) }}
              className="btn-ghost px-6 py-2"
            >
              🔄 New Battle
            </button>
          </div>
        </div>
      )}

      {!p1 && !p2 && (
        <div className="card text-center py-12">
          <div className="text-5xl mb-4">⚽</div>
          <p className="text-white/40">Select two players above to start the battle!</p>
        </div>
      )}
    </div>
  )
}
