'use client'

import { useState } from 'react'
import SafeImage from '@/components/SafeImage'

type Tier = 'ICON' | 'TOTY' | 'TOTS' | 'RARE_GOLD' | 'SILVER' | 'BRONZE'

interface FC26Player {
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
  photo: string
}

const TIER_STYLES: Record<Tier, { bg: string; border: string; text: string; badge: string; label: string }> = {
  ICON:      { bg: 'from-purple-900 via-amber-800 to-yellow-600', border: 'border-yellow-400', text: 'text-yellow-300', badge: 'bg-yellow-500 text-black', label: 'ICON' },
  TOTY:      { bg: 'from-blue-950 via-blue-800 to-cyan-500',     border: 'border-cyan-400',   text: 'text-cyan-300',   badge: 'bg-cyan-400 text-black',   label: 'TOTY' },
  TOTS:      { bg: 'from-green-950 via-pitch-800 to-pitch-500',  border: 'border-pitch-400',  text: 'text-pitch-300',  badge: 'bg-pitch-500 text-white',   label: 'TOTS' },
  RARE_GOLD: { bg: 'from-yellow-900 via-amber-800 to-yellow-700',border: 'border-yellow-500', text: 'text-yellow-200', badge: 'bg-yellow-600 text-black',   label: 'RARE' },
  SILVER:    { bg: 'from-gray-700 via-gray-600 to-gray-500',     border: 'border-gray-400',   text: 'text-gray-200',   badge: 'bg-gray-400 text-black',    label: 'SILVER' },
  BRONZE:    { bg: 'from-amber-900 via-amber-700 to-amber-600',  border: 'border-amber-500',  text: 'text-amber-200',  badge: 'bg-amber-600 text-black',   label: 'BRONZE' },
}

