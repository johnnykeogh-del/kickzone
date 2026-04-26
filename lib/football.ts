// Football-Data.org API — free tier
const BASE = 'https://api.football-data.org/v4'
const KEY = process.env.FOOTBALL_DATA_API_KEY || ''

function headers() {
  return { 'X-Auth-Token': KEY }
}

export const LEAGUES = {
  PL:  { name: 'Premier League',    country: 'England',  flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
  PD:  { name: 'La Liga',           country: 'Spain',    flag: '🇪🇸' },
  BL1: { name: 'Bundesliga',        country: 'Germany',  flag: '🇩🇪' },
  SA:  { name: 'Serie A',           country: 'Italy',    flag: '🇮🇹' },
  FL1: { name: 'Ligue 1',           country: 'France',   flag: '🇫🇷' },
  PPL: { name: 'Primeira Liga',     country: 'Portugal', flag: '🇵🇹' },
  ELC: { name: 'Championship',      country: 'England',  flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
  CL:  { name: 'Champions League',  country: 'Europe',   flag: '🇪🇺' },
  EC:  { name: 'Europa Conference', country: 'Europe',   flag: '🇪🇺' },
  WC:  { name: 'World Cup 2026',    country: 'World',    flag: '🌍' },
}

export type LeagueCode = keyof typeof LEAGUES

export interface Standing {
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

export interface Match {
  id: number
  utcDate: string
  status: string
  homeTeam: { id: number; name: string; shortName: string; crest: string }
  awayTeam: { id: number; name: string; shortName: string; crest: string }
  score: {
    fullTime: { home: number | null; away: number | null }
    halfTime: { home: number | null; away: number | null }
  }
  competition: { id: number; name: string; code: string }
}

export async function getStandings(leagueCode: LeagueCode): Promise<Standing[]> {
  if (!KEY) return getMockStandings(leagueCode)
  try {
    const res = await fetch(`${BASE}/competitions/${leagueCode}/standings`, {
      headers: headers(),
      next: { revalidate: 3600 },
    })
    if (!res.ok) return getMockStandings(leagueCode)
    const data = await res.json()
    return data.standings?.[0]?.table || []
  } catch {
    return getMockStandings(leagueCode)
  }
}

export async function getMatches(leagueCode: LeagueCode, status = 'SCHEDULED'): Promise<Match[]> {
  if (!KEY) return getMockMatches(leagueCode)
  try {
    const res = await fetch(`${BASE}/competitions/${leagueCode}/matches?status=${status}&limit=10`, {
      headers: headers(),
      next: { revalidate: 300 },
    })
    if (!res.ok) return getMockMatches(leagueCode)
    const data = await res.json()
    return data.matches || []
  } catch {
    return getMockMatches(leagueCode)
  }
}

export async function getTodaysMatches(): Promise<Match[]> {
  if (!KEY) return getTodaysMockMatches()
  try {
    const today = new Date().toISOString().split('T')[0]
    const res = await fetch(`${BASE}/matches?dateFrom=${today}&dateTo=${today}`, {
      headers: headers(),
      next: { revalidate: 60 },
    })
    if (!res.ok) return getTodaysMockMatches()
    const data = await res.json()
    return data.matches || []
  } catch {
    return getTodaysMockMatches()
  }
}

// ---- Mock data so the site always looks great ----

const MOCK_TEAMS: Record<string, Array<{ id: number; name: string; shortName: string; tla: string; w: number; d: number; l: number; pts: number; gf: number; ga: number }>> = {
  PL: [
    { id: 64,  name: 'Liverpool FC',           shortName: 'Liverpool',   tla: 'LIV', w: 25, d: 5, l: 2,  pts: 80, gf: 75, ga: 28 },
    { id: 57,  name: 'Arsenal FC',             shortName: 'Arsenal',     tla: 'ARS', w: 22, d: 5, l: 5,  pts: 71, gf: 65, ga: 30 },
    { id: 65,  name: 'Manchester City FC',     shortName: 'Man City',    tla: 'MCI', w: 19, d: 6, l: 7,  pts: 63, gf: 60, ga: 38 },
    { id: 397, name: 'Aston Villa FC',         shortName: 'Aston Villa', tla: 'AVL', w: 18, d: 5, l: 9,  pts: 59, gf: 62, ga: 46 },
    { id: 73,  name: 'Tottenham Hotspur FC',   shortName: 'Spurs',       tla: 'TOT', w: 16, d: 6, l: 10, pts: 54, gf: 58, ga: 52 },
    { id: 61,  name: 'Chelsea FC',             shortName: 'Chelsea',     tla: 'CHE', w: 15, d: 8, l: 9,  pts: 53, gf: 55, ga: 48 },
    { id: 66,  name: 'Manchester United FC',   shortName: 'Man Utd',     tla: 'MUN', w: 13, d: 5, l: 14, pts: 44, gf: 38, ga: 50 },
    { id: 354, name: 'Newcastle United FC',    shortName: 'Newcastle',   tla: 'NEW', w: 13, d: 4, l: 15, pts: 43, gf: 44, ga: 48 },
    { id: 563, name: 'West Ham United FC',     shortName: 'West Ham',    tla: 'WHU', w: 11, d: 7, l: 14, pts: 40, gf: 40, ga: 55 },
    { id: 402, name: 'Brighton & Hove Albion', shortName: 'Brighton',    tla: 'BHA', w: 11, d: 6, l: 15, pts: 39, gf: 45, ga: 52 },
    { id: 328, name: 'Bournemouth',            shortName: 'Bournemouth', tla: 'BOU', w: 11, d: 5, l: 16, pts: 38, gf: 42, ga: 56 },
    { id: 76,  name: 'Wolverhampton Wanderers',shortName: 'Wolves',      tla: 'WOL', w: 10, d: 6, l: 16, pts: 36, gf: 38, ga: 57 },
    { id: 340, name: 'Fulham FC',              shortName: 'Fulham',      tla: 'FUL', w: 9,  d: 8, l: 15, pts: 35, gf: 37, ga: 52 },
    { id: 715, name: 'Brentford FC',           shortName: 'Brentford',   tla: 'BRE', w: 9,  d: 7, l: 16, pts: 34, gf: 42, ga: 60 },
    { id: 1044,name: 'Crystal Palace FC',      shortName: 'Crystal Palace',tla:'CRY',w: 8,  d: 9, l: 15, pts: 33, gf: 33, ga: 48 },
    { id: 563, name: 'Everton FC',             shortName: 'Everton',     tla: 'EVE', w: 8,  d: 8, l: 16, pts: 32, gf: 30, ga: 50 },
    { id: 389, name: 'Nottingham Forest',      shortName: "Nott'm Forest",tla:'NFO', w: 9,  d: 4, l: 19, pts: 31, gf: 35, ga: 55 },
    { id: 75,  name: 'Ipswich Town FC',        shortName: 'Ipswich',     tla: 'IPS', w: 4,  d: 8, l: 20, pts: 20, gf: 28, ga: 68 },
    { id: 341, name: 'Leicester City FC',      shortName: 'Leicester',   tla: 'LEI', w: 4,  d: 7, l: 21, pts: 19, gf: 30, ga: 72 },
    { id: 346, name: 'Southampton FC',         shortName: 'Southampton', tla: 'SOU', w: 2,  d: 5, l: 25, pts: 11, gf: 20, ga: 80 },
  ],
  PD: [
    { id: 86,  name: 'Real Madrid CF',      shortName: 'Real Madrid',  tla: 'RMA', w: 23, d: 5, l: 4,  pts: 74, gf: 72, ga: 35 },
    { id: 81,  name: 'FC Barcelona',        shortName: 'Barcelona',    tla: 'FCB', w: 22, d: 4, l: 6,  pts: 70, gf: 68, ga: 32 },
    { id: 77,  name: 'Atlético de Madrid',  shortName: 'Atlético',     tla: 'ATM', w: 20, d: 7, l: 5,  pts: 67, gf: 58, ga: 28 },
    { id: 90,  name: 'Real Sociedad',       shortName: 'Real Sociedad',tla: 'RSO', w: 15, d: 8, l: 9,  pts: 53, gf: 48, ga: 42 },
    { id: 95,  name: 'Athletic Club',       shortName: 'Athletic',     tla: 'ATH', w: 14, d: 9, l: 9,  pts: 51, gf: 45, ga: 38 },
    { id: 94,  name: 'Villarreal CF',       shortName: 'Villarreal',   tla: 'VIL', w: 14, d: 7, l: 11, pts: 49, gf: 50, ga: 44 },
    { id: 80,  name: 'Sevilla FC',          shortName: 'Sevilla',      tla: 'SEV', w: 13, d: 8, l: 11, pts: 47, gf: 44, ga: 42 },
    { id: 87,  name: 'Rayo Vallecano',      shortName: 'Rayo',         tla: 'RAY', w: 12, d: 7, l: 13, pts: 43, gf: 38, ga: 45 },
    { id: 82,  name: 'Getafe CF',           shortName: 'Getafe',       tla: 'GET', w: 10, d: 9, l: 13, pts: 39, gf: 32, ga: 40 },
    { id: 92,  name: 'Real Betis',          shortName: 'Betis',        tla: 'BET', w: 10, d: 8, l: 14, pts: 38, gf: 40, ga: 50 },
    { id: 96,  name: 'Celta de Vigo',       shortName: 'Celta Vigo',   tla: 'CEL', w: 10, d: 7, l: 15, pts: 37, gf: 38, ga: 52 },
    { id: 263, name: 'Deportivo Alavés',    shortName: 'Alavés',       tla: 'ALA', w: 9,  d: 8, l: 15, pts: 35, gf: 33, ga: 50 },
    { id: 264, name: 'UD Las Palmas',       shortName: 'Las Palmas',   tla: 'LPA', w: 8,  d: 9, l: 15, pts: 33, gf: 30, ga: 48 },
    { id: 275, name: 'RCD Mallorca',        shortName: 'Mallorca',     tla: 'MAL', w: 8,  d: 8, l: 16, pts: 32, gf: 28, ga: 46 },
    { id: 89,  name: 'RC Celta',            shortName: 'Osasuna',      tla: 'OSA', w: 8,  d: 7, l: 17, pts: 31, gf: 30, ga: 52 },
    { id: 266, name: 'Valencia CF',         shortName: 'Valencia',     tla: 'VAL', w: 7,  d: 9, l: 16, pts: 30, gf: 32, ga: 55 },
    { id: 276, name: 'RCD Espanyol',        shortName: 'Espanyol',     tla: 'ESP', w: 6,  d: 8, l: 18, pts: 26, gf: 26, ga: 58 },
    { id: 251, name: 'CD Leganés',          shortName: 'Leganés',      tla: 'LEG', w: 5,  d: 8, l: 19, pts: 23, gf: 22, ga: 60 },
    { id: 298, name: 'Real Valladolid',     shortName: 'Valladolid',   tla: 'VLL', w: 4,  d: 7, l: 21, pts: 19, gf: 20, ga: 65 },
    { id: 270, name: 'Girona FC',           shortName: 'Girona',       tla: 'GIR', w: 10, d: 5, l: 17, pts: 35, gf: 42, ga: 55 },
  ],
  BL1: [
    { id: 5,   name: 'FC Bayern München',    shortName: 'Bayern',       tla: 'BAY', w: 22, d: 4, l: 6,  pts: 70, gf: 80, ga: 35 },
    { id: 3,   name: 'Bayer 04 Leverkusen',  shortName: 'Leverkusen',   tla: 'B04', w: 20, d: 6, l: 6,  pts: 66, gf: 68, ga: 32 },
    { id: 4,   name: 'Borussia Dortmund',    shortName: 'Dortmund',     tla: 'BVB', w: 18, d: 5, l: 9,  pts: 59, gf: 58, ga: 40 },
    { id: 11,  name: 'RB Leipzig',           shortName: 'RB Leipzig',   tla: 'RBL', w: 17, d: 6, l: 9,  pts: 57, gf: 55, ga: 38 },
    { id: 6,   name: 'Eintracht Frankfurt',  shortName: 'Frankfurt',    tla: 'SGE', w: 15, d: 7, l: 10, pts: 52, gf: 52, ga: 45 },
    { id: 10,  name: 'VfB Stuttgart',        shortName: 'Stuttgart',    tla: 'VFB', w: 14, d: 6, l: 12, pts: 48, gf: 48, ga: 46 },
    { id: 18,  name: 'Borussia Mönchengladbach',shortName: "M'gladbach", tla: 'BMG', w: 12, d: 7, l: 13, pts: 43, gf: 45, ga: 50 },
    { id: 9,   name: 'SC Freiburg',          shortName: 'Freiburg',     tla: 'SCF', w: 11, d: 8, l: 13, pts: 41, gf: 40, ga: 48 },
    { id: 28,  name: 'TSG 1899 Hoffenheim',  shortName: 'Hoffenheim',   tla: 'TSG', w: 10, d: 7, l: 15, pts: 37, gf: 38, ga: 52 },
    { id: 7,   name: 'SV Werder Bremen',     shortName: 'Bremen',       tla: 'SVW', w: 10, d: 6, l: 16, pts: 36, gf: 38, ga: 55 },
    { id: 16,  name: 'FC Augsburg',          shortName: 'Augsburg',     tla: 'FCA', w: 9,  d: 8, l: 15, pts: 35, gf: 34, ga: 50 },
    { id: 1,   name: '1. FC Union Berlin',   shortName: 'Union Berlin', tla: 'FCU', w: 9,  d: 6, l: 17, pts: 33, gf: 32, ga: 55 },
    { id: 2,   name: 'Werder Bremen',        shortName: 'Wolfsburg',    tla: 'WOB', w: 8,  d: 7, l: 17, pts: 31, gf: 30, ga: 55 },
    { id: 15,  name: 'Mainz 05',             shortName: 'Mainz',        tla: 'M05', w: 7,  d: 9, l: 16, pts: 30, gf: 30, ga: 52 },
    { id: 19,  name: 'FC St. Pauli',         shortName: 'St. Pauli',    tla: 'STP', w: 6,  d: 8, l: 18, pts: 26, gf: 26, ga: 60 },
    { id: 720, name: 'Holstein Kiel',        shortName: 'Kiel',         tla: 'KIE', w: 4,  d: 6, l: 22, pts: 18, gf: 22, ga: 72 },
    { id: 44,  name: 'VfL Bochum',          shortName: 'Bochum',       tla: 'BOC', w: 3,  d: 5, l: 24, pts: 14, gf: 18, ga: 78 },
    { id: 37,  name: '1. FC Heidenheim 1846',shortName: 'Heidenheim',   tla: 'FCH', w: 8,  d: 5, l: 19, pts: 29, gf: 32, ga: 58 },
  ],
  SA: [
    { id: 108, name: 'SSC Napoli',           shortName: 'Napoli',       tla: 'NAP', w: 21, d: 7, l: 4,  pts: 70, gf: 60, ga: 28 },
    { id: 98,  name: 'FC Internazionale',    shortName: 'Inter',        tla: 'INT', w: 20, d: 8, l: 4,  pts: 68, gf: 65, ga: 30 },
    { id: 100, name: 'AC Milan',             shortName: 'Milan',        tla: 'MIL', w: 18, d: 7, l: 7,  pts: 61, gf: 55, ga: 35 },
    { id: 109, name: 'Juventus FC',          shortName: 'Juventus',     tla: 'JUV', w: 17, d: 9, l: 6,  pts: 60, gf: 50, ga: 28 },
    { id: 99,  name: 'AS Roma',              shortName: 'Roma',         tla: 'ROM', w: 15, d: 7, l: 10, pts: 52, gf: 48, ga: 40 },
    { id: 102, name: 'SS Lazio',             shortName: 'Lazio',        tla: 'LAZ', w: 14, d: 8, l: 10, pts: 50, gf: 50, ga: 44 },
    { id: 103, name: 'ACF Fiorentina',       shortName: 'Fiorentina',   tla: 'FIO', w: 14, d: 7, l: 11, pts: 49, gf: 48, ga: 42 },
    { id: 586, name: 'Atalanta BC',          shortName: 'Atalanta',     tla: 'ATA', w: 16, d: 4, l: 12, pts: 52, gf: 62, ga: 48 },
    { id: 113, name: 'Torino FC',            shortName: 'Torino',       tla: 'TOR', w: 11, d: 9, l: 12, pts: 42, gf: 40, ga: 42 },
    { id: 115, name: 'Bologna FC',           shortName: 'Bologna',      tla: 'BOL', w: 11, d: 7, l: 14, pts: 40, gf: 40, ga: 48 },
    { id: 107, name: 'UC Sampdoria',         shortName: 'Udinese',      tla: 'UDI', w: 10, d: 8, l: 14, pts: 38, gf: 35, ga: 48 },
    { id: 104, name: 'Cagliari Calcio',      shortName: 'Cagliari',     tla: 'CAG', w: 9,  d: 8, l: 15, pts: 35, gf: 32, ga: 50 },
    { id: 105, name: 'Genoa CFC',            shortName: 'Genoa',        tla: 'GEN', w: 8,  d: 9, l: 15, pts: 33, gf: 30, ga: 50 },
    { id: 106, name: 'Hellas Verona FC',     shortName: 'Verona',       tla: 'HEL', w: 7,  d: 8, l: 17, pts: 29, gf: 28, ga: 55 },
    { id: 114, name: 'US Lecce',             shortName: 'Lecce',        tla: 'LEC', w: 6,  d: 8, l: 18, pts: 26, gf: 25, ga: 58 },
    { id: 119, name: 'Parma Calcio 1913',    shortName: 'Parma',        tla: 'PAR', w: 5,  d: 9, l: 18, pts: 24, gf: 26, ga: 62 },
    { id: 118, name: 'Como 1907',            shortName: 'Como',         tla: 'COM', w: 5,  d: 8, l: 19, pts: 23, gf: 25, ga: 65 },
    { id: 116, name: 'Venezia FC',           shortName: 'Venezia',      tla: 'VEN', w: 4,  d: 7, l: 21, pts: 19, gf: 22, ga: 68 },
    { id: 117, name: 'Empoli FC',            shortName: 'Empoli',       tla: 'EMP', w: 6,  d: 6, l: 20, pts: 24, gf: 26, ga: 62 },
    { id: 110, name: 'Monza',               shortName: 'Monza',        tla: 'MON', w: 4,  d: 6, l: 22, pts: 18, gf: 20, ga: 70 },
  ],
  FL1: [
    { id: 524, name: 'Paris Saint-Germain FC',shortName: 'PSG',         tla: 'PSG', w: 22, d: 5, l: 3,  pts: 71, gf: 65, ga: 25 },
    { id: 532, name: 'AS Monaco FC',         shortName: 'Monaco',       tla: 'ASM', w: 20, d: 5, l: 5,  pts: 65, gf: 60, ga: 32 },
    { id: 516, name: 'Olympique de Marseille',shortName: 'Marseille',   tla: 'OM',  w: 18, d: 6, l: 6,  pts: 60, gf: 52, ga: 30 },
    { id: 522, name: 'Lille OSC',            shortName: 'Lille',        tla: 'LOD', w: 17, d: 7, l: 6,  pts: 58, gf: 48, ga: 28 },
    { id: 536, name: 'Stade Rennais FC',     shortName: 'Rennes',       tla: 'SRF', w: 14, d: 7, l: 9,  pts: 49, gf: 44, ga: 38 },
    { id: 518, name: 'OGC Nice',             shortName: 'Nice',         tla: 'NIC', w: 13, d: 8, l: 9,  pts: 47, gf: 42, ga: 36 },
    { id: 527, name: 'RC Lens',              shortName: 'Lens',         tla: 'RCL', w: 13, d: 7, l: 10, pts: 46, gf: 44, ga: 40 },
    { id: 514, name: 'Stade Brestois 29',    shortName: 'Brest',        tla: 'SB29',w: 12, d: 6, l: 12, pts: 42, gf: 40, ga: 42 },
    { id: 529, name: 'Olympique Lyonnais',   shortName: 'Lyon',         tla: 'OL',  w: 11, d: 8, l: 11, pts: 41, gf: 42, ga: 44 },
    { id: 528, name: 'Montpellier HSC',      shortName: 'Montpellier',  tla: 'MHSC',w: 9,  d: 7, l: 14, pts: 34, gf: 34, ga: 50 },
    { id: 538, name: 'Toulouse FC',          shortName: 'Toulouse',     tla: 'TFC', w: 9,  d: 6, l: 15, pts: 33, gf: 33, ga: 48 },
    { id: 535, name: 'Stade de Reims',       shortName: 'Reims',        tla: 'SDR', w: 8,  d: 8, l: 14, pts: 32, gf: 30, ga: 46 },
    { id: 512, name: 'RC Strasbourg Alsace', shortName: 'Strasbourg',   tla: 'RCS', w: 8,  d: 7, l: 15, pts: 31, gf: 32, ga: 50 },
    { id: 533, name: 'Le Havre AC',          shortName: 'Le Havre',     tla: 'HAC', w: 7,  d: 8, l: 15, pts: 29, gf: 28, ga: 52 },
    { id: 519, name: 'Nantes',               shortName: 'Nantes',       tla: 'FCN', w: 6,  d: 8, l: 16, pts: 26, gf: 26, ga: 55 },
    { id: 526, name: 'AS Saint-Étienne',     shortName: 'Saint-Étienne',tla: 'ASSE',w: 5,  d: 6, l: 19, pts: 21, gf: 22, ga: 62 },
    { id: 521, name: 'Angers SCO',           shortName: 'Angers',       tla: 'SCO', w: 3,  d: 6, l: 21, pts: 15, gf: 18, ga: 68 },
    { id: 523, name: 'Auxerre',              shortName: 'Auxerre',      tla: 'AJA', w: 8,  d: 5, l: 17, pts: 29, gf: 30, ga: 52 },
  ],
  PPL: [
    { id: 503, name: 'SL Benfica',           shortName: 'Benfica',      tla: 'SLB', w: 22, d: 5, l: 3,  pts: 71, gf: 62, ga: 22 },
    { id: 498, name: 'Sporting CP',          shortName: 'Sporting',     tla: 'SCP', w: 20, d: 6, l: 4,  pts: 66, gf: 58, ga: 25 },
    { id: 497, name: 'FC Porto',             shortName: 'Porto',        tla: 'FCP', w: 19, d: 5, l: 6,  pts: 62, gf: 55, ga: 28 },
    { id: 5601,name: 'SC Braga',             shortName: 'Braga',        tla: 'SCB', w: 14, d: 7, l: 9,  pts: 49, gf: 44, ga: 35 },
    { id: 496, name: 'Vitória SC',           shortName: 'Vitória',      tla: 'VSC', w: 12, d: 6, l: 12, pts: 42, gf: 38, ga: 40 },
    { id: 5602,name: 'Casa Pia AC',          shortName: 'Casa Pia',     tla: 'CPA', w: 10, d: 8, l: 12, pts: 38, gf: 32, ga: 38 },
    { id: 5603,name: 'Estoril Praia',        shortName: 'Estoril',      tla: 'EST', w: 9,  d: 7, l: 14, pts: 34, gf: 30, ga: 42 },
    { id: 5604,name: 'Rio Ave FC',           shortName: 'Rio Ave',      tla: 'RAV', w: 8,  d: 8, l: 14, pts: 32, gf: 28, ga: 44 },
  ],
}

function getMockStandings(code: LeagueCode): Standing[] {
  const teams = MOCK_TEAMS[code] || MOCK_TEAMS['PL']
  const sorted = [...teams].sort((a, b) => b.pts - a.pts || (b.gf - b.ga) - (a.gf - a.ga))
  return sorted.map((t, i) => ({
    position: i + 1,
    team: { ...t, crest: `https://crests.football-data.org/${t.id}.png` },
    playedGames: t.w + t.d + t.l,
    won: t.w, draw: t.d, lost: t.l,
    points: t.pts,
    goalsFor: t.gf,
    goalsAgainst: t.ga,
    goalDifference: t.gf - t.ga,
    form: ['W','W','D','W','L','W','D'].sort(() => Math.random() - 0.5).slice(0,5).join(','),
  }))
}

function getMockMatches(code: LeagueCode): Match[] {
  return getTodaysMockMatches()
}

function getTodaysMockMatches(): Match[] {
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)

  return [
    {
      id: 1, utcDate: tomorrow.toISOString(), status: 'SCHEDULED',
      homeTeam: { id: 57, name: 'Arsenal FC', shortName: 'Arsenal', crest: 'https://crests.football-data.org/57.png' },
      awayTeam: { id: 64, name: 'Liverpool FC', shortName: 'Liverpool', crest: 'https://crests.football-data.org/64.png' },
      score: { fullTime: { home: null, away: null }, halfTime: { home: null, away: null } },
      competition: { id: 2021, name: 'Premier League', code: 'PL' },
    },
    {
      id: 2, utcDate: tomorrow.toISOString(), status: 'SCHEDULED',
      homeTeam: { id: 86, name: 'Real Madrid CF', shortName: 'Real Madrid', crest: 'https://crests.football-data.org/86.png' },
      awayTeam: { id: 81, name: 'FC Barcelona', shortName: 'Barcelona', crest: 'https://crests.football-data.org/81.png' },
      score: { fullTime: { home: null, away: null }, halfTime: { home: null, away: null } },
      competition: { id: 2014, name: 'La Liga', code: 'PD' },
    },
    {
      id: 3, utcDate: new Date().toISOString(), status: 'IN_PLAY',
      homeTeam: { id: 5, name: 'FC Bayern München', shortName: 'Bayern', crest: 'https://crests.football-data.org/5.png' },
      awayTeam: { id: 4, name: 'Borussia Dortmund', shortName: 'Dortmund', crest: 'https://crests.football-data.org/4.png' },
      score: { fullTime: { home: 2, away: 1 }, halfTime: { home: 1, away: 0 } },
      competition: { id: 2002, name: 'Bundesliga', code: 'BL1' },
    },
  ]
}

// Top players mock data with market values
export const TOP_PLAYERS = [
  { id: 1, name: 'Erling Haaland',    team: 'Manchester City',  position: 'Striker',    nationality: '🇳🇴', marketValue: '€180M', age: 24, goals: 27, assists: 5,  rating: 9.1, photo: 'https://img.a.transfermarkt.technology/portrait/big/418560-1701275689.jpg' },
  { id: 2, name: 'Kylian Mbappé',     team: 'Real Madrid',      position: 'Forward',    nationality: '🇫🇷', marketValue: '€180M', age: 26, goals: 24, assists: 8,  rating: 9.0, photo: 'https://img.a.transfermarkt.technology/portrait/big/342229-1682683695.jpg' },
  { id: 3, name: 'Vinicius Jr.',       team: 'Real Madrid',      position: 'Forward',    nationality: '🇧🇷', marketValue: '€180M', age: 24, goals: 18, assists: 11, rating: 8.9, photo: 'https://img.a.transfermarkt.technology/portrait/big/371998-1695892614.jpg' },
  { id: 4, name: 'Bukayo Saka',        team: 'Arsenal',          position: 'Winger',     nationality: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', marketValue: '€150M', age: 23, goals: 15, assists: 12, rating: 8.8, photo: 'https://img.a.transfermarkt.technology/portrait/big/433177-1695897072.jpg' },
  { id: 5, name: 'Jude Bellingham',   team: 'Real Madrid',      position: 'Midfielder', nationality: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', marketValue: '€180M', age: 21, goals: 16, assists: 6,  rating: 8.9, photo: 'https://img.a.transfermarkt.technology/portrait/big/581678-1695892766.jpg' },
  { id: 6, name: 'Rodri',             team: 'Manchester City',  position: 'Midfielder', nationality: '🇪🇸', marketValue: '€120M', age: 28, goals: 8,  assists: 9,  rating: 9.0, photo: 'https://img.a.transfermarkt.technology/portrait/big/357565-1695893020.jpg' },
  { id: 7, name: 'Phil Foden',        team: 'Manchester City',  position: 'Midfielder', nationality: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', marketValue: '€150M', age: 24, goals: 12, assists: 10, rating: 8.7, photo: 'https://img.a.transfermarkt.technology/portrait/big/406635-1695893168.jpg' },
  { id: 8, name: 'Lamine Yamal',      team: 'FC Barcelona',     position: 'Winger',     nationality: '🇪🇸', marketValue: '€180M', age: 17, goals: 12, assists: 14, rating: 8.8, photo: 'https://img.a.transfermarkt.technology/portrait/big/945518-1695893343.jpg' },
  { id: 9, name: 'Mohamed Salah',     team: 'Liverpool',        position: 'Forward',    nationality: '🇪🇬', marketValue: '€60M',  age: 32, goals: 20, assists: 13, rating: 8.8, photo: 'https://img.a.transfermarkt.technology/portrait/big/148669-1695893577.jpg' },
  { id: 10, name: 'Harry Kane',       team: 'Bayern Munich',    position: 'Striker',    nationality: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', marketValue: '€100M', age: 31, goals: 28, assists: 7,  rating: 8.7, photo: 'https://img.a.transfermarkt.technology/portrait/big/132098-1695893440.jpg' },
  { id: 11, name: 'Pedri',            team: 'FC Barcelona',     position: 'Midfielder', nationality: '🇪🇸', marketValue: '€120M', age: 22, goals: 7,  assists: 8,  rating: 8.5, photo: 'https://img.a.transfermarkt.technology/portrait/big/557802-1695893692.jpg' },
  { id: 12, name: 'Florian Wirtz',    team: 'Bayer Leverkusen', position: 'Midfielder', nationality: '🇩🇪', marketValue: '€150M', age: 21, goals: 14, assists: 12, rating: 8.8, photo: 'https://img.a.transfermarkt.technology/portrait/big/521361-1695893792.jpg' },
]

export interface KnockoutTie {
  id: number
  home: { name: string; shortName: string; crest: string }
  away: { name: string; shortName: string; crest: string }
  homeLeg1: number | null
  awayLeg1: number | null
  homeLeg2: number | null
  awayLeg2: number | null
  status: 'UPCOMING' | 'IN_PROGRESS' | 'DONE'
  winner?: 'home' | 'away'
}

export interface KnockoutRound {
  name: string
  shortName: string
  ties: KnockoutTie[]
}

export interface WCGroup {
  name: string
  teams: Array<{ id: number; name: string; shortName: string; tla: string; flag: string; w: number; d: number; l: number; pts: number; gf: number; ga: number }>
}

export const WC_2026_GROUPS: WCGroup[] = [
  { name: 'Group A', teams: [
    { id: 9005, name: 'United States',  shortName: 'USA',     tla: 'USA', flag: '🇺🇸', w: 2, d: 1, l: 0, pts: 7, gf: 5, ga: 2 },
    { id: 9006, name: 'Mexico',         shortName: 'Mexico',  tla: 'MEX', flag: '🇲🇽', w: 1, d: 1, l: 1, pts: 4, gf: 3, ga: 3 },
    { id: 9007, name: 'Canada',         shortName: 'Canada',  tla: 'CAN', flag: '🇨🇦', w: 1, d: 0, l: 2, pts: 3, gf: 2, ga: 4 },
    { id: 9008, name: 'Serbia',         shortName: 'Serbia',  tla: 'SRB', flag: '🇷🇸', w: 0, d: 2, l: 1, pts: 2, gf: 2, ga: 3 },
  ]},
  { name: 'Group B', teams: [
    { id: 9009, name: 'Brazil',         shortName: 'Brazil',  tla: 'BRA', flag: '🇧🇷', w: 3, d: 0, l: 0, pts: 9, gf: 7, ga: 1 },
    { id: 9010, name: 'Germany',        shortName: 'Germany', tla: 'GER', flag: '🇩🇪', w: 1, d: 1, l: 1, pts: 4, gf: 4, ga: 4 },
    { id: 9011, name: 'Japan',          shortName: 'Japan',   tla: 'JPN', flag: '🇯🇵', w: 1, d: 1, l: 1, pts: 4, gf: 3, ga: 3 },
    { id: 9012, name: 'South Africa',   shortName: 'S. Africa',tla:'RSA', flag: '🇿🇦', w: 0, d: 0, l: 3, pts: 0, gf: 0, ga: 6 },
  ]},
  { name: 'Group C', teams: [
    { id: 9013, name: 'Argentina',      shortName: 'Argentina',tla:'ARG', flag: '🇦🇷', w: 2, d: 1, l: 0, pts: 7, gf: 6, ga: 2 },
    { id: 9014, name: 'France',         shortName: 'France',  tla: 'FRA', flag: '🇫🇷', w: 2, d: 0, l: 1, pts: 6, gf: 5, ga: 3 },
    { id: 9015, name: 'Poland',         shortName: 'Poland',  tla: 'POL', flag: '🇵🇱', w: 1, d: 0, l: 2, pts: 3, gf: 3, ga: 5 },
    { id: 9016, name: 'Saudi Arabia',   shortName: 'S. Arabia',tla:'KSA', flag: '🇸🇦', w: 0, d: 1, l: 2, pts: 1, gf: 1, ga: 5 },
  ]},
  { name: 'Group D', teams: [
    { id: 9017, name: 'England',        shortName: 'England', tla: 'ENG', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', w: 2, d: 1, l: 0, pts: 7, gf: 8, ga: 2 },
    { id: 9018, name: 'Portugal',       shortName: 'Portugal',tla: 'POR', flag: '🇵🇹', w: 2, d: 0, l: 1, pts: 6, gf: 5, ga: 3 },
    { id: 9019, name: 'Iran',           shortName: 'Iran',    tla: 'IRN', flag: '🇮🇷', w: 1, d: 0, l: 2, pts: 3, gf: 2, ga: 6 },
    { id: 9020, name: 'New Zealand',    shortName: 'N. Zealand',tla:'NZL',flag: '🇳🇿', w: 0, d: 1, l: 2, pts: 1, gf: 1, ga: 5 },
  ]},
  { name: 'Group E', teams: [
    { id: 9021, name: 'Spain',          shortName: 'Spain',   tla: 'ESP', flag: '🇪🇸', w: 3, d: 0, l: 0, pts: 9, gf: 8, ga: 1 },
    { id: 9022, name: 'Netherlands',    shortName: 'Netherlands',tla:'NED',flag:'🇳🇱', w: 1, d: 1, l: 1, pts: 4, gf: 4, ga: 4 },
    { id: 9023, name: 'Turkey',         shortName: 'Turkey',  tla: 'TUR', flag: '🇹🇷', w: 1, d: 1, l: 1, pts: 4, gf: 3, ga: 3 },
    { id: 9024, name: 'Ivory Coast',    shortName: 'Ivory Coast',tla:'CIV',flag:'🇨🇮', w: 0, d: 0, l: 3, pts: 0, gf: 1, ga: 8 },
  ]},
  { name: 'Group F', teams: [
    { id: 9025, name: 'Morocco',        shortName: 'Morocco', tla: 'MAR', flag: '🇲🇦', w: 2, d: 1, l: 0, pts: 7, gf: 5, ga: 1 },
    { id: 9026, name: 'Colombia',       shortName: 'Colombia',tla: 'COL', flag: '🇨🇴', w: 1, d: 1, l: 1, pts: 4, gf: 3, ga: 3 },
    { id: 9027, name: 'Belgium',        shortName: 'Belgium', tla: 'BEL', flag: '🇧🇪', w: 1, d: 1, l: 1, pts: 4, gf: 3, ga: 3 },
    { id: 9028, name: 'Croatia',        shortName: 'Croatia', tla: 'CRO', flag: '🇭🇷', w: 0, d: 1, l: 2, pts: 1, gf: 1, ga: 5 },
  ]},
  { name: 'Group G', teams: [
    { id: 9029, name: 'Italy',          shortName: 'Italy',   tla: 'ITA', flag: '🇮🇹', w: 2, d: 0, l: 1, pts: 6, gf: 5, ga: 4 },
    { id: 9030, name: 'Uruguay',        shortName: 'Uruguay', tla: 'URU', flag: '🇺🇾', w: 2, d: 0, l: 1, pts: 6, gf: 6, ga: 4 },
    { id: 9031, name: 'Ecuador',        shortName: 'Ecuador', tla: 'ECU', flag: '🇪🇨', w: 1, d: 1, l: 1, pts: 4, gf: 3, ga: 3 },
    { id: 9032, name: 'Qatar',          shortName: 'Qatar',   tla: 'QAT', flag: '🇶🇦', w: 0, d: 1, l: 2, pts: 1, gf: 2, ga: 5 },
  ]},
  { name: 'Group H', teams: [
    { id: 9033, name: 'South Korea',    shortName: 'South Korea',tla:'KOR',flag:'🇰🇷', w: 2, d: 0, l: 1, pts: 6, gf: 4, ga: 3 },
    { id: 9034, name: 'Australia',      shortName: 'Australia',tla:'AUS', flag: '🇦🇺', w: 1, d: 1, l: 1, pts: 4, gf: 3, ga: 3 },
    { id: 9035, name: 'Switzerland',    shortName: 'Switzerland',tla:'SUI',flag:'🇨🇭', w: 1, d: 1, l: 1, pts: 4, gf: 2, ga: 2 },
    { id: 9036, name: 'Cameroon',       shortName: 'Cameroon',tla: 'CMR', flag: '🇨🇲', w: 0, d: 2, l: 1, pts: 2, gf: 2, ga: 3 },
  ]},
  { name: 'Group I', teams: [
    { id: 9037, name: 'Portugal',       shortName: 'Portugal',tla: 'POR', flag: '🇵🇹', w: 2, d: 1, l: 0, pts: 7, gf: 6, ga: 2 },
    { id: 9038, name: 'Denmark',        shortName: 'Denmark', tla: 'DEN', flag: '🇩🇰', w: 1, d: 1, l: 1, pts: 4, gf: 3, ga: 3 },
    { id: 9039, name: 'Nigeria',        shortName: 'Nigeria', tla: 'NGA', flag: '🇳🇬', w: 1, d: 0, l: 2, pts: 3, gf: 2, ga: 4 },
    { id: 9040, name: 'Indonesia',      shortName: 'Indonesia',tla:'IDN', flag: '🇮🇩', w: 0, d: 2, l: 1, pts: 2, gf: 2, ga: 4 },
  ]},
  { name: 'Group J', teams: [
    { id: 9041, name: 'Chile',          shortName: 'Chile',   tla: 'CHI', flag: '🇨🇱', w: 2, d: 0, l: 1, pts: 6, gf: 4, ga: 3 },
    { id: 9042, name: 'Czech Republic', shortName: 'Czechia', tla: 'CZE', flag: '🇨🇿', w: 1, d: 2, l: 0, pts: 5, gf: 3, ga: 2 },
    { id: 9043, name: 'Senegal',        shortName: 'Senegal', tla: 'SEN', flag: '🇸🇳', w: 1, d: 1, l: 1, pts: 4, gf: 3, ga: 3 },
    { id: 9044, name: 'Venezuela',      shortName: 'Venezuela',tla:'VEN', flag: '🇻🇪', w: 0, d: 1, l: 2, pts: 1, gf: 2, ga: 4 },
  ]},
  { name: 'Group K', teams: [
    { id: 9045, name: 'Mexico',         shortName: 'Mexico',  tla: 'MEX', flag: '🇲🇽', w: 2, d: 1, l: 0, pts: 7, gf: 5, ga: 2 },
    { id: 9046, name: 'Ukraine',        shortName: 'Ukraine', tla: 'UKR', flag: '🇺🇦', w: 1, d: 1, l: 1, pts: 4, gf: 3, ga: 3 },
    { id: 9047, name: 'Egypt',          shortName: 'Egypt',   tla: 'EGY', flag: '🇪🇬', w: 1, d: 0, l: 2, pts: 3, gf: 2, ga: 4 },
    { id: 9048, name: 'Panama',         shortName: 'Panama',  tla: 'PAN', flag: '🇵🇦', w: 0, d: 2, l: 1, pts: 2, gf: 2, ga: 3 },
  ]},
  { name: 'Group L', teams: [
    { id: 9049, name: 'Algeria',        shortName: 'Algeria', tla: 'ALG', flag: '🇩🇿', w: 2, d: 0, l: 1, pts: 6, gf: 4, ga: 3 },
    { id: 9050, name: 'Peru',           shortName: 'Peru',    tla: 'PER', flag: '🇵🇪', w: 1, d: 1, l: 1, pts: 4, gf: 2, ga: 2 },
    { id: 9051, name: 'Ireland',        shortName: 'Ireland', tla: 'IRL', flag: '🇮🇪', w: 1, d: 1, l: 1, pts: 4, gf: 3, ga: 3 },
    { id: 9052, name: 'Costa Rica',     shortName: 'Costa Rica',tla:'CRC',flag:'🇨🇷', w: 0, d: 2, l: 1, pts: 2, gf: 1, ga: 2 },
  ]},
]

export const CL_KNOCKOUT_2025: KnockoutRound[] = [
  {
    name: 'Round of 16',
    shortName: 'R16',
    ties: [
      { id: 1,  home: { name: 'Real Madrid',      shortName: 'Real Madrid', crest: 'https://crests.football-data.org/86.png'  }, away: { name: 'Atlético Madrid',    shortName: 'Atlético',  crest: 'https://crests.football-data.org/77.png'  }, homeLeg1: 2, awayLeg1: 1, homeLeg2: 1, awayLeg2: 2, status: 'DONE', winner: 'home' },
      { id: 2,  home: { name: 'Arsenal',           shortName: 'Arsenal',    crest: 'https://crests.football-data.org/57.png'  }, away: { name: 'Sporting CP',         shortName: 'Sporting',  crest: 'https://crests.football-data.org/498.png' }, homeLeg1: 3, awayLeg1: 1, homeLeg2: 1, awayLeg2: 0, status: 'DONE', winner: 'home' },
      { id: 3,  home: { name: 'Bayern Munich',     shortName: 'Bayern',     crest: 'https://crests.football-data.org/5.png'   }, away: { name: 'Celtic',              shortName: 'Celtic',    crest: 'https://crests.football-data.org/732.png' }, homeLeg1: 3, awayLeg1: 0, homeLeg2: 2, awayLeg2: 1, status: 'DONE', winner: 'home' },
      { id: 4,  home: { name: 'Liverpool',         shortName: 'Liverpool',  crest: 'https://crests.football-data.org/64.png'  }, away: { name: 'PSV Eindhoven',        shortName: 'PSV',       crest: 'https://crests.football-data.org/674.png' }, homeLeg1: 2, awayLeg1: 0, homeLeg2: 2, awayLeg2: 0, status: 'DONE', winner: 'home' },
      { id: 5,  home: { name: 'FC Barcelona',      shortName: 'Barcelona',  crest: 'https://crests.football-data.org/81.png'  }, away: { name: 'Benfica',             shortName: 'Benfica',   crest: 'https://crests.football-data.org/503.png' }, homeLeg1: 2, awayLeg1: 1, homeLeg2: 1, awayLeg2: 0, status: 'DONE', winner: 'home' },
      { id: 6,  home: { name: 'Inter Milan',       shortName: 'Inter',      crest: 'https://crests.football-data.org/98.png'  }, away: { name: 'Feyenoord',           shortName: 'Feyenoord', crest: 'https://crests.football-data.org/675.png' }, homeLeg1: 2, awayLeg1: 0, homeLeg2: 1, awayLeg2: 0, status: 'DONE', winner: 'home' },
      { id: 7,  home: { name: 'Borussia Dortmund', shortName: 'Dortmund',   crest: 'https://crests.football-data.org/4.png'   }, away: { name: 'Stade Brestois',      shortName: 'Brest',     crest: 'https://crests.football-data.org/514.png' }, homeLeg1: 2, awayLeg1: 0, homeLeg2: 0, awayLeg2: 0, status: 'DONE', winner: 'home' },
      { id: 8,  home: { name: 'Aston Villa',       shortName: 'Aston Villa',crest: 'https://crests.football-data.org/397.png' }, away: { name: 'Club Brugge',         shortName: 'Brugge',    crest: 'https://crests.football-data.org/851.png' }, homeLeg1: 3, awayLeg1: 1, homeLeg2: 2, awayLeg2: 0, status: 'DONE', winner: 'home' },
    ],
  },
  {
    name: 'Quarter-Finals',
    shortName: 'QF',
    ties: [
      { id: 9,  home: { name: 'Real Madrid',      shortName: 'Real Madrid', crest: 'https://crests.football-data.org/86.png' }, away: { name: 'Arsenal',      shortName: 'Arsenal',    crest: 'https://crests.football-data.org/57.png' }, homeLeg1: 3, awayLeg1: 2, homeLeg2: null, awayLeg2: null, status: 'IN_PROGRESS' },
      { id: 10, home: { name: 'Bayern Munich',    shortName: 'Bayern',      crest: 'https://crests.football-data.org/5.png'  }, away: { name: 'FC Barcelona',  shortName: 'Barcelona',  crest: 'https://crests.football-data.org/81.png' }, homeLeg1: 1, awayLeg1: 1, homeLeg2: null, awayLeg2: null, status: 'IN_PROGRESS' },
      { id: 11, home: { name: 'Liverpool',        shortName: 'Liverpool',   crest: 'https://crests.football-data.org/64.png' }, away: { name: 'Inter Milan',   shortName: 'Inter',      crest: 'https://crests.football-data.org/98.png' }, homeLeg1: 2, awayLeg1: 1, homeLeg2: null, awayLeg2: null, status: 'IN_PROGRESS' },
      { id: 12, home: { name: 'Aston Villa',      shortName: 'Aston Villa', crest: 'https://crests.football-data.org/397.png'},  away: { name: 'Borussia Dortmund', shortName: 'Dortmund', crest: 'https://crests.football-data.org/4.png' }, homeLeg1: null, awayLeg1: null, homeLeg2: null, awayLeg2: null, status: 'UPCOMING' },
    ],
  },
  {
    name: 'Semi-Finals',
    shortName: 'SF',
    ties: [
      { id: 13, home: { name: 'TBD', shortName: 'TBD', crest: '' }, away: { name: 'TBD', shortName: 'TBD', crest: '' }, homeLeg1: null, awayLeg1: null, homeLeg2: null, awayLeg2: null, status: 'UPCOMING' },
      { id: 14, home: { name: 'TBD', shortName: 'TBD', crest: '' }, away: { name: 'TBD', shortName: 'TBD', crest: '' }, homeLeg1: null, awayLeg1: null, homeLeg2: null, awayLeg2: null, status: 'UPCOMING' },
    ],
  },
  {
    name: 'Final',
    shortName: 'F',
    ties: [
      { id: 15, home: { name: 'TBD', shortName: 'TBD', crest: '' }, away: { name: 'TBD', shortName: 'TBD', crest: '' }, homeLeg1: null, awayLeg1: null, homeLeg2: null, awayLeg2: null, status: 'UPCOMING' },
    ],
  },
]

export interface NewsItem {
  id: number
  title: string
  summary: string
  image: string
  tag: string
  time: string
  hot: boolean
  link?: string
}

// Fallback if RSS fetch fails
const FALLBACK_NEWS: NewsItem[] = [
  { id: 1, title: "Premier League Title Race Heats Up With 4 Games Left! 🔥", summary: "With just four games remaining in the 2025/26 season, three clubs are still fighting for the title.", image: "🏆", tag: "Premier League", time: "Recently", hot: true },
  { id: 2, title: "Lamine Yamal Scores Worldie in El Clásico!", summary: "Barcelona's teenage superstar curled in a stunning long-range effort to seal a famous victory over Real Madrid.", image: "⚽", tag: "La Liga", time: "Recently", hot: true },
  { id: 3, title: "Champions League Semi-Finals: Who Will Make the Final?", summary: "The last four teams are battling it out — the ties couldn't be tighter!", image: "🏆", tag: "Champions League", time: "Recently", hot: false },
  { id: 4, title: "Euro 2026: The Big Nations Book Their Tickets", summary: "England, France and Spain all through — but there were some shock results along the way.", image: "🌍", tag: "International", time: "Recently", hot: false },
  { id: 5, title: "Bundesliga Title Race Goes to the Wire", summary: "Three clubs separated by just two points heading into the final weekend of the season.", image: "🇩🇪", tag: "Bundesliga", time: "Recently", hot: false },
  { id: 6, title: "Wonderkid Watch: Best Under-18 Players This Season", summary: "From Lamine Yamal to the next big thing from Brazil — these teenagers are taking football by storm.", image: "⭐", tag: "Rising Stars", time: "Recently", hot: false },
]

function rssRelativeTime(dateStr: string): string {
  const date = new Date(dateStr)
  if (isNaN(date.getTime())) return 'Recently'
  const mins = Math.round((Date.now() - date.getTime()) / 60000)
  if (mins < 60) return `${mins}m ago`
  const hours = Math.round(mins / 60)
  if (hours < 24) return `${hours}h ago`
  return `${Math.round(hours / 24)}d ago`
}

function rssTag(title: string): string {
  const t = title.toLowerCase()
  if (t.includes('premier league') || t.includes('arsenal') || t.includes('chelsea') || t.includes('liverpool') || t.includes('man city') || t.includes('manchester') || t.includes('spurs') || t.includes('tottenham') || t.includes('newcastle') || t.includes('aston villa')) return 'Premier League'
  if (t.includes('champions league') || t.includes('ucl')) return 'Champions League'
  if (t.includes('europa league') || t.includes('conference league')) return 'Europe'
  if (t.includes('la liga') || t.includes('barcelona') || t.includes('real madrid') || t.includes('atletico') || t.includes('sevilla')) return 'La Liga'
  if (t.includes('bundesliga') || t.includes('bayern') || t.includes('dortmund') || t.includes('leverkusen')) return 'Bundesliga'
  if (t.includes('serie a') || t.includes('juventus') || t.includes('inter') || t.includes('milan') || t.includes('napoli') || t.includes('roma')) return 'Serie A'
  if (t.includes('ligue 1') || t.includes('psg') || t.includes('paris saint-germain')) return 'Ligue 1'
  if (t.includes('world cup') || t.includes('euro 2026') || t.includes('nations league') || t.includes('england') || t.includes('france') || t.includes('brazil') || t.includes('international')) return 'International'
  if (t.includes('transfer') || t.includes('sign') || t.includes(' deal') || t.includes('joins') || t.includes('move')) return 'Transfers'
  return 'Football'
}

function rssEmoji(tag: string): string {
  const m: Record<string, string> = { 'Premier League': '🏴󠁧󠁢󠁥󠁮󠁧󠁿', 'Champions League': '🏆', 'Europe': '🇪🇺', 'La Liga': '🇪🇸', 'Bundesliga': '🇩🇪', 'Serie A': '🇮🇹', 'Ligue 1': '🇫🇷', 'International': '🌍', 'Transfers': '✍️' }
  return m[tag] || '⚽'
}

function parseRssItem(item: string, idx: number): NewsItem {
  const get = (tag: string) => {
    const cdata = item.match(new RegExp(`<${tag}[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]>\\s*<\\/${tag}>`, 'i'))
    if (cdata) return cdata[1].trim()
    const plain = item.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'i'))
    return plain ? plain[1].replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&#\d+;/g, '').trim() : ''
  }
  const title = get('title') || 'Football News'
  const summary = (get('description') || title).slice(0, 240)
  const pubDate = get('pubDate')
  const link = get('guid') || get('link') || ''
  const tag = rssTag(title)
  return { id: idx + 1, title, summary, image: rssEmoji(tag), tag, time: rssRelativeTime(pubDate), hot: idx < 2, link }
}

export async function getFootballNews(): Promise<NewsItem[]> {
  try {
    const res = await fetch('https://feeds.bbci.co.uk/sport/football/rss.xml', {
      next: { revalidate: 600 },
      headers: { 'User-Agent': 'mykickzone/1.0 (kids football news site)' },
    })
    if (!res.ok) return FALLBACK_NEWS
    const xml = await res.text()
    const items = xml.match(/<item>([\s\S]*?)<\/item>/g) || []
    const parsed = items.slice(0, 6).map((item, i) => parseRssItem(item, i))
    return parsed.length >= 4 ? parsed : FALLBACK_NEWS
  } catch {
    return FALLBACK_NEWS
  }
}
