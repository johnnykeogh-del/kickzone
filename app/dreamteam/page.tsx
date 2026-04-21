'use client'

import { useState } from 'react'

interface Player {
  id: number; name: string; position: string; team: string; rating: number
  photo: string; nationality: string
}

const ALL_PLAYERS: Player[] = [
  { id: 1,  name: 'Alisson',          position: 'GK',  team: 'Liverpool',    rating: 90, nationality: '🇧🇷', photo: 'https://img.a.transfermarkt.technology/portrait/big/105470-1695893915.jpg' },
  { id: 2,  name: 'Thibaut Courtois', position: 'GK',  team: 'Real Madrid',  rating: 90, nationality: '🇧🇪', photo: 'https://img.a.transfermarkt.technology/portrait/big/69237-1695893958.jpg' },
  { id: 3,  name: 'Manuel Neuer',     position: 'GK',  team: 'Bayern',       rating: 88, nationality: '🇩🇪', photo: 'https://img.a.transfermarkt.technology/portrait/big/17259-1695894010.jpg' },
  { id: 4,  name: 'Trent Alexander-Arnold', position: 'RB', team: 'Real Madrid', rating: 87, nationality: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', photo: 'https://img.a.transfermarkt.technology/portrait/big/314353-1695894058.jpg' },
  { id: 5,  name: 'Virgil van Dijk',  position: 'CB',  team: 'Liverpool',    rating: 89, nationality: '🇳🇱', photo: 'https://img.a.transfermarkt.technology/portrait/big/139208-1695894103.jpg' },
  { id: 6,  name: 'Rúben Dias',       position: 'CB',  team: 'Man City',     rating: 88, nationality: '🇵🇹', photo: 'https://img.a.transfermarkt.technology/portrait/big/363616-1695894145.jpg' },
  { id: 7,  name: 'Antonio Rüdiger',  position: 'CB',  team: 'Real Madrid',  rating: 85, nationality: '🇩🇪', photo: 'https://img.a.transfermarkt.technology/portrait/big/167598-1695894187.jpg' },
  { id: 8,  name: 'Alphonso Davies', position: 'LB',  team: 'Bayern',       rating: 86, nationality: '🇨🇦', photo: 'https://img.a.transfermarkt.technology/portrait/big/535133-1695894228.jpg' },
  { id: 9,  name: 'Rodri',            position: 'CDM', team: 'Man City',     rating: 92, nationality: '🇪🇸', photo: 'https://img.a.transfermarkt.technology/portrait/big/357565-1695893020.jpg' },
  { id: 10, name: 'Jude Bellingham',  position: 'CM',  team: 'Real Madrid',  rating: 91, nationality: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', photo: 'https://img.a.transfermarkt.technology/portrait/big/581678-1695892766.jpg' },
  { id: 11, name: 'Pedri',            position: 'CM',  team: 'Barcelona',    rating: 87, nationality: '🇪🇸', photo: 'https://img.a.transfermarkt.technology/portrait/big/557802-1695893692.jpg' },
  { id: 12, name: 'Florian Wirtz',    position: 'CAM', team: 'Leverkusen',   rating: 88, nationality: '🇩🇪', photo: 'https://img.a.transfermarkt.technology/portrait/big/521361-1695893792.jpg' },
  { id: 13, name: 'Bukayo Saka',      position: 'RW',  team: 'Arsenal',      rating: 89, nationality: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', photo: 'https://img.a.transfermarkt.technology/portrait/big/433177-1695897072.jpg' },
  { id: 14, name: 'Vinicius Jr.',     position: 'LW',  team: 'Real Madrid',  rating: 91, nationality: '🇧🇷', photo: 'https://img.a.transfermarkt.technology/portrait/big/371998-1695892614.jpg' },
  { id: 15, name: 'Lamine Yamal',     position: 'RW',  team: 'Barcelona',    rating: 87, nationality: '🇪🇸', photo: 'https://img.a.transfermarkt.technology/portrait/big/945518-1695893343.jpg' },
  { id: 16, name: 'Phil Foden',       position: 'CAM', team: 'Man City',     rating: 88, nationality: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', photo: 'https://img.a.transfermarkt.technology/portrait/big/406635-1695893168.jpg' },
  { id: 17, name: 'Erling Haaland',   position: 'ST',  team: 'Man City',     rating: 91, nationality: '🇳🇴', photo: 'https://img.a.transfermarkt.technology/portrait/big/418560-1701275689.jpg' },
  { id: 18, name: 'Kylian Mbappé',    position: 'ST',  team: 'Real Madrid',  rating: 92, nationality: '🇫🇷', photo: 'https://img.a.transfermarkt.technology/portrait/big/342229-1682683695.jpg' },
  { id: 19, name: 'Harry Kane',       position: 'ST',  team: 'Bayern',       rating: 89, nationality: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', photo: 'https://img.a.transfermarkt.technology/portrait/big/132098-1695893440.jpg' },
  { id: 20, name: 'Mohamed Salah',    position: 'RW',  team: 'Liverpool',    rating: 89, nationality: '🇪🇬', photo: 'https://img.a.transfermarkt.technology/portrait/big/148669-1695893577.jpg' },
]

const FORMATIONS: Record<string, { label: string; slots: { pos: string; x: number; y: number }[] }> = {
  '4-3-3': { label: '4-3-3', slots: [
    { pos: 'GK', x: 50, y: 88 },
    { pos: 'RB', x: 82, y: 72 }, { pos: 'CB', x: 62, y: 72 }, { pos: 'CB', x: 38, y: 72 }, { pos: 'LB', x: 18, y: 72 },
    { pos: 'CM', x: 75, y: 52 }, { pos: 'CM', x: 50, y: 52 }, { pos: 'CM', x: 25, y: 52 },
    { pos: 'RW', x: 80, y: 28 }, { pos: 'ST', x: 50, y: 18 }, { pos: 'LW', x: 20, y: 28 },
  ]},
  '4-4-2': { label: '4-4-2', slots: [
    { pos: 'GK', x: 50, y: 88 },
    { pos: 'RB', x: 82, y: 72 }, { pos: 'CB', x: 62, y: 72 }, { pos: 'CB', x: 38, y: 72 }, { pos: 'LB', x: 18, y: 72 },
    { pos: 'RM', x: 82, y: 50 }, { pos: 'CM', x: 60, y: 50 }, { pos: 'CM', x: 40, y: 50 }, { pos: 'LM', x: 18, y: 50 },
    { pos: 'ST', x: 65, y: 22 }, { pos: 'ST', x: 35, y: 22 },
  ]},
  '3-5-2': { label: '3-5-2', slots: [
    { pos: 'GK', x: 50, y: 88 },
    { pos: 'CB', x: 70, y: 72 }, { pos: 'CB', x: 50, y: 72 }, { pos: 'CB', x: 30, y: 72 },
    { pos: 'RM', x: 88, y: 52 }, { pos: 'CM', x: 68, y: 52 }, { pos: 'CM', x: 50, y: 52 }, { pos: 'CM', x: 32, y: 52 }, { pos: 'LM', x: 12, y: 52 },
    { pos: 'ST', x: 65, y: 22 }, { pos: 'ST', x: 35, y: 22 },
  ]},
}

export default function DreamTeamPage() {
  const [formation, setFormation] = useState('4-3-3')
  const [squad, setSquad] = useState<Record<number, Player | null>>({})
  const [picking, setPicking] = useState<number | null>(null)
  const [filter, setFilter] = useState('')
  const [teamName, setTeamName] = useState('My Dream Team')

  const slots = FORMATIONS[formation].slots
  const usedIds = new Set(Object.values(squad).filter(Boolean).map(p => p!.id))
  const available = ALL_PLAYERS.filter(p => !usedIds.has(p.id) && p.name.toLowerCase().includes(filter.toLowerCase()))
  const filled = slots.filter((_, i) => squad[i]).length
  const avgRating = filled ? Math.round(slots.filter((_, i) => squad[i]).reduce((s, _, i) => s + squad[i]!.rating, 0) / filled) : 0

  const posColor: Record<string, string> = { GK: 'bg-volt-400 text-black', CB: 'bg-blue-500', RB: 'bg-blue-500', LB: 'bg-blue-500', CDM: 'bg-pitch-600', CM: 'bg-pitch-500', RM: 'bg-pitch-500', LM: 'bg-pitch-500', CAM: 'bg-pitch-400 text-black', RW: 'bg-orange-500', LW: 'bg-orange-500', ST: 'bg-red-500' }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      <div className="text-center">
        <div className="text-6xl mb-3">⚽</div>
        <h1 className="text-4xl font-extrabold text-white mb-2">Dream <span className="text-pitch-400">Team</span></h1>
        <p className="text-white/50">Pick your ultimate 11 — any players from any club or country!</p>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap gap-3 items-center">
        <input className="input flex-1 min-w-48" placeholder="✏️ Team name..." value={teamName} onChange={e => setTeamName(e.target.value)} />
        <div className="flex gap-2">
          {Object.keys(FORMATIONS).map(f => (
            <button key={f} onClick={() => { setFormation(f); setSquad({}) }}
              className={`px-3 py-2 rounded-xl text-sm font-bold border transition-all ${formation === f ? 'bg-pitch-500 border-pitch-400 text-white' : 'border-white/10 text-white/50 hover:border-white/30 hover:text-white'}`}>
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Pitch */}
        <div>
          <div className="relative rounded-3xl overflow-hidden border-2 border-pitch-700/40" style={{ background: 'linear-gradient(180deg, #0d5c1e 0%, #1a7a2e 50%, #0d5c1e 100%)', aspectRatio: '2/3' }}>
            {/* Pitch markings */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none opacity-20">
              <div className="w-3/4 h-3/4 border-2 border-white rounded-sm" />
              <div className="absolute top-1/2 w-3/4 border-t-2 border-white" style={{ transform: 'translateY(-50%)' }} />
              <div className="absolute top-1/2 w-16 h-16 border-2 border-white rounded-full" style={{ transform: 'translate(-50%, -50%)', left: '50%' }} />
            </div>

            {/* Team name */}
            <div className="absolute top-3 left-0 right-0 text-center">
              <span className="text-white/60 text-xs font-bold uppercase tracking-widest">{teamName}</span>
              {filled > 0 && <span className="ml-2 text-volt-400 text-xs font-extrabold">⭐ {avgRating}</span>}
            </div>

            {slots.map((slot, i) => {
              const player = squad[i]
              return (
                <button
                  key={i}
                  onClick={() => setPicking(picking === i ? null : i)}
                  className={`absolute transform -translate-x-1/2 -translate-y-1/2 transition-all ${picking === i ? 'scale-110' : 'hover:scale-105'}`}
                  style={{ left: `${slot.x}%`, top: `${slot.y}%` }}
                >
                  {player ? (
                    <div className="flex flex-col items-center gap-0.5">
                      <div className={`w-10 h-10 rounded-full overflow-hidden border-2 ${picking === i ? 'border-volt-400' : 'border-white/40'}`}>
                        <img src={player.photo} alt={player.name} className="w-full h-full object-cover object-top" onError={e => (e.currentTarget.style.display='none')} />
                      </div>
                      <div className="bg-black/70 rounded-lg px-1.5 py-0.5 text-center">
                        <p className="text-white text-[9px] font-bold leading-none whitespace-nowrap">{player.name.split(' ').pop()}</p>
                        <p className="text-volt-400 text-[9px] font-extrabold">{player.rating}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-0.5">
                      <div className={`w-10 h-10 rounded-full border-2 border-dashed flex items-center justify-center ${picking === i ? 'border-volt-400 bg-volt-400/20' : 'border-white/30 bg-white/5'}`}>
                        <span className="text-white/40 text-lg">+</span>
                      </div>
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${posColor[slot.pos] || 'bg-white/20 text-white'}`}>{slot.pos}</span>
                    </div>
                  )}
                </button>
              )
            })}
          </div>

          {filled === 11 && (
            <div className="card mt-4 text-center">
              <div className="text-4xl mb-2">🏆</div>
              <p className="font-extrabold text-white text-lg">{teamName}</p>
              <p className="text-volt-400 font-bold">Average Rating: {avgRating}</p>
              <p className="text-white/40 text-sm">Formation: {formation}</p>
              <button onClick={() => setSquad({})} className="btn-ghost text-sm mt-3 px-4 py-2">🔄 Reset</button>
            </div>
          )}
        </div>

        {/* Player picker */}
        <div className="space-y-3">
          {picking !== null ? (
            <>
              <div className="flex items-center justify-between">
                <h3 className="font-extrabold text-white">
                  Pick a player for <span className="text-pitch-400">{slots[picking].pos}</span>
                </h3>
                <button onClick={() => { const s = { ...squad }; delete s[picking]; setSquad(s); setPicking(null) }} className="text-red-400 text-xs hover:text-red-300">Clear slot</button>
              </div>
              <input className="input w-full" placeholder="🔍 Search player..." value={filter} onChange={e => setFilter(e.target.value)} />
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {available.map(p => (
                  <button key={p.id} onClick={() => { setSquad(s => ({ ...s, [picking]: p })); setPicking(null); setFilter('') }}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-pitch-500/40 transition-all text-left">
                    <div className="w-10 h-10 rounded-full overflow-hidden border border-white/10 shrink-0">
                      <img src={p.photo} alt={p.name} className="w-full h-full object-cover object-top" onError={e => (e.currentTarget.style.display='none')} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-white text-sm truncate">{p.name}</p>
                      <p className="text-white/40 text-xs">{p.nationality} {p.team}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className={`text-xs font-bold px-1.5 py-0.5 rounded ${posColor[p.position] || 'bg-white/20 text-white'}`}>{p.position}</span>
                      <p className="text-volt-400 font-extrabold text-sm mt-0.5">{p.rating}</p>
                    </div>
                  </button>
                ))}
              </div>
            </>
          ) : (
            <div className="card text-center py-12">
              <div className="text-5xl mb-3">👆</div>
              <p className="text-white/50 font-semibold">Tap a position on the pitch to pick your player!</p>
              <p className="text-white/20 text-sm mt-2">{filled}/11 players selected</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
