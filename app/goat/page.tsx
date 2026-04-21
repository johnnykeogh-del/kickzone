'use client'

import { useState, useEffect } from 'react'

const MESSI = {
  name: 'Lionel Messi', flag: '🇦🇷', age: 37, club: 'Inter Miami',
  photo: 'https://img.a.transfermarkt.technology/portrait/big/28003-1698411706.jpg',
  color: 'from-blue-900 to-blue-700', border: 'border-blue-500', text: 'text-blue-400',
  stats: [
    { label: 'Career Goals',       value: 838 },
    { label: 'Career Assists',     value: 380 },
    { label: "Ballon d'Or Awards", value: 8 },
    { label: 'World Cup Winner',   value: 1 },
    { label: 'Champions Leagues',  value: 4 },
    { label: 'League Titles',      value: 12 },
    { label: 'Club Trophies',      value: 44 },
    { label: 'International Goals',value: 112 },
  ],
  facts: [
    "🏅 8x Ballon d'Or — most ever",
    "🇦🇷 Led Argentina to 2022 World Cup glory",
    "⚽ 474 La Liga goals — all-time record",
    "🎯 380 career assists — unprecedented",
    "📈 91 goals in a single calendar year (2012)",
  ]
}

const RONALDO = {
  name: 'Cristiano Ronaldo', flag: '🇵🇹', age: 39, club: 'Al Nassr',
  photo: 'https://img.a.transfermarkt.technology/portrait/big/8198-1698411786.jpg',
  color: 'from-red-900 to-red-700', border: 'border-red-500', text: 'text-red-400',
  stats: [
    { label: 'Career Goals',       value: 912 },
    { label: 'Career Assists',     value: 240 },
    { label: "Ballon d'Or Awards", value: 5 },
    { label: 'World Cup Winner',   value: 0 },
    { label: 'Champions Leagues',  value: 5 },
    { label: 'League Titles',      value: 7 },
    { label: 'Club Trophies',      value: 34 },
    { label: 'International Goals',value: 135 },
  ],
  facts: [
    "🏆 5x Champions League winner",
    "🌍 International top scorer — 135 goals",
    "💪 Won titles in England, Spain, Italy",
    "🔥 First player to score 900 career goals",
    "🥇 5x Ballon d'Or, 4 different leagues won",
  ]
}

export default function GoatPage() {
  const [votes, setVotes] = useState({ messi: 0, ronaldo: 0 })
  const [voted, setVoted] = useState<'messi' | 'ronaldo' | null>(null)

  useEffect(() => {
    const saved = localStorage.getItem('kickzone_goat_vote') as 'messi' | 'ronaldo' | null
    const savedVotes = localStorage.getItem('kickzone_goat_counts')
    if (saved) setVoted(saved)
    if (savedVotes) setVotes(JSON.parse(savedVotes))
    else setVotes({ messi: 5842, ronaldo: 5317 })
  }, [])

  const handleVote = (pick: 'messi' | 'ronaldo') => {
    if (voted) return
    const newVotes = { ...votes, [pick]: votes[pick] + 1 }
    setVotes(newVotes)
    setVoted(pick)
    localStorage.setItem('kickzone_goat_vote', pick)
    localStorage.setItem('kickzone_goat_counts', JSON.stringify(newVotes))
  }

  const total = votes.messi + votes.ronaldo
  const messiPct = total ? Math.round((votes.messi / total) * 100) : 50
  const ronaldoPct = 100 - messiPct

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      <div className="text-center">
        <div className="text-6xl mb-3">🐐</div>
        <h1 className="text-4xl font-extrabold text-white mb-2">
          The GOAT <span className="text-volt-400">Debate</span>
        </h1>
        <p className="text-white/50 text-lg">Messi or Ronaldo — who is the Greatest of All Time?</p>
      </div>

      {/* Vote bar */}
      {voted && (
        <div className="card space-y-3">
          <div className="flex justify-between text-sm font-bold">
            <span className="text-blue-400">🔵 Messi — {messiPct}%</span>
            <span className="text-red-400">Ronaldo — {ronaldoPct}% 🔴</span>
          </div>
          <div className="h-4 bg-red-700 rounded-full overflow-hidden">
            <div className="h-full bg-blue-600 rounded-full transition-all duration-700" style={{ width: `${messiPct}%` }} />
          </div>
          <p className="text-center text-white/30 text-xs">{total.toLocaleString()} total votes</p>
        </div>
      )}

      {/* Player cards */}
      <div className="grid md:grid-cols-2 gap-6">
        {[{ player: MESSI, key: 'messi' as const }, { player: RONALDO, key: 'ronaldo' as const }].map(({ player, key }) => (
          <div key={key} className={`rounded-3xl border-2 ${player.border} bg-gradient-to-b ${player.color} overflow-hidden`}>
            <div className="p-6 space-y-4">
              {/* Header */}
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-white/20 shrink-0">
                  <img src={player.photo} alt={player.name} className="w-full h-full object-cover object-top" onError={e => (e.currentTarget.style.display='none')} />
                </div>
                <div>
                  <h2 className="text-2xl font-extrabold text-white">{player.name}</h2>
                  <p className="text-white/50 text-sm">{player.flag} Age {player.age} · {player.club}</p>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-2">
                {player.stats.map(s => (
                  <div key={s.label} className="bg-black/20 rounded-xl p-2.5 text-center border border-white/10">
                    <div className={`text-xl font-extrabold ${player.text}`}>{s.value.toLocaleString()}</div>
                    <div className="text-white/40 text-xs leading-tight">{s.label}</div>
                  </div>
                ))}
              </div>

              {/* Facts */}
              <div className="space-y-1.5">
                {player.facts.map(f => (
                  <div key={f} className="text-sm text-white/70">{f}</div>
                ))}
              </div>

              {/* Vote button */}
              <button
                onClick={() => handleVote(key)}
                disabled={!!voted}
                className={`w-full py-4 rounded-2xl text-lg font-extrabold transition-all ${
                  voted === key ? `${player.border} border-2 bg-white/10 text-white` :
                  voted ? 'border border-white/10 text-white/30 cursor-default' :
                  `border-2 ${player.border} text-white hover:bg-white/10 cursor-pointer`
                }`}
              >
                {voted === key ? '✅ You voted for this GOAT!' : voted ? `${messiPct === (key === 'messi' ? messiPct : ronaldoPct)}% voted here` : `🗳 Vote for ${player.name.split(' ')[0]}`}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Head to head table */}
      <div className="card overflow-hidden p-0">
        <div className="px-4 py-3 bg-white/5 border-b border-white/5 text-center">
          <h3 className="font-extrabold text-white">📊 Head to Head Stats</h3>
        </div>
        {MESSI.stats.map((s, i) => {
          const mv = s.value
          const rv = RONALDO.stats[i].value
          const messiWins = mv > rv
          const ronaldoWins = rv > mv
          return (
            <div key={s.label} className={`grid grid-cols-3 items-center px-4 py-3 ${i < MESSI.stats.length - 1 ? 'border-b border-white/5' : ''}`}>
              <div className={`text-center text-base font-extrabold ${messiWins ? 'text-blue-400' : 'text-white/40'}`}>
                {mv.toLocaleString()} {messiWins && '👑'}
              </div>
              <div className="text-center text-xs text-white/40 font-semibold px-2">{s.label}</div>
              <div className={`text-center text-base font-extrabold ${ronaldoWins ? 'text-red-400' : 'text-white/40'}`}>
                {ronaldoWins && '👑'} {rv.toLocaleString()}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
