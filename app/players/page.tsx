'use client'

import { useState, useEffect } from 'react'

interface Player {
  id: number
  name: string
  team: string
  position: string
  nationality: string
  marketValue: string
  age: number
  goals: number
  assists: number
  rating: number
  photo: string
}

const POSITIONS = ['All', 'Striker', 'Forward', 'Winger', 'Midfielder', 'Defender']

const ratingColor = (r: number) =>
  r >= 9 ? 'text-volt-400' : r >= 8.5 ? 'text-pitch-400' : 'text-sky-400'

export default function PlayersPage() {
  const [players, setPlayers] = useState<Player[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [position, setPosition] = useState('All')
  const [query, setQuery] = useState('')

  useEffect(() => {
    setLoading(true)
    const params = new URLSearchParams()
    if (query) params.set('q', query)
    if (position !== 'All') params.set('position', position)
    fetch(`/api/players?${params}`)
      .then(r => r.json())
      .then(d => { setPlayers(Array.isArray(d) ? d : []); setLoading(false) })
  }, [query, position])

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-white mb-2">⭐ Players & Market Values</h1>
        <p className="text-white/50">The world's best footballers — their stats and how much they're worth</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="flex flex-1 gap-2">
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && setQuery(search)}
            placeholder="Search player or team..."
            className="input flex-1"
          />
          <button onClick={() => setQuery(search)} className="btn-primary px-4">Search</button>
        </div>
        <div className="flex gap-2 flex-wrap">
          {POSITIONS.map(p => (
            <button
              key={p}
              onClick={() => setPosition(p)}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                position === p ? 'bg-pitch-500 text-white' : 'bg-white/5 text-white/50 hover:bg-white/10'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => <div key={i} className="card h-48 animate-pulse bg-white/5" />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {players.map(player => (
            <div key={player.id} className="card hover:border-pitch-500/40 transition-all group">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-pitch-900/50 border border-pitch-700/30 overflow-hidden shrink-0 flex items-center justify-center">
                  <img
                    src={`/api/player-image/${encodeURIComponent(player.name)}`}
                    alt={player.name}
                    className="w-full h-full object-cover object-top"
                    onError={e => {
                      e.currentTarget.style.display = 'none'
                      if (e.currentTarget.parentElement) e.currentTarget.parentElement.innerHTML = '<span style="font-size:2rem">⚽</span>'
                    }}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-extrabold text-white group-hover:text-pitch-400 transition-colors leading-tight">{player.name}</p>
                  <p className="text-sm text-white/40 mt-0.5">{player.team}</p>
                  <div className="flex gap-2 mt-1.5 flex-wrap">
                    <span className="badge-sky">{player.position}</span>
                    <span className="badge text-xs bg-white/5 text-white/40">{player.nationality} Age {player.age}</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 mt-4">
                <div className="bg-volt-400/10 border border-volt-400/20 rounded-xl p-2.5 text-center">
                  <p className="text-volt-400 font-extrabold text-base leading-tight">{player.marketValue}</p>
                  <p className="text-white/30 text-xs mt-0.5">Value</p>
                </div>
                <div className="bg-white/5 rounded-xl p-2.5 text-center">
                  <p className="text-white font-extrabold text-base leading-tight">{player.goals}⚽</p>
                  <p className="text-white/30 text-xs mt-0.5">Goals</p>
                </div>
                <div className="bg-white/5 rounded-xl p-2.5 text-center">
                  <p className="text-white font-extrabold text-base leading-tight">{player.assists}🎯</p>
                  <p className="text-white/30 text-xs mt-0.5">Assists</p>
                </div>
              </div>

              <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/5">
                <span className="text-white/30 text-xs">Season Rating</span>
                <span className={`text-lg font-extrabold ${ratingColor(player.rating)}`}>{player.rating}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
