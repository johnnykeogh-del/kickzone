'use client'

import { useState } from 'react'

interface Wonderkid {
  id: number
  name: string
  age: number
  nationality: string
  team: string
  position: string
  marketValue: string
  photo: string
  stats: { pac: number; sho: number; pas: number; dri: number; def: number; phy: number }
  goals: number
  assists: number
  highlight: string
  potential: number
}

const WONDERKIDS: Wonderkid[] = [
  { id: 1,  name: 'Lamine Yamal',      age: 17, nationality: '🇪🇸', team: 'Barcelona',       position: 'RW',  marketValue: '€180M', photo: 'https://img.a.transfermarkt.technology/portrait/big/945518-1695893343.jpg',  stats: { pac: 90, sho: 80, pas: 82, dri: 92, def: 38, phy: 58 }, goals: 12, assists: 14, highlight: 'Youngest scorer in Euros history!', potential: 99 },
  { id: 2,  name: 'Kobbie Mainoo',     age: 19, nationality: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', team: 'Man United',      position: 'CM',  marketValue: '€60M',  photo: 'https://img.a.transfermarkt.technology/portrait/big/857744-1695892877.jpg',  stats: { pac: 74, sho: 72, pas: 80, dri: 82, def: 72, phy: 74 }, goals: 6,  assists: 4,  highlight: 'England star of the future!', potential: 90 },
  { id: 3,  name: 'Florian Wirtz',     age: 21, nationality: '🇩🇪', team: 'Leverkusen',      position: 'CAM', marketValue: '€150M', photo: 'https://img.a.transfermarkt.technology/portrait/big/521361-1695893792.jpg',  stats: { pac: 78, sho: 84, pas: 86, dri: 90, def: 58, phy: 66 }, goals: 14, assists: 12, highlight: 'Germany\'s next superstar!', potential: 96 },
  { id: 4,  name: 'Endrick',           age: 18, nationality: '🇧🇷', team: 'Real Madrid',     position: 'ST',  marketValue: '€80M',  photo: 'https://img.a.transfermarkt.technology/portrait/big/1159859-1695892688.jpg', stats: { pac: 85, sho: 85, pas: 65, dri: 82, def: 35, phy: 78 }, goals: 9,  assists: 3,  highlight: 'Brazil\'s next big thing!', potential: 94 },
  { id: 5,  name: 'Gavi',              age: 20, nationality: '🇪🇸', team: 'Barcelona',       position: 'CM',  marketValue: '€80M',  photo: 'https://img.a.transfermarkt.technology/portrait/big/672757-1695892953.jpg',  stats: { pac: 75, sho: 72, pas: 84, dri: 86, def: 74, phy: 68 }, goals: 5,  assists: 7,  highlight: 'Heart of Barcelona\'s midfield!', potential: 93 },
  { id: 6,  name: 'Jamal Musiala',     age: 21, nationality: '🇩🇪', team: 'Bayern Munich',   position: 'CAM', marketValue: '€130M', photo: 'https://img.a.transfermarkt.technology/portrait/big/580195-1695892818.jpg',  stats: { pac: 82, sho: 80, pas: 82, dri: 91, def: 55, phy: 65 }, goals: 13, assists: 10, highlight: 'The most exciting player in Germany!', potential: 97 },
  { id: 7,  name: 'Pedri',             age: 22, nationality: '🇪🇸', team: 'Barcelona',       position: 'CM',  marketValue: '€120M', photo: 'https://img.a.transfermarkt.technology/portrait/big/557802-1695893692.jpg',  stats: { pac: 76, sho: 76, pas: 88, dri: 90, def: 72, phy: 65 }, goals: 7,  assists: 8,  highlight: 'The new Iniesta!', potential: 95 },
  { id: 8,  name: 'Warren Zaïre-Emery',age: 18, nationality: '🇫🇷', team: 'PSG',             position: 'CM',  marketValue: '€70M',  photo: 'https://img.a.transfermarkt.technology/portrait/big/1075614-1695892755.jpg', stats: { pac: 78, sho: 70, pas: 80, dri: 82, def: 74, phy: 72 }, goals: 6,  assists: 5,  highlight: 'PSG\'s teenage sensation!', potential: 92 },
  { id: 9,  name: 'Alejandro Garnacho',age: 20, nationality: '🇦🇷', team: 'Man United',      position: 'LW',  marketValue: '€60M',  photo: 'https://img.a.transfermarkt.technology/portrait/big/877773-1695892803.jpg',  stats: { pac: 88, sho: 76, pas: 72, dri: 86, def: 42, phy: 65 }, goals: 8,  assists: 7,  highlight: 'Argentina\'s next flying winger!', potential: 91 },
  { id: 10, name: 'Mathys Tel',         age: 19, nationality: '🇫🇷', team: 'Bayern Munich',   position: 'ST',  marketValue: '€45M',  photo: 'https://img.a.transfermarkt.technology/portrait/big/985364-1695892721.jpg',  stats: { pac: 86, sho: 80, pas: 68, dri: 80, def: 38, phy: 72 }, goals: 10, assists: 4,  highlight: 'One of France\'s brightest stars!', potential: 90 },
  { id: 11, name: 'Evan Ferguson',      age: 20, nationality: '🇮🇪', team: 'Brighton',        position: 'ST',  marketValue: '€40M',  photo: 'https://img.a.transfermarkt.technology/portrait/big/1028747-1695892704.jpg', stats: { pac: 74, sho: 84, pas: 65, dri: 74, def: 32, phy: 82 }, goals: 7,  assists: 3,  highlight: 'Ireland\'s future goal machine!', potential: 89 },
  { id: 12, name: 'Youssoufa Moukoko', age: 20, nationality: '🇩🇪', team: 'Nîmes',           position: 'ST',  marketValue: '€15M',  photo: 'https://img.a.transfermarkt.technology/portrait/big/804548-1695892737.jpg',  stats: { pac: 80, sho: 78, pas: 62, dri: 76, def: 30, phy: 72 }, goals: 8,  assists: 2,  highlight: 'Was breaking records at 15!', potential: 88 },
]

function RadarChart({ stats }: { stats: Wonderkid['stats'] }) {
  const values = [stats.pac, stats.sho, stats.pas, stats.dri, stats.def, stats.phy]
  const labels = ['PAC', 'SHO', 'PAS', 'DRI', 'DEF', 'PHY']
  const N = 6
  const cx = 90, cy = 90, r = 70

  const angleOf = (i: number) => (Math.PI * 2 * i) / N - Math.PI / 2
  const point = (i: number, val: number) => {
    const ratio = val / 100
    return { x: cx + r * ratio * Math.cos(angleOf(i)), y: cy + r * ratio * Math.sin(angleOf(i)) }
  }
  const outerPoint = (i: number) => ({ x: cx + r * Math.cos(angleOf(i)), y: cy + r * Math.sin(angleOf(i)) })

  const polygonPoints = values.map((v, i) => `${point(i, v).x},${point(i, v).y}`).join(' ')
  const gridPoints = (ratio: number) => Array.from({ length: N }, (_, i) => {
    const p = outerPoint(i)
    return `${cx + (p.x - cx) * ratio},${cy + (p.y - cy) * ratio}`
  }).join(' ')

  return (
    <svg viewBox="0 0 180 180" className="w-full max-w-[200px] mx-auto">
      {[0.25, 0.5, 0.75, 1].map(r => (
        <polygon key={r} points={gridPoints(r)} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
      ))}
      {Array.from({ length: N }, (_, i) => {
        const p = outerPoint(i)
        return <line key={i} x1={cx} y1={cy} x2={p.x} y2={p.y} stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
      })}
      <polygon points={polygonPoints} fill="rgba(34,197,94,0.25)" stroke="rgb(34,197,94)" strokeWidth="2" />
      {labels.map((label, i) => {
        const p = outerPoint(i)
        const lx = cx + (p.x - cx) * 1.22
        const ly = cy + (p.y - cy) * 1.22
        return <text key={label} x={lx} y={ly} textAnchor="middle" dominantBaseline="middle" className="fill-white/40 text-[8px] font-bold" fontSize="8">{label}</text>
      })}
    </svg>
  )
}

export default function WonderkidsPage() {
  const [selected, setSelected] = useState<Wonderkid | null>(null)

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      <div className="text-center">
        <div className="text-6xl mb-3">🌟</div>
        <h1 className="text-4xl font-extrabold text-white mb-2">
          Wonder<span className="text-pitch-400">kids</span>
        </h1>
        <p className="text-white/50 text-lg">The best under-22 players in the world right now — future GOATs!</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {WONDERKIDS.map(kid => (
          <div key={kid.id} onClick={() => setSelected(kid)}
            className="card hover:border-pitch-500/40 transition-all cursor-pointer group">
            <div className="flex items-start gap-3 mb-3">
              <div className="w-14 h-14 rounded-xl overflow-hidden border border-white/10 shrink-0">
                <img src={kid.photo} alt={kid.name} className="w-full h-full object-cover object-top" onError={e => (e.currentTarget.style.display='none')} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-extrabold text-white group-hover:text-pitch-400 transition-colors truncate">{kid.name}</p>
                <p className="text-white/40 text-xs">{kid.nationality} · {kid.position} · Age {kid.age}</p>
                <p className="text-white/30 text-xs truncate">{kid.team}</p>
              </div>
              <div className="text-right shrink-0">
                <div className="text-volt-400 font-extrabold text-sm">{kid.marketValue}</div>
                <div className="text-white/30 text-xs">value</div>
              </div>
            </div>

            <RadarChart stats={kid.stats} />

            <div className="flex justify-between text-sm mt-2">
              <span className="text-white/50">{kid.goals}⚽ {kid.assists}🎯</span>
              <span className="badge-green text-xs">Potential {kid.potential}</span>
            </div>
            <p className="text-white/40 text-xs mt-2 italic">"{kid.highlight}"</p>
          </div>
        ))}
      </div>

      {/* Modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setSelected(null)}>
          <div className="card max-w-md w-full" onClick={e => e.stopPropagation()}>
            <button onClick={() => setSelected(null)} className="float-right text-white/30 hover:text-white text-2xl">×</button>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-pitch-500/40">
                <img src={selected.photo} alt={selected.name} className="w-full h-full object-cover object-top" onError={e => (e.currentTarget.style.display='none')} />
              </div>
              <div>
                <h2 className="text-2xl font-extrabold text-white">{selected.name}</h2>
                <p className="text-white/50">{selected.nationality} · {selected.team}</p>
                <p className="text-white/40 text-sm">{selected.position} · Age {selected.age}</p>
              </div>
            </div>
            <RadarChart stats={selected.stats} />
            <div className="grid grid-cols-3 gap-2 mt-4">
              {Object.entries(selected.stats).map(([k, v]) => (
                <div key={k} className="bg-white/5 rounded-xl p-2 text-center">
                  <div className={`text-lg font-extrabold ${v >= 85 ? 'text-pitch-400' : v >= 70 ? 'text-volt-400' : 'text-white'}`}>{v}</div>
                  <div className="text-white/30 text-xs uppercase">{k}</div>
                </div>
              ))}
            </div>
            <div className="mt-4 p-3 bg-pitch-900/30 rounded-xl border border-pitch-500/20">
              <p className="text-pitch-400 text-sm font-semibold">⭐ Potential Rating: {selected.potential}/99</p>
              <p className="text-white/50 text-xs mt-1">"{selected.highlight}"</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
