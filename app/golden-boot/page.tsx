'use client'

const SCORERS = [
  { rank: 1,  name: 'Harry Kane',       team: 'Bayern Munich',   league: 'Bundesliga', flag: '🇩🇪', goals: 28, assists: 7,  apps: 32, photo: 'https://img.a.transfermarkt.technology/portrait/big/132098-1695893440.jpg',  nationality: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
  { rank: 2,  name: 'Erling Haaland',   team: 'Man City',        league: 'Premier League', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', goals: 27, assists: 5,  apps: 30, photo: 'https://img.a.transfermarkt.technology/portrait/big/418560-1701275689.jpg',  nationality: '🇳🇴' },
  { rank: 3,  name: 'Kylian Mbappé',    team: 'Real Madrid',     league: 'La Liga',    flag: '🇪🇸', goals: 24, assists: 8,  apps: 28, photo: 'https://img.a.transfermarkt.technology/portrait/big/342229-1682683695.jpg',  nationality: '🇫🇷' },
  { rank: 4,  name: 'Mohamed Salah',    team: 'Liverpool',        league: 'Premier League', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', goals: 20, assists: 13, apps: 30, photo: 'https://img.a.transfermarkt.technology/portrait/big/148669-1695893577.jpg',  nationality: '🇪🇬' },
  { rank: 5,  name: 'Vinicius Jr.',      team: 'Real Madrid',     league: 'La Liga',    flag: '🇪🇸', goals: 18, assists: 11, apps: 27, photo: 'https://img.a.transfermarkt.technology/portrait/big/371998-1695892614.jpg',  nationality: '🇧🇷' },
  { rank: 6,  name: 'Florian Wirtz',    team: 'Leverkusen',      league: 'Bundesliga', flag: '🇩🇪', goals: 14, assists: 12, apps: 28, photo: 'https://img.a.transfermarkt.technology/portrait/big/521361-1695893792.jpg',  nationality: '🇩🇪' },
  { rank: 7,  name: 'Bukayo Saka',       team: 'Arsenal',         league: 'Premier League', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', goals: 15, assists: 12, apps: 29, photo: 'https://img.a.transfermarkt.technology/portrait/big/433177-1695897072.jpg',  nationality: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
  { rank: 8,  name: 'Jude Bellingham',  team: 'Real Madrid',     league: 'La Liga',    flag: '🇪🇸', goals: 16, assists: 6,  apps: 27, photo: 'https://img.a.transfermarkt.technology/portrait/big/581678-1695892766.jpg',  nationality: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
  { rank: 9,  name: 'Lamine Yamal',     team: 'Barcelona',       league: 'La Liga',    flag: '🇪🇸', goals: 12, assists: 14, apps: 26, photo: 'https://img.a.transfermarkt.technology/portrait/big/945518-1695893343.jpg',  nationality: '🇪🇸' },
  { rank: 10, name: 'Phil Foden',       team: 'Man City',        league: 'Premier League', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', goals: 12, assists: 10, apps: 28, photo: 'https://img.a.transfermarkt.technology/portrait/big/406635-1695893168.jpg',  nationality: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
  { rank: 11, name: 'Pedri',            team: 'Barcelona',       league: 'La Liga',    flag: '🇪🇸', goals: 7,  assists: 8,  apps: 24, photo: 'https://img.a.transfermarkt.technology/portrait/big/557802-1695893692.jpg',  nationality: '🇪🇸' },
  { rank: 12, name: 'Lionel Messi',     team: 'Inter Miami',     league: 'MLS',        flag: '🇺🇸', goals: 18, assists: 12, apps: 22, photo: 'https://img.a.transfermarkt.technology/portrait/big/28003-1698411706.jpg',   nationality: '🇦🇷' },
]

const LEAGUES = ['All Leagues', 'Premier League', 'La Liga', 'Bundesliga', 'Serie A', 'Ligue 1', 'MLS']

export default function GoldenBootPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      <div className="text-center">
        <div className="text-6xl mb-3">👟</div>
        <h1 className="text-4xl font-extrabold text-white mb-2">
          Golden <span className="text-volt-400">Boot</span> Race
        </h1>
        <p className="text-white/50 text-lg">Top scorers across all major leagues — Season 2025/26</p>
      </div>

      {/* Top 3 podium */}
      <div className="grid grid-cols-3 gap-4 items-end">
        {[SCORERS[1], SCORERS[0], SCORERS[2]].map((s, i) => {
          const podium = i === 0 ? { pos: 2, height: 'h-24', bg: 'bg-gray-400/20 border-gray-400/40', medal: '🥈', size: 'w-16 h-16' }
                       : i === 1 ? { pos: 1, height: 'h-32', bg: 'bg-volt-400/20 border-volt-400/40', medal: '🥇', size: 'w-20 h-20' }
                       :           { pos: 3, height: 'h-16', bg: 'bg-amber-700/20 border-amber-700/40', medal: '🥉', size: 'w-14 h-14' }
          return (
            <div key={s.rank} className={`card border-2 ${podium.bg} text-center flex flex-col items-center gap-2 py-4`}>
              <div className="text-2xl">{podium.medal}</div>
              <div className={`${podium.size} rounded-full overflow-hidden border-2 border-white/20 mx-auto`}>
                <img src={s.photo} alt={s.name} className="w-full h-full object-cover object-top" onError={e => (e.currentTarget.style.display='none')} />
              </div>
              <div>
                <p className="font-extrabold text-white text-sm leading-tight">{s.name}</p>
                <p className="text-white/40 text-xs">{s.nationality} {s.team}</p>
              </div>
              <div className="text-3xl font-extrabold text-volt-400">{s.goals}</div>
              <div className="text-white/30 text-xs">goals</div>
            </div>
          )
        })}
      </div>

      {/* Full table */}
      <div className="card p-0 overflow-hidden">
        <div className="px-4 py-3 border-b border-white/5 grid grid-cols-12 gap-2 text-xs font-bold text-white/30 uppercase">
          <div className="col-span-1 text-center">#</div>
          <div className="col-span-5">Player</div>
          <div className="col-span-2 text-center">Apps</div>
          <div className="col-span-2 text-center text-pitch-400">Goals</div>
          <div className="col-span-2 text-center">Assists</div>
        </div>
        {SCORERS.sort((a, b) => b.goals - a.goals).map((s, i) => (
          <div key={s.name} className={`grid grid-cols-12 gap-2 px-4 py-3 items-center hover:bg-white/5 transition-colors ${i < SCORERS.length - 1 ? 'border-b border-white/5' : ''}`}>
            <div className="col-span-1 text-center">
              <span className={`text-sm font-extrabold ${i === 0 ? 'text-volt-400' : i === 1 ? 'text-gray-400' : i === 2 ? 'text-amber-600' : 'text-white/30'}`}>{i + 1}</span>
            </div>
            <div className="col-span-5 flex items-center gap-2 min-w-0">
              <div className="w-9 h-9 rounded-full overflow-hidden border border-white/10 shrink-0">
                <img src={s.photo} alt={s.name} className="w-full h-full object-cover object-top" onError={e => (e.currentTarget.style.display='none')} />
              </div>
              <div className="min-w-0">
                <p className="font-bold text-white text-sm truncate">{s.name}</p>
                <p className="text-xs text-white/30 truncate">{s.nationality} {s.flag} {s.league}</p>
              </div>
            </div>
            <div className="col-span-2 text-center text-sm text-white/50">{s.apps}</div>
            <div className="col-span-2 text-center">
              <span className="text-base font-extrabold text-volt-400">{s.goals}</span>
            </div>
            <div className="col-span-2 text-center text-sm text-pitch-400 font-semibold">{s.assists}</div>
          </div>
        ))}
      </div>

      <p className="text-white/20 text-xs text-center">⚽ Goals in all competitions including cups · Updated regularly</p>
    </div>
  )
}
