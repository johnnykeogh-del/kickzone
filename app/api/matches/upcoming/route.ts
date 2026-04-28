import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

const KEY  = process.env.FOOTBALL_DATA_API_KEY || ''
const BASE = 'https://api.football-data.org/v4'

const LEAGUES = [
  { code: 'PL',  name: 'Premier League', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
  { code: 'PD',  name: 'La Liga',        flag: '🇪🇸' },
  { code: 'BL1', name: 'Bundesliga',     flag: '🇩🇪' },
  { code: 'SA',  name: 'Serie A',        flag: '🇮🇹' },
  { code: 'FL1', name: 'Ligue 1',        flag: '🇫🇷' },
]

function formatKickoff(utcDate: string): string {
  const d = new Date(utcDate)
  return d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })
    + ' · ' + d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }) + ' UTC'
}

const FALLBACK = [
  { id: 1001, homeTeam: { name: 'Arsenal',    shortName: 'Arsenal',    crest: 'https://crests.football-data.org/57.png'  }, awayTeam: { name: 'Chelsea',   shortName: 'Chelsea',   crest: 'https://crests.football-data.org/61.png'  }, league: 'Premier League', leagueFlag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', kickoff: 'Sample fixture', utcDate: '', status: 'SCHEDULED', score: null },
  { id: 1002, homeTeam: { name: 'Real Madrid', shortName: 'Real Madrid',crest: 'https://crests.football-data.org/86.png'  }, awayTeam: { name: 'Barcelona', shortName: 'Barcelona', crest: 'https://crests.football-data.org/81.png'  }, league: 'La Liga',       leagueFlag: '🇪🇸',         kickoff: 'Sample fixture', utcDate: '', status: 'SCHEDULED', score: null },
  { id: 1003, homeTeam: { name: 'Bayern',      shortName: 'Bayern',     crest: 'https://crests.football-data.org/5.png'   }, awayTeam: { name: 'Dortmund', shortName: 'Dortmund',  crest: 'https://crests.football-data.org/4.png'   }, league: 'Bundesliga',    leagueFlag: '🇩🇪',         kickoff: 'Sample fixture', utcDate: '', status: 'SCHEDULED', score: null },
  { id: 1004, homeTeam: { name: 'Inter Milan', shortName: 'Inter',      crest: 'https://crests.football-data.org/98.png'  }, awayTeam: { name: 'Juventus', shortName: 'Juventus',  crest: 'https://crests.football-data.org/109.png' }, league: 'Serie A',       leagueFlag: '🇮🇹',         kickoff: 'Sample fixture', utcDate: '', status: 'SCHEDULED', score: null },
  { id: 1005, homeTeam: { name: 'PSG',         shortName: 'PSG',        crest: 'https://crests.football-data.org/524.png' }, awayTeam: { name: 'Monaco',   shortName: 'Monaco',    crest: 'https://crests.football-data.org/532.png' }, league: 'Ligue 1',       leagueFlag: '🇫🇷',         kickoff: 'Sample fixture', utcDate: '', status: 'SCHEDULED', score: null },
]

async function fetchLeagueScheduled(code: string, name: string, flag: string, now: Date) {
  try {
    const res = await fetch(
      `${BASE}/competitions/${code}/matches?status=SCHEDULED`,
      { headers: { 'X-Auth-Token': KEY }, cache: 'no-store' }
    )
    if (!res.ok) return []
    const data = await res.json()
    return ((data.matches || []) as any[])
      .filter((m: any) => new Date(m.utcDate) > now)
      .map((m: any) => ({
        id:          m.id,
        homeTeam: {
          name:      m.homeTeam.name,
          shortName: m.homeTeam.shortName || m.homeTeam.tla || m.homeTeam.name,
          crest:     m.homeTeam.crest || `https://crests.football-data.org/${m.homeTeam.id}.png`,
        },
        awayTeam: {
          name:      m.awayTeam.name,
          shortName: m.awayTeam.shortName || m.awayTeam.tla || m.awayTeam.name,
          crest:     m.awayTeam.crest || `https://crests.football-data.org/${m.awayTeam.id}.png`,
        },
        league:      name,
        leagueFlag:  flag,
        kickoff:     formatKickoff(m.utcDate),
        utcDate:     m.utcDate,
        status:      m.status,
        score:       m.score?.fullTime ?? null,
      }))
  } catch {
    return []
  }
}

export async function GET() {
  if (!KEY) return NextResponse.json({ matches: FALLBACK, source: 'fallback' })

  const now = new Date()

  // Query all 5 leagues in parallel — works reliably on free tier
  const results = await Promise.all(
    LEAGUES.map(l => fetchLeagueScheduled(l.code, l.name, l.flag, now))
  )

  // Flatten, sort by date, take 10 soonest
  const all = results
    .flat()
    .sort((a, b) => new Date(a.utcDate).getTime() - new Date(b.utcDate).getTime())
    .slice(0, 10)

  return NextResponse.json({
    matches: all.length >= 3 ? all : FALLBACK,
    source:  all.length >= 3 ? 'live' : 'fallback',
  })
}
