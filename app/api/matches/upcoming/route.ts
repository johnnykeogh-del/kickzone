import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

const KEY  = process.env.FOOTBALL_DATA_API_KEY || ''
const BASE = 'https://api.football-data.org/v4'
const TOP5 = ['PL', 'PD', 'BL1', 'SA', 'FL1']

const LEAGUE_FLAGS: Record<string, string> = {
  PL: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', PD: '🇪🇸', BL1: '🇩🇪', SA: '🇮🇹', FL1: '🇫🇷',
}

function pad(d: Date) {
  return d.toISOString().split('T')[0]
}

function formatKickoff(utcDate: string): string {
  const d = new Date(utcDate)
  return d.toLocaleDateString('en-GB', { weekday: 'short', month: 'short', day: 'numeric' })
    + ' ' + d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
}

// Fallback fixtures for when API key is missing
const FALLBACK = [
  { id: 1001, homeTeam: { name: 'Arsenal',     shortName: 'Arsenal',     crest: 'https://crests.football-data.org/57.png'  }, awayTeam: { name: 'Chelsea',      shortName: 'Chelsea',     crest: 'https://crests.football-data.org/61.png'  }, league: 'Premier League', leagueFlag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', kickoff: 'Sat 12:30',  status: 'SCHEDULED', score: null },
  { id: 1002, homeTeam: { name: 'Real Madrid',  shortName: 'Real Madrid', crest: 'https://crests.football-data.org/86.png'  }, awayTeam: { name: 'Barcelona',    shortName: 'Barcelona',   crest: 'https://crests.football-data.org/81.png'  }, league: 'La Liga',       leagueFlag: '🇪🇸', kickoff: 'Sat 20:00',  status: 'SCHEDULED', score: null },
  { id: 1003, homeTeam: { name: 'Bayern',       shortName: 'Bayern',      crest: 'https://crests.football-data.org/5.png'   }, awayTeam: { name: 'Dortmund',     shortName: 'Dortmund',    crest: 'https://crests.football-data.org/4.png'   }, league: 'Bundesliga',    leagueFlag: '🇩🇪', kickoff: 'Sat 15:30',  status: 'SCHEDULED', score: null },
  { id: 1004, homeTeam: { name: 'Inter Milan',  shortName: 'Inter',       crest: 'https://crests.football-data.org/98.png'  }, awayTeam: { name: 'Juventus',     shortName: 'Juventus',    crest: 'https://crests.football-data.org/109.png' }, league: 'Serie A',       leagueFlag: '🇮🇹', kickoff: 'Sun 18:00',  status: 'SCHEDULED', score: null },
  { id: 1005, homeTeam: { name: 'PSG',          shortName: 'PSG',         crest: 'https://crests.football-data.org/524.png' }, awayTeam: { name: 'Monaco',       shortName: 'Monaco',      crest: 'https://crests.football-data.org/532.png' }, league: 'Ligue 1',       leagueFlag: '🇫🇷', kickoff: 'Sun 20:45',  status: 'SCHEDULED', score: null },
]

export async function GET() {
  if (!KEY) return NextResponse.json({ matches: FALLBACK, source: 'fallback' })

  const now      = new Date()
  const fourWeeks = new Date(Date.now() + 28 * 86400000)

  try {
    const res = await fetch(
      `${BASE}/matches?status=SCHEDULED&dateFrom=${pad(now)}&dateTo=${pad(fourWeeks)}`,
      // Always fetch fresh — never serve cached upcoming-match data
      { headers: { 'X-Auth-Token': KEY }, cache: 'no-store' }
    )
    if (!res.ok) return NextResponse.json({ matches: FALLBACK, source: 'fallback' })

    const data = await res.json()
    const all  = (data.matches || []) as any[]

    const filtered = all
      .filter(m => TOP5.includes(m.competition?.code))
      // Only keep matches that haven't kicked off yet
      .filter(m => new Date(m.utcDate) > now)
      .slice(0, 10)
      .map(m => ({
        id:       m.id,
        homeTeam: { name: m.homeTeam.name, shortName: m.homeTeam.shortName || m.homeTeam.tla, crest: m.homeTeam.crest || `https://crests.football-data.org/${m.homeTeam.id}.png` },
        awayTeam: { name: m.awayTeam.name, shortName: m.awayTeam.shortName || m.awayTeam.tla, crest: m.awayTeam.crest || `https://crests.football-data.org/${m.awayTeam.id}.png` },
        league:      m.competition.name,
        leagueFlag:  LEAGUE_FLAGS[m.competition.code] || '🏆',
        kickoff:     formatKickoff(m.utcDate),
        utcDate:     m.utcDate,
        status:      m.status,
        score:       m.score?.fullTime ?? null,
      }))

    return NextResponse.json({ matches: filtered.length >= 3 ? filtered : FALLBACK, source: filtered.length >= 3 ? 'live' : 'fallback' })
  } catch {
    return NextResponse.json({ matches: FALLBACK, source: 'fallback' })
  }
}
