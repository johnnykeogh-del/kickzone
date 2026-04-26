export type Tier = 'ICON' | 'TOTY' | 'TOTS' | 'RARE_GOLD' | 'SILVER' | 'BRONZE'

export interface Card {
  id: number
  name: string
  shortName: string
  position: string
  nationality: string
  team: string
  teamId: number
  rating: number
  tier: Tier
  pac: number
  sho: number
  pas: number
  dri: number
  def: number
  phy: number
  wikiName: string
}

export const CARDS: Card[] = [
  { id: 1,  name: 'Erling Haaland',    shortName: 'HAALAND',    position: 'ST',  nationality: '🇳🇴', team: 'Man City',    teamId: 65, rating: 91, tier: 'RARE_GOLD', pac: 89, sho: 93, pas: 65, dri: 80, def: 45, phy: 88, wikiName: 'Erling_Haaland' },
  { id: 2,  name: 'Kylian Mbappé',     shortName: 'MBAPPÉ',     position: 'ST',  nationality: '🇫🇷', team: 'Real Madrid', teamId: 86, rating: 92, tier: 'RARE_GOLD', pac: 97, sho: 91, pas: 81, dri: 93, def: 36, phy: 76, wikiName: 'Kylian_Mbapp%C3%A9' },
  { id: 3,  name: 'Vinicius Jr.',       shortName: 'VINÍCIUS',   position: 'LW',  nationality: '🇧🇷', team: 'Real Madrid', teamId: 86, rating: 91, tier: 'RARE_GOLD', pac: 95, sho: 85, pas: 78, dri: 93, def: 30, phy: 68, wikiName: 'Vinicius_Junior' },
  { id: 4,  name: 'Bukayo Saka',        shortName: 'SAKA',       position: 'RW',  nationality: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', team: 'Arsenal',     teamId: 57, rating: 89, tier: 'RARE_GOLD', pac: 88, sho: 83, pas: 85, dri: 88, def: 62, phy: 68, wikiName: 'Bukayo_Saka' },
  { id: 5,  name: 'Jude Bellingham',   shortName: 'BELLINGHAM',  position: 'CM',  nationality: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', team: 'Real Madrid', teamId: 86, rating: 91, tier: 'TOTY',      pac: 83, sho: 82, pas: 85, dri: 90, def: 71, phy: 82, wikiName: 'Jude_Bellingham' },
  { id: 6,  name: 'Rodri',             shortName: 'RODRI',       position: 'CDM', nationality: '🇪🇸', team: 'Man City',    teamId: 65, rating: 92, tier: 'TOTY',      pac: 72, sho: 75, pas: 89, dri: 85, def: 92, phy: 86, wikiName: 'Rodri_(footballer,_born_1996)' },
  { id: 7,  name: 'Phil Foden',        shortName: 'FODEN',       position: 'CAM', nationality: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', team: 'Man City',    teamId: 65, rating: 88, tier: 'RARE_GOLD', pac: 82, sho: 85, pas: 85, dri: 90, def: 53, phy: 62, wikiName: 'Phil_Foden' },
  { id: 8,  name: 'Lamine Yamal',      shortName: 'YAMAL',       position: 'RW',  nationality: '🇪🇸', team: 'Barcelona',   teamId: 81, rating: 87, tier: 'TOTS',      pac: 90, sho: 80, pas: 82, dri: 92, def: 38, phy: 58, wikiName: 'Lamine_Yamal' },
  { id: 9,  name: 'Mohamed Salah',     shortName: 'SALAH',       position: 'RW',  nationality: '🇪🇬', team: 'Liverpool',   teamId: 64, rating: 89, tier: 'RARE_GOLD', pac: 91, sho: 88, pas: 80, dri: 88, def: 48, phy: 75, wikiName: 'Mohamed_Salah' },
  { id: 10, name: 'Harry Kane',        shortName: 'KANE',        position: 'ST',  nationality: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', team: 'Bayern',      teamId: 5,  rating: 89, tier: 'RARE_GOLD', pac: 72, sho: 94, pas: 83, dri: 82, def: 42, phy: 80, wikiName: 'Harry_Kane' },
  { id: 11, name: 'Pedri',             shortName: 'PEDRI',       position: 'CM',  nationality: '🇪🇸', team: 'Barcelona',   teamId: 81, rating: 87, tier: 'RARE_GOLD', pac: 76, sho: 76, pas: 88, dri: 90, def: 72, phy: 65, wikiName: 'Pedri' },
  { id: 12, name: 'Florian Wirtz',     shortName: 'WIRTZ',       position: 'CAM', nationality: '🇩🇪', team: 'Leverkusen',  teamId: 3,  rating: 88, tier: 'TOTS',      pac: 78, sho: 84, pas: 86, dri: 90, def: 58, phy: 66, wikiName: 'Florian_Wirtz' },
  { id: 13, name: 'Lionel Messi',      shortName: 'MESSI',       position: 'RW',  nationality: '🇦🇷', team: 'Inter Miami', teamId: 86, rating: 90, tier: 'ICON',      pac: 68, sho: 90, pas: 92, dri: 95, def: 32, phy: 62, wikiName: 'Lionel_Messi' },
  { id: 14, name: 'Cristiano Ronaldo', shortName: 'RONALDO',     position: 'ST',  nationality: '🇵🇹', team: 'Al Nassr',    teamId: 86, rating: 88, tier: 'ICON',      pac: 80, sho: 93, pas: 74, dri: 85, def: 28, phy: 79, wikiName: 'Cristiano_Ronaldo' },
  { id: 15, name: 'Gavi',              shortName: 'GAVI',        position: 'CM',  nationality: '🇪🇸', team: 'Barcelona',   teamId: 81, rating: 85, tier: 'SILVER',    pac: 75, sho: 72, pas: 84, dri: 86, def: 74, phy: 68, wikiName: 'Gavi_(footballer)' },
  { id: 16, name: 'Vinicius Jr. ICON', shortName: 'VINÍ ICON',   position: 'LW',  nationality: '🇧🇷', team: 'Real Madrid', teamId: 86, rating: 96, tier: 'ICON',      pac: 98, sho: 90, pas: 85, dri: 97, def: 35, phy: 72, wikiName: 'Vinicius_Junior' },
]

export const STAT_LABELS: Record<string, string> = {
  pac: '⚡ PACE',
  sho: '⚽ SHOOT',
  pas: '🎯 PASS',
  dri: '🪄 DRIBBLE',
  def: '🛡 DEFEND',
  phy: '💪 PHYSICAL',
}

export function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export function dealCards(): { p1: number[]; p2: number[] } {
  const shuffled = shuffle(CARDS.map(c => c.id))
  const mid = Math.floor(shuffled.length / 2)
  return { p1: shuffled.slice(0, mid), p2: shuffled.slice(mid) }
}

export function getCard(id: number): Card {
  return CARDS.find(c => c.id === id)!
}
