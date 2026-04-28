'use client'

import { useState, useEffect, useCallback } from 'react'

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

const LEAGUE_OPTIONS = [
  { code: '',    label: 'All Leagues',    flag: '🌍' },
  { code: 'PL',  label: 'Premier League', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
  { code: 'PD',  label: 'La Liga',        flag: '🇪🇸' },
  { code: 'BL1', label: 'Bundesliga',     flag: '🇩🇪' },
  { code: 'SA',  label: 'Serie A',        flag: '🇮🇹' },
  { code: 'FL1', label: 'Ligue 1',        flag: '🇫🇷' },
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

const TOP_FEATURED = [
  { name: 'Erling Haaland',  pos: 'ST',  nat: '🇳🇴', team: 'Man City' },
  { name: 'Kylian Mbappé',   pos: 'ST',  nat: '🇫🇷', team: 'Real Madrid' },
  { name: 'Vinicius Jr.',    pos: 'LW',  nat: '🇧🇷', team: 'Real Madrid' },
  { name: 'Bukayo Saka',     pos: 'RW',  nat: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', team: 'Arsenal' },
  { name: 'Jude Bellingham', pos: 'CM',  nat: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', team: 'Real Madrid' },
  { name: 'Rodri',           pos: 'CDM', nat: '🇪🇸', team: 'Man City' },
  { name: 'Phil Foden',      pos: 'CAM', nat: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', team: 'Man City' },
  { name: 'Lamine Yamal',    pos: 'RW',  nat: '🇪🇸', team: 'Barcelona' },
  { name: 'Mohamed Salah',   pos: 'RW',  nat: '🇪🇬', team: 'Liverpool' },
  { name: 'Harry Kane',      pos: 'ST',  nat: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', team: 'Bayern' },
  { name: 'Pedri',           pos: 'CM',  nat: '🇪🇸', team: 'Barcelona' },
  { name: 'Florian Wirtz',   pos: 'CAM', nat: '🇩🇪', team: 'Leverkusen' },
]

function getAvatarSvg(name: string, position: string): string {
  const initials = name.split(' ').map(w => w[0]).filter(Boolean).slice(0, 2).join('').toUpperCase()
  const cols: Record<string, [string, string]> = {
    Goalkeeper: ['#EAB308', '#3d3200'],
    Defender:   ['#22C55E', '#052e16'],
    Midfielder: ['#3B82F6', '#1e3a8a'],
    Forward:    ['#EF4444', '#450a0a'],
  }
  const [fg, bg] = cols[position] || ['#9CA3AF', '#1f2937']
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40"><circle cx="20" cy="20" r="20" fill="${bg}"/><text x="20" y="26" text-anchor="middle" fill="${fg}" font-family="system-ui,sans-serif" font-size="13" font-weight="bold">${initials}</text></svg>`
  return `data:image/svg+xml,${encodeURIComponent(svg)}`
}

function getAvatarSvgLg(name: string): string {
  const initials = name.split(' ').map(w => w[0]).filter(Boolean).slice(0, 2).join('').toUpperCase()
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64"><circle cx="32" cy="32" r="32" fill="#1a2e3b"/><text x="32" y="41" text-anchor="middle" fill="#4ade80" font-family="system-ui,sans-serif" font-size="20" font-weight="bold">${initials}</text></svg>`
  return `data:image/svg+xml,${encodeURIComponent(svg)}`
}

export default function PlayersPage() {
  const [data, setData]         = useState<ApiResponse | null>(null)
  const [loading, setLoading]   = useState(true)
  const [search, setSearch]     = useState('')
  const [query, setQuery]       = useState('')
  const [league, setLeague]     = useState('')
  const [position, setPosition] = useState('')
  const [sort, setSort]         = useState('az')
  const [page, setPage]         = useState(1)

  const fetchPlayers = useCallback(async () => {
    setLoading(true)
    const params = new URLSearchParams()
    if (query)    params.set('q', query)
    if (league)   params.set('league', league)
    if (position) params.set('position', position)
    if (sort)     params.set('sort', sort)
    params.set('page', String(page))
    params.set('limit', '24')
    try {
      const res = await fetch(`/api/players?${params}`)
      const json = await res.json()
      setData(json)
    } finally {
      setLoading(false)
    }
  }, [query, league, position, sort, page])

  useEffect(() => { fetchPlayers() }, [fetchPlayers])

  const changeFilter = (newLeague?: string, newPosition?: string) => {
    if (newLeague   !== undefined) setLeague(newLeague)
    if (newPosition !== undefined) setPosition(newPosition)
    setPage(1)
  }

  const changeSort = (newSort: string) => { setSort(newSort); setPage(1) }

  const submitSearch = () => { setQuery(search); setPage(1) }
  const hasFilter    = query || league || position

  const posLabel = (p: string) =>
    p === 'Goalkeeper' ? 'GK' : p === 'Defender' ? 'DEF' : p === 'Midfielder' ? 'MID' : p === 'Forward' ? 'FWD' : p

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-white mb-1">⭐ Players</h1>
        <p className="text-white/40">Every squad player from the top 5 European leagues</p>
      </div>

      {/* ── TOP PLAYERS featured row ── */}
      {!hasFilter && page === 1 && (
        <section>
          <h2 className="text-lg font-extrabold text-white mb-4">🌟 Top Players This Season</h2>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-12 gap-3">
            {TOP_FEATURED.map(p => (
              <div key={p.name} className="flex flex-col items-center gap-1.5 group cursor-pointer"
                onClick={() => { setSearch(p.name); setQuery(p.name); setPage(1) }}>
                <div className="relative">
                  <img
                    src={`/api/player-image/${encodeURIComponent(p.name)}?pos=${encodeURIComponent(p.pos)}`}
                    alt={p.name}
                    className="w-14 h-14 rounded-full object-cover object-top border-2 border-white/10 group-hover:border-pitch-500/60 transition-all"
                    loading="lazy"
                    onError={e => { e.currentTarget.src = getAvatarSvgLg(p.name) }}
                  />
                  <span className="absolute -bottom-0.5 -right-0.5 text-xs bg-dark-900 rounded-full px-1 border border-white/10">{p.nat}</span>
                </div>
                <p className="text-[10px] font-bold text-white/70 text-center leading-tight group-hover:text-white transition-colors line-clamp-2">
                  {p.name.split(' ').pop()}
                </p>
                <span className="text-[9px] text-white/30">{p.pos}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── Search & filters ── */}
      <div className="space-y-3">
        {/* Search row */}
        <div className="flex gap-2">
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && submitSearch()}
            placeholder="Search by name or team..."
            className="input flex-1"
          />
          <button onClick={submitSearch} className="btn-primary px-5">Search</button>
          {hasFilter && (
            <button onClick={() => { setSearch(''); setQuery(''); setLeague(''); setPosition(''); setPage(1) }}
              className="px-4 py-2 rounded-xl bg-white/5 text-white/50 hover:text-white text-sm font-semibold transition-all">
              Clear
            </button>
          )}
        </div>

        {/* League dropdown + sort + position tabs */}
        <div className="flex flex-wrap items-center gap-3">
          <select
            value={league}
            onChange={e => changeFilter(e.target.value)}
            className="bg-white/5 border border-white/10 text-white rounded-xl px-3 py-2 text-sm font-bold focus:outline-none focus:border-pitch-500/60 cursor-pointer"
          >
            {LEAGUE_OPTIONS.map(opt => (
              <option key={opt.code} value={opt.code} className="bg-dark-900 text-white">
                {opt.flag} {opt.label}
              </option>
            ))}
          </select>

          <select
            value={sort}
            onChange={e => changeSort(e.target.value)}
            className="bg-white/5 border border-white/10 text-white rounded-xl px-3 py-2 text-sm font-bold focus:outline-none focus:border-pitch-500/60 cursor-pointer"
          >
            <option value="az"       className="bg-dark-900 text-white">A → Z</option>
            <option value="za"       className="bg-dark-900 text-white">Z → A</option>
            <option value="youngest" className="bg-dark-900 text-white">Youngest first</option>
            <option value="oldest"   className="bg-dark-900 text-white">Oldest first</option>
            <option value="number"   className="bg-dark-900 text-white">Shirt number</option>
          </select>

          <div className="flex gap-2 flex-wrap">
            {POSITION_TABS.map(t => (
              <button key={t.value} onClick={() => changeFilter(undefined, t.value)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  position === t.value
                    ? 'bg-volt-400/20 text-volt-400 border border-volt-400/40'
                    : 'bg-white/5 text-white/40 hover:bg-white/10 hover:text-white border border-transparent'
                }`}>
                {t.label}
              </button>
            ))}
          </div>
        </div>
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

              {/* Player photo with crest overlay */}
              <div className="relative w-10 h-10 shrink-0">
                <img
                  src={`/api/player-image/${encodeURIComponent(player.name)}?pos=${encodeURIComponent(player.position)}`}
                  alt={player.name}
                  className="w-10 h-10 rounded-full object-cover object-top"
                  loading="lazy"
                  onError={e => { e.currentTarget.src = getAvatarSvg(player.name, player.position) }}
                />
                {player.teamCrest && (
                  <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-dark-800 rounded-full border border-white/10 overflow-hidden flex items-center justify-center">
                    <img src={player.teamCrest} alt="" className="w-3.5 h-3.5 object-contain" loading="lazy" />
                  </div>
                )}
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
                    {posLabel(player.position)}
                  </span>
                  {player.nationality && <span className="text-white/30 text-[10px]">{player.nationality}</span>}
                  {player.age > 0   && <span className="text-white/30 text-[10px]">Age {player.age}</span>}
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
            const p   = data.pages <= 7 ? i + 1 : i === 0 ? 1 : i === 6 ? data.pages : mid - 3 + i
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
