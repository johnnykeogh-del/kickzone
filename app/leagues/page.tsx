'use client'

import { useState, useEffect } from 'react'
import { LEAGUES, CL_KNOCKOUT_2025, WC_2026_GROUPS, type KnockoutTie, type KnockoutRound } from '@/lib/football'

type LeagueCode = keyof typeof LEAGUES

interface Standing {
  position: number
  team: { id: number; name: string; shortName: string; tla: string; crest: string }
  playedGames: number
  won: number
  draw: number
  lost: number
  points: number
  goalsFor: number
  goalsAgainst: number
  goalDifference: number
  form?: string
}

const FORM_COLOR: Record<string, string> = {
  W: 'bg-pitch-500 text-white',
  D: 'bg-white/20 text-white/60',
  L: 'bg-red-500/80 text-white',
}

export default function LeaguesPage() {
  const [activeLeague, setActiveLeague] = useState<LeagueCode>('PL')
  const [standings, setStandings] = useState<Standing[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    fetch(`/api/leagues?code=${activeLeague}`)
      .then(r => r.json())
      .then(d => { setStandings(d.standings || []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [activeLeague])

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-white mb-2">🏆 League Tables</h1>
        <p className="text-white/50">Live standings from the world's biggest football leagues</p>
      </div>

      {/* League tabs */}
      <div className="flex gap-2 flex-wrap mb-6">
        {(Object.entries(LEAGUES) as [LeagueCode, typeof LEAGUES[LeagueCode]][]).map(([code, league]) => (
          <button
            key={code}
            onClick={() => setActiveLeague(code)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-sm transition-all ${
              activeLeague === code
                ? 'bg-pitch-500 text-white shadow-lg shadow-pitch-500/30'
                : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
            }`}
          >
            <span>{league.flag}</span>
            <span className="hidden sm:inline">{league.name}</span>
            <span className="sm:hidden">{code}</span>
          </button>
        ))}
      </div>

      {/* League info */}
      <div className="card mb-6 flex items-center gap-4">
        <span className="text-4xl">{LEAGUES[activeLeague].flag}</span>
        <div>
          <h2 className="text-xl font-extrabold text-white">{LEAGUES[activeLeague].name}</h2>
          <p className="text-white/40 text-sm">{LEAGUES[activeLeague].country} • Season 2025/26</p>
        </div>
      </div>

      {/* Table — hidden for WC (groups shown below) */}
      {activeLeague !== 'WC' && (loading ? (
        <div className="space-y-2">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="h-14 bg-white/5 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="card overflow-hidden p-0">
          {/* Header */}
          <div className="grid grid-cols-12 gap-2 px-4 py-3 text-xs font-bold text-white/30 uppercase tracking-wider border-b border-white/5">
            <div className="col-span-1 text-center">#</div>
            <div className="col-span-4 sm:col-span-5">Club</div>
            <div className="col-span-1 text-center hidden sm:block">P</div>
            <div className="col-span-1 text-center hidden sm:block">W</div>
            <div className="col-span-1 text-center hidden sm:block">D</div>
            <div className="col-span-1 text-center hidden sm:block">L</div>
            <div className="col-span-2 text-center hidden sm:block">GD</div>
            <div className="col-span-3 sm:col-span-2 text-center font-extrabold text-white/50">Pts</div>
            <div className="col-span-4 hidden md:block text-center">Form</div>
          </div>

          {standings.map((row, i) => {
            const isTop4    = row.position <= 4
            const isEL5     = row.position === 5
            const isEL6     = row.position === 6
            const isUECL    = row.position === 7
            const isBottom3 = standings.length - row.position < 3
            const formLetters = row.form ? row.form.split(',').slice(-5) : []

            const leftBorder = isTop4
              ? 'border-l-2 border-l-pitch-500'
              : isEL5 || isEL6
              ? 'border-l-2 border-l-orange-500'
              : isUECL
              ? 'border-l-2 border-l-purple-500'
              : isBottom3
              ? 'border-l-2 border-l-red-500'
              : 'border-l-2 border-l-transparent'

            return (
              <div
                key={row.team.id}
                className={`grid grid-cols-12 gap-2 px-4 py-3 items-center transition-colors hover:bg-white/5 ${
                  i < standings.length - 1 ? 'border-b border-white/5' : ''
                } ${leftBorder}`}
              >
                <div className="col-span-1 text-center">
                  <span className={`text-sm font-extrabold ${
                    isTop4    ? 'text-pitch-400'
                    : isEL5 || isEL6 ? 'text-orange-400'
                    : isUECL  ? 'text-purple-400'
                    : isBottom3 ? 'text-red-400'
                    : 'text-white/50'
                  }`}>
                    {row.position}
                  </span>
                </div>
                <div className="col-span-4 sm:col-span-5 flex items-center gap-2 min-w-0">
                  <img src={row.team.crest} alt="" className="w-7 h-7 object-contain shrink-0"
                    onError={e => (e.currentTarget.style.display = 'none')} />
                  <div className="min-w-0">
                    <p className="font-bold text-white text-sm truncate leading-tight">{row.team.shortName}</p>
                    <p className="text-xs text-white/30 hidden sm:block">{row.team.tla}</p>
                  </div>
                </div>
                <div className="col-span-1 text-center text-sm text-white/50 hidden sm:block">{row.playedGames}</div>
                <div className="col-span-1 text-center text-sm text-pitch-400 font-semibold hidden sm:block">{row.won}</div>
                <div className="col-span-1 text-center text-sm text-white/40 hidden sm:block">{row.draw}</div>
                <div className="col-span-1 text-center text-sm text-red-400/70 hidden sm:block">{row.lost}</div>
                <div className="col-span-2 text-center text-sm text-white/60 hidden sm:block">
                  {row.goalDifference > 0 ? '+' : ''}{row.goalDifference}
                </div>
                <div className="col-span-3 sm:col-span-2 text-center">
                  <span className="text-base font-extrabold text-white">{row.points}</span>
                </div>
                <div className="col-span-4 hidden md:flex items-center justify-center gap-1">
                  {formLetters.map((f, fi) => (
                    <span key={fi} className={`w-5 h-5 rounded-full text-xs flex items-center justify-center font-bold ${FORM_COLOR[f] || 'bg-white/10'}`}>
                      {f}
                    </span>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      ))}

      {/* Legend */}
      {activeLeague !== 'CL' && activeLeague !== 'EL' && activeLeague !== 'WC' && (
        <div className="flex gap-4 mt-4 text-xs text-white/30 flex-wrap">
          <span className="flex items-center gap-1.5"><span className="w-2 h-4 bg-pitch-500 rounded-sm" /> Champions League</span>
          <span className="flex items-center gap-1.5"><span className="w-2 h-4 bg-orange-500 rounded-sm" /> Europa League</span>
          <span className="flex items-center gap-1.5"><span className="w-2 h-4 bg-purple-500 rounded-sm" /> Conference League</span>
          <span className="flex items-center gap-1.5"><span className="w-2 h-4 bg-red-500 rounded-sm" /> Relegation</span>
        </div>
      )}

      {/* World Cup Groups */}
      {activeLeague === 'WC' && (
        <div className="mt-4 space-y-6">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-extrabold text-white">🌍 Group Stage</h2>
            <span className="badge-volt text-xs">2026</span>
            <span className="text-white/30 text-sm">12 groups · 48 teams</span>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {WC_2026_GROUPS.map(group => (
              <div key={group.name} className="card p-0 overflow-hidden">
                <div className="px-4 py-2.5 bg-white/5 border-b border-white/5">
                  <span className="font-extrabold text-white text-sm">{group.name}</span>
                </div>
                <div className="divide-y divide-white/5">
                  {[...group.teams].sort((a, b) => b.pts - a.pts || (b.gf - b.ga) - (a.gf - a.ga)).map((team, i) => (
                    <div key={team.id} className={`flex items-center gap-2 px-3 py-2 ${i < 2 ? 'border-l-2 border-l-pitch-500' : 'border-l-2 border-l-transparent'}`}>
                      <span className={`text-xs font-extrabold w-4 shrink-0 ${i < 2 ? 'text-pitch-400' : 'text-white/30'}`}>{i + 1}</span>
                      <span className="text-base shrink-0">{team.flag}</span>
                      <span className={`flex-1 text-sm font-semibold truncate ${i < 2 ? 'text-white' : 'text-white/60'}`}>{team.shortName}</span>
                      <div className="flex items-center gap-3 text-xs text-white/40 shrink-0">
                        <span>{team.w + team.d + team.l}P</span>
                        <span className="text-white/20">{team.gf}:{team.ga}</span>
                        <span className={`font-extrabold w-4 text-right ${i < 2 ? 'text-volt-400' : 'text-white/50'}`}>{team.pts}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <p className="text-white/20 text-xs text-center">Top 2 from each group advance to the Round of 32 · 🟢 = Qualified</p>
        </div>
      )}

      {/* CL Knockout Bracket */}
      {activeLeague === 'CL' && (
        <div className="mt-10 space-y-8">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-extrabold text-white">⚡ Knockout Stage</h2>
            <span className="badge-volt text-xs">2024/25</span>
          </div>
          {CL_KNOCKOUT_2025.map(round => (
            <KnockoutRoundSection key={round.name} round={round} />
          ))}
        </div>
      )}
    </div>
  )
}

function TeamBadge({ crest, name }: { crest: string; name: string }) {
  return crest ? (
    <img
      src={crest}
      alt={name}
      className="w-6 h-6 object-contain shrink-0"
      onError={e => (e.currentTarget.style.display = 'none')}
    />
  ) : (
    <span className="w-6 h-6 flex items-center justify-center text-sm shrink-0">🛡</span>
  )
}

function TieCard({ tie }: { tie: KnockoutTie }) {
  const isTBD = tie.home.name === 'TBD'
  const leg1Done = tie.homeLeg1 !== null && tie.awayLeg1 !== null
  const leg2Done = tie.homeLeg2 !== null && tie.awayLeg2 !== null
  const agg1 = leg1Done ? (tie.homeLeg1! + (tie.homeLeg2 ?? 0)) : null
  const agg2 = leg1Done ? (tie.awayLeg1! + (tie.awayLeg2 ?? 0)) : null

  const statusColor = tie.status === 'DONE'
    ? 'border-pitch-500/30'
    : tie.status === 'IN_PROGRESS'
    ? 'border-volt-400/40'
    : 'border-white/10'

  if (isTBD) {
    return (
      <div className={`card border ${statusColor} opacity-40`}>
        <div className="flex items-center justify-center gap-2 py-2">
          <span className="text-white/30 text-sm font-semibold">To be decided</span>
        </div>
      </div>
    )
  }

  return (
    <div className={`card border-2 ${statusColor} space-y-2`}>
      {tie.status === 'IN_PROGRESS' && (
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 bg-volt-400 rounded-full animate-pulse" />
          <span className="text-volt-400 text-xs font-bold">In Progress</span>
        </div>
      )}
      {tie.status === 'DONE' && (
        <div className="text-xs text-white/30 font-semibold">Full Time</div>
      )}

      {/* Team rows */}
      {([
        { team: tie.home, leg1: tie.homeLeg1, leg2: tie.homeLeg2, agg: agg1, isWinner: tie.winner === 'home' },
        { team: tie.away, leg1: tie.awayLeg1, leg2: tie.awayLeg2, agg: agg2, isWinner: tie.winner === 'away' },
      ] as const).map((row, i) => (
        <div key={i} className={`flex items-center gap-2 py-1.5 px-2 rounded-lg ${row.isWinner ? 'bg-pitch-900/50' : ''}`}>
          <TeamBadge crest={row.team.crest} name={row.team.name} />
          <span className={`flex-1 text-sm font-bold truncate ${row.isWinner ? 'text-pitch-400' : 'text-white/80'}`}>
            {row.team.shortName}
            {row.isWinner && <span className="ml-1.5 text-xs">✓</span>}
          </span>
          {leg1Done && (
            <div className="flex items-center gap-2 shrink-0">
              {leg1Done && (
                <div className="text-center">
                  <div className="text-xs text-white/30 leading-none mb-0.5">L1</div>
                  <div className="text-sm font-bold text-white w-5 text-center">{row.leg1}</div>
                </div>
              )}
              {leg2Done && (
                <div className="text-center">
                  <div className="text-xs text-white/30 leading-none mb-0.5">L2</div>
                  <div className="text-sm font-bold text-white w-5 text-center">{row.leg2}</div>
                </div>
              )}
              {!leg2Done && tie.status === 'IN_PROGRESS' && (
                <div className="text-center">
                  <div className="text-xs text-white/30 leading-none mb-0.5">L2</div>
                  <div className="text-sm text-white/20 w-5 text-center">–</div>
                </div>
              )}
              <div className="text-center border-l border-white/10 pl-2">
                <div className="text-xs text-white/30 leading-none mb-0.5">Agg</div>
                <div className={`text-base font-extrabold w-6 text-center ${row.isWinner ? 'text-pitch-400' : 'text-white'}`}>{row.agg}</div>
              </div>
            </div>
          )}
          {!leg1Done && (
            <span className="text-xs text-white/20 font-semibold">TBD</span>
          )}
        </div>
      ))}
    </div>
  )
}

function KnockoutRoundSection({ round }: { round: KnockoutRound }) {
  const roundColor = round.shortName === 'F'
    ? 'text-volt-400 border-volt-400/30 bg-volt-400/10'
    : round.shortName === 'SF'
    ? 'text-pitch-400 border-pitch-500/30 bg-pitch-900/30'
    : 'text-white/60 border-white/10 bg-white/5'

  return (
    <div>
      <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border text-sm font-extrabold mb-4 ${roundColor}`}>
        {round.shortName === 'F' ? '🏆' : round.shortName === 'SF' ? '⚡' : '⚽'} {round.name}
      </div>
      <div className={`grid gap-4 ${round.ties.length === 1 ? 'max-w-sm' : round.ties.length === 2 ? 'sm:grid-cols-2 max-w-2xl' : 'sm:grid-cols-2 lg:grid-cols-4'}`}>
        {round.ties.map(tie => (
          <TieCard key={tie.id} tie={tie} />
        ))}
      </div>
    </div>
  )
}
