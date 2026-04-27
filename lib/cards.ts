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
  // ── Series 2 ──
  { id: 17, name: 'Jamal Musiala',      shortName: 'MUSIALA',    position: 'CAM', nationality: '🇩🇪', team: 'Bayern',      teamId: 5,  rating: 88, tier: 'RARE_GOLD', pac: 82, sho: 80, pas: 82, dri: 91, def: 55, phy: 65, wikiName: 'Jamal_Musiala' },
  { id: 18, name: 'Trent Alexander-Arnold', shortName: 'T.A-A',  position: 'RB',  nationality: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', team: 'Real Madrid', teamId: 86, rating: 87, tier: 'RARE_GOLD', pac: 80, sho: 70, pas: 91, dri: 80, def: 72, phy: 68, wikiName: 'Trent_Alexander-Arnold' },
  { id: 19, name: 'Virgil van Dijk',     shortName: 'VAN DIJK',  position: 'CB',  nationality: '🇳🇱', team: 'Liverpool',   teamId: 64, rating: 88, tier: 'RARE_GOLD', pac: 78, sho: 62, pas: 74, dri: 72, def: 91, phy: 90, wikiName: 'Virgil_van_Dijk' },
  { id: 20, name: 'Antoine Griezmann',   shortName: 'GRIEZMANN', position: 'CF',  nationality: '🇫🇷', team: 'Atlético',    teamId: 77, rating: 87, tier: 'RARE_GOLD', pac: 76, sho: 85, pas: 82, dri: 84, def: 48, phy: 72, wikiName: 'Antoine_Griezmann' },
  { id: 21, name: 'Alisson Becker',      shortName: 'ALISSON',   position: 'GK',  nationality: '🇧🇷', team: 'Liverpool',   teamId: 64, rating: 91, tier: 'TOTY',      pac: 64, sho: 20, pas: 68, dri: 60, def: 15, phy: 80, wikiName: 'Alisson_Becker' },
  { id: 22, name: 'Manuel Neuer',        shortName: 'NEUER',     position: 'GK',  nationality: '🇩🇪', team: 'Bayern',      teamId: 5,  rating: 88, tier: 'RARE_GOLD', pac: 58, sho: 18, pas: 64, dri: 56, def: 12, phy: 78, wikiName: 'Manuel_Neuer' },
  { id: 23, name: 'Bernardo Silva',      shortName: 'B. SILVA',  position: 'CM',  nationality: '🇵🇹', team: 'Man City',    teamId: 65, rating: 88, tier: 'RARE_GOLD', pac: 80, sho: 78, pas: 88, dri: 90, def: 62, phy: 68, wikiName: 'Bernardo_Silva' },
  { id: 24, name: 'Bruno Fernandes',     shortName: 'FERNANDES', position: 'CAM', nationality: '🇵🇹', team: 'Man United',  teamId: 66, rating: 87, tier: 'RARE_GOLD', pac: 72, sho: 82, pas: 88, dri: 84, def: 58, phy: 72, wikiName: 'Bruno_Fernandes_(footballer,_born_1994)' },
  { id: 25, name: 'Heung-min Son',       shortName: 'SON',       position: 'LW',  nationality: '🇰🇷', team: 'Tottenham',   teamId: 73, rating: 87, tier: 'RARE_GOLD', pac: 88, sho: 85, pas: 78, dri: 86, def: 40, phy: 68, wikiName: 'Son_Heung-min' },
  { id: 26, name: 'Marcus Rashford',     shortName: 'RASHFORD',  position: 'LW',  nationality: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', team: 'Man United',  teamId: 66, rating: 84, tier: 'SILVER',    pac: 92, sho: 80, pas: 72, dri: 84, def: 38, phy: 74, wikiName: 'Marcus_Rashford' },
  { id: 27, name: 'Raphinha',            shortName: 'RAPHINHA',  position: 'RW',  nationality: '🇧🇷', team: 'Barcelona',   teamId: 81, rating: 85, tier: 'SILVER',    pac: 86, sho: 80, pas: 78, dri: 87, def: 36, phy: 68, wikiName: 'Raphinha_(footballer)' },
  { id: 28, name: 'Kevin De Bruyne',     shortName: 'DE BRUYNE', position: 'CM',  nationality: '🇧🇪', team: 'Man City',    teamId: 65, rating: 91, tier: 'TOTY',      pac: 76, sho: 86, pas: 94, dri: 88, def: 60, phy: 78, wikiName: 'Kevin_De_Bruyne' },
  { id: 29, name: 'Robert Lewandowski',  shortName: 'LEWANDOWSKI',position: 'ST', nationality: '🇵🇱', team: 'Barcelona',   teamId: 81, rating: 89, tier: 'RARE_GOLD', pac: 76, sho: 92, pas: 79, dri: 82, def: 42, phy: 80, wikiName: 'Robert_Lewandowski' },
  { id: 30, name: 'Neymar Jr.',          shortName: 'NEYMAR',    position: 'LW',  nationality: '🇧🇷', team: 'Al-Hilal',    teamId: 0,  rating: 86, tier: 'RARE_GOLD', pac: 86, sho: 83, pas: 86, dri: 94, def: 28, phy: 58, wikiName: 'Neymar' },
  { id: 31, name: 'Rúben Dias',          shortName: 'R. DIAS',   position: 'CB',  nationality: '🇵🇹', team: 'Man City',    teamId: 65, rating: 89, tier: 'RARE_GOLD', pac: 76, sho: 55, pas: 72, dri: 68, def: 91, phy: 86, wikiName: 'Rúben_Dias' },
  { id: 32, name: 'Federico Valverde',   shortName: 'VALVERDE',  position: 'CM',  nationality: '🇺🇾', team: 'Real Madrid', teamId: 86, rating: 88, tier: 'RARE_GOLD', pac: 86, sho: 78, pas: 82, dri: 84, def: 72, phy: 82, wikiName: 'Federico_Valverde' },
  { id: 33, name: 'Erling Haaland TOTY', shortName: 'HAALAND 🌟',position: 'ST', nationality: '🇳🇴', team: 'Man City',    teamId: 65, rating: 95, tier: 'TOTY',      pac: 93, sho: 97, pas: 68, dri: 84, def: 48, phy: 92, wikiName: 'Erling_Haaland' },
  { id: 34, name: 'Cody Gakpo',          shortName: 'GAKPO',     position: 'LW',  nationality: '🇳🇱', team: 'Liverpool',   teamId: 64, rating: 84, tier: 'SILVER',    pac: 86, sho: 80, pas: 74, dri: 84, def: 40, phy: 72, wikiName: 'Cody_Gakpo' },
  { id: 35, name: 'Dani Carvajal',       shortName: 'CARVAJAL',  position: 'RB',  nationality: '🇪🇸', team: 'Real Madrid', teamId: 86, rating: 87, tier: 'RARE_GOLD', pac: 78, sho: 60, pas: 80, dri: 78, def: 88, phy: 74, wikiName: 'Dani_Carvajal' },
  { id: 36, name: 'Ilkay Gündogan',      shortName: 'GÜNDOGAN',  position: 'CM',  nationality: '🇩🇪', team: 'Barcelona',   teamId: 81, rating: 86, tier: 'SILVER',    pac: 68, sho: 78, pas: 88, dri: 84, def: 70, phy: 72, wikiName: 'İlkay_Gündoğan' },
  { id: 37, name: 'Victor Osimhen',      shortName: 'OSIMHEN',   position: 'ST',  nationality: '🇳🇬', team: 'Galatasaray', teamId: 0,  rating: 87, tier: 'RARE_GOLD', pac: 90, sho: 88, pas: 64, dri: 80, def: 36, phy: 84, wikiName: 'Victor_Osimhen' },
  { id: 38, name: 'Achraf Hakimi',       shortName: 'HAKIMI',    position: 'RB',  nationality: '🇲🇦', team: 'PSG',         teamId: 524,rating: 87, tier: 'RARE_GOLD', pac: 92, sho: 68, pas: 78, dri: 82, def: 78, phy: 74, wikiName: 'Achraf_Hakimi' },
  { id: 39, name: 'Joshua Kimmich',      shortName: 'KIMMICH',   position: 'CM',  nationality: '🇩🇪', team: 'Bayern',      teamId: 5,  rating: 89, tier: 'RARE_GOLD', pac: 72, sho: 72, pas: 90, dri: 82, def: 86, phy: 78, wikiName: 'Joshua_Kimmich' },
  { id: 40, name: 'Karim Benzema ICON',  shortName: 'BENZEMA',   position: 'ST',  nationality: '🇫🇷', team: 'Al-Ittihad',  teamId: 0,  rating: 93, tier: 'ICON',      pac: 76, sho: 90, pas: 84, dri: 88, def: 38, phy: 78, wikiName: 'Karim_Benzema' },
  { id: 41, name: 'Luka Modrić ICON',    shortName: 'MODRIĆ',    position: 'CM',  nationality: '🇭🇷', team: 'Real Madrid', teamId: 86, rating: 92, tier: 'ICON',      pac: 72, sho: 76, pas: 92, dri: 90, def: 72, phy: 68, wikiName: 'Luka_Modrić' },
  { id: 42, name: 'Zlatan Ibrahimović',  shortName: 'IBRAHIMOVIĆ',position: 'ST', nationality: '🇸🇪', team: 'Retired',     teamId: 0,  rating: 90, tier: 'ICON',      pac: 78, sho: 92, pas: 78, dri: 88, def: 36, phy: 84, wikiName: 'Zlatan_Ibrahimović' },
  { id: 43, name: 'Thierry Henry ICON',  shortName: 'T. HENRY',  position: 'LW',  nationality: '🇫🇷', team: 'Arsenal',     teamId: 57, rating: 93, tier: 'ICON',      pac: 95, sho: 91, pas: 84, dri: 92, def: 38, phy: 80, wikiName: 'Thierry_Henry' },
  { id: 44, name: 'Ronaldinho ICON',     shortName: 'RONALDINHO',position: 'CAM', nationality: '🇧🇷', team: 'Barcelona',   teamId: 81, rating: 95, tier: 'ICON',      pac: 86, sho: 88, pas: 90, dri: 97, def: 30, phy: 68, wikiName: 'Ronaldinho' },
  { id: 45, name: 'Eden Hazard',         shortName: 'HAZARD',    position: 'LW',  nationality: '🇧🇪', team: 'Retired',     teamId: 0,  rating: 88, tier: 'RARE_GOLD', pac: 84, sho: 84, pas: 82, dri: 93, def: 36, phy: 68, wikiName: 'Eden_Hazard' },
  { id: 46, name: 'Raheem Sterling',     shortName: 'STERLING',  position: 'LW',  nationality: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', team: 'Arsenal',     teamId: 57, rating: 84, tier: 'SILVER',    pac: 90, sho: 80, pas: 74, dri: 86, def: 38, phy: 68, wikiName: 'Raheem_Sterling' },
  { id: 47, name: 'Kylian Mbappé ICON',  shortName: 'MBAPPÉ 🌟', position: 'ST',  nationality: '🇫🇷', team: 'Real Madrid', teamId: 86, rating: 96, tier: 'ICON',      pac: 99, sho: 94, pas: 84, dri: 96, def: 38, phy: 78, wikiName: 'Kylian_Mbapp%C3%A9' },
  { id: 48, name: 'Pedri TOTS',          shortName: 'PEDRI 🌟',  position: 'CM',  nationality: '🇪🇸', team: 'Barcelona',   teamId: 81, rating: 91, tier: 'TOTS',      pac: 82, sho: 80, pas: 92, dri: 94, def: 76, phy: 68, wikiName: 'Pedri' },
  { id: 49, name: 'Alexia Putellas',     shortName: 'PUTELLAS',  position: 'CM',  nationality: '🇪🇸', team: 'Barcelona W', teamId: 0,  rating: 92, tier: 'ICON',      pac: 78, sho: 84, pas: 92, dri: 90, def: 72, phy: 68, wikiName: 'Alexia_Putellas' },
  { id: 50, name: 'Sam Kerr',            shortName: 'KERR',      position: 'ST',  nationality: '🇦🇺', team: 'Chelsea W',   teamId: 0,  rating: 90, tier: 'RARE_GOLD', pac: 82, sho: 90, pas: 72, dri: 82, def: 36, phy: 78, wikiName: 'Sam_Kerr' },
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