const PLAYERS: FC26Player[] = [
  { id: 1,  name: 'Erling Haaland',   shortName: 'HAALAND',   position: 'ST',  nationality: '🇳🇴', team: 'Man City',    teamId: 65,  rating: 91, tier: 'RARE_GOLD', pac: 89, sho: 93, pas: 65, dri: 80, def: 45, phy: 88, photo: '/api/player-image/839956' },
  { id: 2,  name: 'Kylian Mbappé',    shortName: 'MBAPPÉ',    position: 'ST',  nationality: '🇫🇷', team: 'Real Madrid', teamId: 86,  rating: 92, tier: 'RARE_GOLD', pac: 97, sho: 91, pas: 81, dri: 93, def: 36, phy: 76, photo: '/api/player-image/826643' },
  { id: 3,  name: 'Vinicius Jr.',      shortName: 'VINÍCIUS',  position: 'LW',  nationality: '🇧🇷', team: 'Real Madrid', teamId: 86,  rating: 91, tier: 'RARE_GOLD', pac: 95, sho: 85, pas: 78, dri: 93, def: 30, phy: 68, photo: '/api/player-image/868812' },
  { id: 4,  name: 'Bukayo Saka',       shortName: 'SAKA',      position: 'RW',  nationality: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', team: 'Arsenal',     teamId: 57,  rating: 89, tier: 'RARE_GOLD', pac: 88, sho: 83, pas: 85, dri: 88, def: 62, phy: 68, photo: '/api/player-image/934235' },
  { id: 5,  name: 'Jude Bellingham',  shortName: 'BELLINGHAM', position: 'CM', nationality: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', team: 'Real Madrid', teamId: 86,  rating: 91, tier: 'TOTY',      pac: 83, sho: 82, pas: 85, dri: 90, def: 71, phy: 82, photo: '/api/player-image/991011' },
  { id: 6,  name: 'Rodri',            shortName: 'RODRI',     position: 'CDM', nationality: '🇪🇸', team: 'Man City',    teamId: 65,  rating: 92, tier: 'TOTY',      pac: 72, sho: 75, pas: 89, dri: 85, def: 92, phy: 86, photo: '/api/player-image/827606' },
  { id: 7,  name: 'Phil Foden',       shortName: 'FODEN',     position: 'CAM', nationality: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', team: 'Man City',    teamId: 65,  rating: 88, tier: 'RARE_GOLD', pac: 82, sho: 85, pas: 85, dri: 90, def: 53, phy: 62, photo: '/api/player-image/859765' },
  { id: 8,  name: 'Lamine Yamal',     shortName: 'YAMAL',     position: 'RW',  nationality: '🇪🇸', team: 'Barcelona',   teamId: 81,  rating: 87, tier: 'TOTS',      pac: 90, sho: 80, pas: 82, dri: 92, def: 38, phy: 58, photo: '/api/player-image/1402912' },
  { id: 9,  name: 'Mohamed Salah',    shortName: 'SALAH',     position: 'RW',  nationality: '🇪🇬', team: 'Liverpool',   teamId: 64,  rating: 89, tier: 'RARE_GOLD', pac: 91, sho: 88, pas: 80, dri: 88, def: 48, phy: 75, photo: '/api/player-image/159665' },
  { id: 10, name: 'Harry Kane',       shortName: 'KANE',      position: 'ST',  nationality: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', team: 'Bayern',      teamId: 5,   rating: 89, tier: 'RARE_GOLD', pac: 72, sho: 94, pas: 83, dri: 82, def: 42, phy: 80, photo: '/api/player-image/108579' },
  { id: 11, name: 'Pedri',            shortName: 'PEDRI',     position: 'CM',  nationality: '🇪🇸', team: 'Barcelona',   teamId: 81,  rating: 87, tier: 'RARE_GOLD', pac: 76, sho: 76, pas: 88, dri: 90, def: 72, phy: 65, photo: '/api/player-image/992587' },
  { id: 12, name: 'Florian Wirtz',    shortName: 'WIRTZ',     position: 'CAM', nationality: '🇩🇪', team: 'Leverkusen',  teamId: 3,   rating: 88, tier: 'TOTS',      pac: 78, sho: 84, pas: 86, dri: 90, def: 58, phy: 66, photo: '/api/player-image/1019322' },
  { id: 13, name: 'Vinícius Jr. ICON',shortName: 'VINÍ ICON', position: 'LW',  nationality: '🇧🇷', team: 'Real Madrid', teamId: 86,  rating: 96, tier: 'ICON',      pac: 98, sho: 90, pas: 85, dri: 97, def: 35, phy: 72, photo: '/api/player-image/868812' },
  { id: 14, name: 'Lionel Messi',     shortName: 'MESSI',     position: 'RW',  nationality: '🇦🇷', team: 'Inter Miami', teamId: 86,  rating: 90, tier: 'ICON',      pac: 68, sho: 90, pas: 92, dri: 95, def: 32, phy: 62, photo: '/api/player-image/12994' },
  { id: 15, name: 'Cristiano Ronaldo',shortName: 'RONALDO',   position: 'ST',  nationality: '🇵🇹', team: 'Al Nassr',    teamId: 86,  rating: 88, tier: 'ICON',      pac: 80, sho: 93, pas: 74, dri: 85, def: 28, phy: 79, photo: '/api/player-image/750' },
  { id: 16, name: 'Gavi',             shortName: 'GAVI',      position: 'CM',  nationality: '🇪🇸', team: 'Barcelona',   teamId: 81,  rating: 85, tier: 'SILVER',    pac: 75, sho: 72, pas: 84, dri: 86, def: 74, phy: 68, photo: '/api/player-image/1103693' },
]

const POSITIONS = ['All', 'ST', 'LW', 'RW', 'CAM', 'CM', 'CDM']
const TIER_LABELS: Tier[] = ['ICON', 'TOTY', 'TOTS', 'RARE_GOLD', 'SILVER', 'BRONZE']

function StatBar({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="text-white/40 text-[10px] font-bold w-6 shrink-0">{label}</span>
      <span className={`text-[11px] font-extrabold ${value >= 85 ? 'text-pitch-400' : value >= 70 ? 'text-volt-400' : 'text-white/80'}`}>{value}</span>
    </div>
  )
}

function PlayerCard({ player, onClick }: { player: FC26Player; onClick: () => void }) {
  const style = TIER_STYLES[player.tier]
  return (
    <div
      onClick={onClick}
      className={`relative rounded-2xl border-2 ${style.border} bg-gradient-to-b ${style.bg} cursor-pointer hover:scale-105 transition-all duration-200 shadow-xl overflow-hidden`}
      style={{ width: 170, minHeight: 240 }}
    >
      {/* Tier badge */}
      <div className={`absolute top-2 left-2 text-[9px] font-extrabold px-1.5 py-0.5 rounded-md ${style.badge}`}>
        {style.label}
      </div>

      {/* Rating */}
      <div className={`absolute top-2 right-2 text-2xl font-extrabold ${style.text} leading-none`}>
        {player.rating}
      </div>

      {/* Position */}
      <div className={`absolute top-9 right-2 text-[10px] font-bold ${style.text} opacity-70`}>
        {player.position}
      </div>

      {/* Player photo */}
      <div className="flex justify-center pt-8 pb-1 px-3">
        <div className="w-24 h-24 rounded-xl overflow-hidden bg-black/20 border border-white/10">
          <SafeImage
            src={player.photo}
            alt={player.name}
            className="w-full h-full object-cover object-top"
            fallback="⚽"
          />
        </div>
      </div>

      {/* Name */}
      <div className={`text-center text-[11px] font-extrabold ${style.text} uppercase tracking-wider px-2 leading-tight`}>
        {player.shortName}
      </div>

      {/* Divider */}
      <div className={`mx-3 my-1.5 h-px bg-white/20`} />

      {/* Stats */}
      <div className="grid grid-cols-2 gap-x-2 gap-y-0.5 px-3 pb-3">
        <StatBar label="PAC" value={player.pac} />
        <StatBar label="DRI" value={player.dri} />
        <StatBar label="SHO" value={player.sho} />
        <StatBar label="DEF" value={player.def} />
        <StatBar label="PAS" value={player.pas} />
        <StatBar label="PHY" value={player.phy} />
      </div>

      {/* Nationality */}
      <div className="absolute bottom-2 left-2 text-base">{player.nationality}</div>
      <div className="absolute bottom-2 right-2">
        <SafeImage
          src={`https://crests.football-data.org/${player.teamId}.png`}
          alt={player.team}
          className="w-5 h-5 object-contain"
          fallback="🛡"
        />
      </div>
    </div>
  )
}

function PlayerModal({ player, onClose }: { player: FC26Player; onClose: () => void }) {
  const style = TIER_STYLES[player.tier]
  const overall = Math.round((player.pac + player.sho + player.pas + player.dri + player.def + player.phy) / 6)

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div
        className={`relative rounded-3xl border-2 ${style.border} bg-gradient-to-b ${style.bg} max-w-sm w-full p-6 shadow-2xl`}
        onClick={e => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-white/50 hover:text-white text-2xl leading-none">×</button>

        <div className={`text-xs font-extrabold px-2 py-1 rounded-lg ${style.badge} inline-block mb-3`}>{style.label}</div>

        <div className="flex gap-4 items-start mb-4">
          <div className="w-28 h-28 rounded-2xl overflow-hidden bg-black/20 border border-white/20 shrink-0">
            <SafeImage src={player.photo} alt={player.name} className="w-full h-full object-cover object-top" fallback="⚽" />
          </div>
          <div>
            <div className={`text-4xl font-extrabold ${style.text}`}>{player.rating}</div>
            <div className={`text-lg font-extrabold ${style.text} uppercase`}>{player.shortName}</div>
            <div className="text-white/50 text-sm mt-1">{player.position} · {player.team}</div>
            <div className="text-2xl mt-1">{player.nationality}</div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'PACE', value: player.pac, emoji: '⚡' },
            { label: 'SHOOT', value: player.sho, emoji: '⚽' },
            { label: 'PASS', value: player.pas, emoji: '🎯' },
            { label: 'DRIBBLE', value: player.dri, emoji: '🪄' },
            { label: 'DEFEND', value: player.def, emoji: '🛡' },
            { label: 'PHYSICAL', value: player.phy, emoji: '💪' },
          ].map(s => (
            <div key={s.label} className="bg-black/30 rounded-xl p-3 text-center border border-white/10">
              <div className="text-xl mb-1">{s.emoji}</div>
              <div className={`text-2xl font-extrabold ${s.value >= 85 ? 'text-pitch-400' : s.value >= 70 ? 'text-volt-400' : 'text-white'}`}>
                {s.value}
              </div>
              <div className="text-white/40 text-[10px] font-bold">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="mt-4 bg-black/30 rounded-xl p-3 border border-white/10 text-center">
          <div className={`text-3xl font-extrabold ${style.text}`}>{overall}</div>
          <div className="text-white/40 text-xs font-bold">AVERAGE OVERALL</div>
        </div>
      </div>
    </div>
  )
}

export default function FC26Page() {
  const [search, setSearch] = useState('')
  const [position, setPosition] = useState('All')
  const [tier, setTier] = useState<Tier | 'All'>('All')
  const [selected, setSelected] = useState<FC26Player | null>(null)

  const filtered = PLAYERS.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase())
    const matchPos = position === 'All' || p.position === position
    const matchTier = tier === 'All' || p.tier === tier
    return matchSearch && matchPos && matchTier
  })

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center gap-2 bg-volt-400/10 border border-volt-400/20 rounded-full px-4 py-1.5 mb-4">
          <span className="text-volt-400 font-bold text-sm">🎮 EA Sports FC 26</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-3">
          Player <span className="text-volt-400">Cards</span>
        </h1>
        <p className="text-white/50 text-lg">Tap any card to see full stats and ratings!</p>
      </div>

      {/* Tier legend */}
      <div className="flex flex-wrap justify-center gap-2">
        {(['All', ...TIER_LABELS] as const).map(t => (
          <button
            key={t}
            onClick={() => setTier(t)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
              tier === t
                ? t === 'All' ? 'bg-white/20 border-white/40 text-white' : `${TIER_STYLES[t as Tier].badge} border-transparent`
                : 'border-white/10 text-white/50 hover:border-white/30 hover:text-white'
            }`}
          >
            {t === 'All' ? '✨ All Cards' : t === 'ICON' ? '👑 ICON' : t === 'TOTY' ? '🏆 TOTY' : t === 'TOTS' ? '⭐ TOTS' : t === 'RARE_GOLD' ? '🥇 RARE GOLD' : t === 'SILVER' ? '🥈 SILVER' : '🥉 BRONZE'}
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <input
          className="input flex-1 min-w-48"
          placeholder="🔍 Search player..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <div className="flex gap-2 flex-wrap">
          {POSITIONS.map(p => (
            <button
              key={p}
              onClick={() => setPosition(p)}
              className={`px-3 py-2 rounded-xl text-sm font-bold transition-all border ${
                position === p
                  ? 'bg-pitch-500 border-pitch-400 text-white'
                  : 'border-white/10 text-white/50 hover:border-white/30 hover:text-white'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Cards grid */}
      <div className="flex flex-wrap gap-5 justify-center">
        {filtered.map(player => (
          <PlayerCard key={player.id} player={player} onClick={() => setSelected(player)} />
        ))}
        {filtered.length === 0 && (
          <div className="text-center text-white/30 py-16 w-full">
            <div className="text-5xl mb-4">🎮</div>
            <p className="text-lg">No cards found — try a different search!</p>
          </div>
        )}
      </div>

      {/* Stats key */}
      <div className="card max-w-lg mx-auto">
        <h3 className="font-bold text-white mb-3 text-center">📖 Stats Guide</h3>
        <div className="grid grid-cols-2 gap-2 text-sm">
          {[
            { stat: 'PAC', desc: 'How fast they run ⚡', },
            { stat: 'SHO', desc: 'How well they shoot 🥅' },
            { stat: 'PAS', desc: 'How accurate their passing 🎯' },
            { stat: 'DRI', desc: 'How slick their dribbling 🪄' },
            { stat: 'DEF', desc: 'How well they defend 🛡' },
            { stat: 'PHY', desc: 'Strength and stamina 💪' },
          ].map(s => (
            <div key={s.stat} className="flex items-center gap-2">
              <span className="text-volt-400 font-extrabold w-8 text-xs">{s.stat}</span>
              <span className="text-white/50 text-xs">{s.desc}</span>
            </div>
          ))}
        </div>
      </div>

      {selected && <PlayerModal player={selected} onClose={() => setSelected(null)} />}
    </div>
  )
}
