'use client'

import { useState, useEffect, useCallback } from 'react'
import SafeImage from '@/components/SafeImage'

interface FullPlayer {
  id: number
  name: string
  team: string
  teamId: number
  teamCrest: string
  league: string
  leagueCode: string
  leagueFlag: string
  position: string
  nationality: string
  shirtNumber: number | null
  age: number
}

interface ApiResponse {
  players: FullPlayer[]
  total: number
  page: number
  pages: number
}

const LEAGUE_TABS = [
  { code: '',    label: 'All Leagues',  flag: '🌍' },
  { code: 'PL',  label: 'Premier League', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
  { code: 'PD',  label: 'La Liga',      flag: '🇪🇸' },
  { code: 'BL1', label: 'Bundesliga',   flag: '🇩🇪' },
  { code: 'SA',  label: 'Serie A',      flag: '🇮🇹' },
  { code: 'FL1', label: 'Ligue 1',      flag: '🇫🇷' },
]

const POSITION_TABS = [
  { value: '',           label: 'All' },
  { value: 'Goalkeeper', label: '🧤 GK' },
  { value: 'Defender',   label: '🛡 DEF' },
  { value: 'Midfielder', label: '⚡ MID' },
  { value: 'Forward',    label: '⚽ FWD' },
]

const POS_COLOR: Record<string, string> = {
  Goalkeeper: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  Defender:   'bg-green-500/20 text-green-400 border-green-500/30',
  Midfielder: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  Forward:    'bg-red-500/20 text-red-400 border-red-500/30',
  Unknown:    'bg-white/10 text-white/40 border-white/10',
}

export default function PlayersPage() {
  const [data, setData]       = useState<ApiResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [search, setSearch]   = useState('')
  const [query, setQuery]     = useState('')
  const [league, setLeague]   = useState('')
  const [position, setPosition] = useState('')
  const [page, setPage]       = useState(1)

  const fetchPlayers = useCallback(async () => {
    setLoading(true)
    const params = new URLSearchParams()
    if (query)    params.set('q', query)
    if (league)   params.set('league', league)
    if (position) params.set('position', position)
    params.set('page', String(page))
    params.set('limit', '24')
    try {
      const res = await fetch(`/api/players?${params}`)
      const json = await res.json()
      setData(json)
    } finally {
      setLoading(false)
    }
  }, [query, league, position, page])

  useEffect(() => { fetchPlayers() }, [fetchPlayers])

  const changeFilter = (newLeague?: string, newPosition?: string) => {
    if (newLeague   !== undefined) setLeague(newLeague)
    if (newPosition !== undefined) setPosition(newPosition)
    setPage(1)
  }

  const submitSearch = () => { setQuery(search); setPage(1) }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-white mb-1">⭐ All Players</h1>
        <p className="text-white/40">Every squad player from the top 5 European leagues</p>
      </div>

      {/* Search */}
      <div className="flex gap-2">
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && submitSearch()}
          placeholder="Search by name or team..."
          className="input flex-1"
        />
        <button onClick={submitSearch} className="btn-primary px-5">Search</button>
        {(query || league || position) && (
          <button onClick={() => { setSearch(''); setQuery(''); setLeague(''); setPosition(''); setPage(1) }}
            className="px-4 py-2 rounded-xl bg-white/5 text-white/50 hover:text-white text-sm font-semibold transition-all">
            Clear
          </button>
        )}
      </div>

      {/* League tabs */}
      <div className="flex gap-2 flex-wrap">
        {LEAGUE_TABS.map(t => (
          <button key={t.code} onClick={() => changeFilter(t.code)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-bold transition-all ${
              league === t.code ? 'bg-pitch-500 text-white' : 'bg-white/5 text-white/50 hover:bg-white/10 hover:text-white'
            }`}>
            <span>{t.flag}</span>
            <span className="hidden sm:inline">{t.label}</span>
          </button>
        ))}
      </div>

      {/* Position tabs */}
      <div className="flex gap-2 flex-wrap">
        {POSITION_TABS.map(t => (
          <button key={t.value} onClick={() => changeFilter(undefined, t.value)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              position === t.value ? 'bg-volt-400/20 text-volt-400 border border-volt-400/40' : 'bg-white/5 text-white/40 hover:bg-white/10 hover:text-white border border-transparent'
            }`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Count */}
      {data && !loading && (
        <p className="text-white/30 text-sm">
          {data.total.toLocaleString()} players
          {data.pages > 1 && ` · page ${data.page} of ${data.pages}`}
        </p>
      )}

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {Array.from({ length: 24 }).map((_, i) => (
            <div key={i} className="card h-20 animate-pulse bg-white/5" />
          ))}
        </div>
      ) : data?.players.length === 0 ? (
        <div className="card text-center py-16">
          <div className="text-5xl mb-3">🔍</div>
          <p className="text-white/50">No players found. Try a different search or filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {data?.players.map(player => (
            <div key={player.id} className="card hover:border-pitch-500/30 transition-all group flex items-center gap-3 py-3">
              {/* Team crest */}
              <div className="w-10 h-10 shrink-0 flex items-center justify-center">
                {player.teamCrest
                  ? <SafeImage src={player.teamCrest} alt={player.team} className="w-10 h-10 object-contain" fallback="🛡" />
                  : <span className="text-2xl">🛡</span>
                }
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="font-extrabold text-white text-sm leading-tight truncate group-hover:text-pitch-400 transition-colors">
                  {player.name}
                  {player.shirtNumber ? <span className="text-white/30 font-normal ml-1">#{player.shirtNumber}</span> : null}
                </p>
                <p className="text-white/40 text-xs truncate">{player.team} <span className="text-white/20">·</span> {player.leagueFlag}</p>
                <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md border ${POS_COLOR[player.position] || POS_COLOR.Unknown}`}>
                    {player.position === 'Goalkeeper' ? 'GK' : player.position === 'Defender' ? 'DEF' : player.position === 'Midfielder' ? 'MID' : player.position === 'Forward' ? 'FWD' : player.position}
  </span>
                  {player.nationality && <span className="text-white/30 text-[10px]">{player.nationality}</span>}
                  {player.age > 0  && <span className="text-white/30 text-[10px]">Age {player.age}</span>}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {data && data.pages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-4 flex-wrap">
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
            className="px-4 py-2 rounded-xl bg-white/5 text-white/60 hover:bg-white/10 disabled:opacity-30 text-sm font-semibold transition-all">
            ← Prev
          </button>
          {Array.from({ length: Math.min(data.pages, 7) }, (_, i) => {
            const mid = Math.min(Math.max(page, 4), data.pages - 3)
            const p = data.pages <= 7 ? i + 1 : i === 0 ? 1 : i === 6 ? data.pages : mid - 3 + i
            return (
              <button key={p} onClick={() => setPage(p)}
                className={`w-9 h-9 rounded-xl text-sm font-bold transition-all ${
                  page === p ? 'bg-pitch-500 text-white' : 'bg-white/5 text-white/50 hover:bg-white/10'
                }`}>
                {p}
              </button>
            )
          })}
          <button onClick={() => setPage(p => Math.min(data.pages, p + 1))} disabled={page === data.pages}
            className="px-4 py-2 rounded-xl bg-white/5 text-white/60 hover:bg-white/10 disabled:opacity-30 text-sm font-semibold transition-all">
            Next →
          </button>
        </div>
      )}
    </div>
  )
}
