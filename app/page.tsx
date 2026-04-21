import Link from 'next/link'
import { FOOTBALL_NEWS, TOP_PLAYERS, getTodaysMatches } from '@/lib/football'
import SafeImage from '@/components/SafeImage'

export default async function HomePage() {
  const matches = await getTodaysMatches()
  const latestNews = FOOTBALL_NEWS.slice(0, 6)
  const featuredPlayers = TOP_PLAYERS.slice(0, 4)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">

      {/* Hero */}
      <section className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-pitch-900 via-pitch-800 to-dark-800 border border-pitch-700/30 p-8 md:p-12">
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '32px 32px' }} />
        <div className="relative z-10 max-w-2xl">
          <div className="flex items-center gap-2 mb-4">
            <span className="badge-green">⚡ Live Season 2024/25</span>
            <span className="badge-volt">🏆 Global Coverage</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold text-white leading-tight mb-4">
            Football News<br/>
            <span className="text-pitch-400">Made for Kids</span>
          </h1>
          <p className="text-white/60 text-lg mb-8">
            League tables, player market values, real pro interviews and live match chat — all in one place. Your football world! ⚽
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/leagues" className="btn-primary px-6 py-3 text-base">🏆 League Tables</Link>
            <Link href="/interviews" className="btn-volt px-6 py-3 text-base">🎙 Kid Interviews</Link>
            <Link href="/register" className="btn-ghost px-6 py-3 text-base">Join Free 🚀</Link>
          </div>
        </div>
        <div className="absolute right-8 bottom-0 text-9xl opacity-20 hidden md:block select-none">⚽</div>
      </section>

      {/* Matches */}
      {matches.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-5">
            <h2 className="section-title">🔴 Matches Today</h2>
            <Link href="/discussions?type=MATCH" className="text-pitch-400 hover:text-pitch-300 text-sm font-semibold">Discuss →</Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {matches.slice(0, 3).map(match => (
              <Link key={match.id} href={`/discussions?type=MATCH&label=${encodeURIComponent(`${match.homeTeam.shortName} vs ${match.awayTeam.shortName}`)}`}>
                <div className={`card hover:border-pitch-500/40 transition-all cursor-pointer ${match.status === 'IN_PLAY' ? 'border-red-500/40' : ''}`}>
                  {match.status === 'IN_PLAY' && (
                    <div className="flex items-center gap-1.5 mb-3">
                      <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                      <span className="text-red-400 text-xs font-bold uppercase">Live</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <div className="w-8 h-8 shrink-0">
                        <SafeImage src={match.homeTeam.crest} alt="" className="w-8 h-8 object-contain" fallback="🛡" />
                      </div>
                      <span className="text-sm font-bold text-white truncate">{match.homeTeam.shortName}</span>
                    </div>
                    <span className="text-base font-extrabold text-white shrink-0">
                      {(match.status === 'IN_PLAY' || match.status === 'FINISHED') ? `${match.score.fullTime.home ?? 0}–${match.score.fullTime.away ?? 0}` : 'VS'}
                    </span>
                    <div className="flex items-center gap-2 flex-1 min-w-0 justify-end">
                      <span className="text-sm font-bold text-white truncate text-right">{match.awayTeam.shortName}</span>
                      <div className="w-8 h-8 shrink-0">
                        <SafeImage src={match.awayTeam.crest} alt="" className="w-8 h-8 object-contain" fallback="🛡" />
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-white/30 text-center mt-2">{match.competition.name}</p>
                  <p className="text-xs text-pitch-400 text-center mt-1 font-semibold">💬 Chat about this →</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* News */}
      <section>
        <h2 className="section-title mb-5">🔥 Latest Football News</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {latestNews.map(news => (
            <div key={news.id} className="card hover:border-white/20 transition-all group cursor-pointer">
              <div className="flex items-center justify-between mb-3">
                <span className="badge-green">{news.tag}</span>
                {news.hot && <span className="badge-fire">🔥 Hot</span>}
              </div>
              <div className="text-4xl mb-3">{news.image}</div>
              <h3 className="font-bold text-white leading-snug mb-2 group-hover:text-pitch-400 transition-colors">{news.title}</h3>
              <p className="text-sm text-white/50 line-clamp-3 leading-relaxed">{news.summary}</p>
              <p className="text-xs text-white/20 mt-3">{news.time}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Players */}
      <section>
        <div className="flex items-center justify-between mb-5">
          <h2 className="section-title">⭐ Top Players This Season</h2>
          <Link href="/players" className="text-pitch-400 hover:text-pitch-300 text-sm font-semibold">See all →</Link>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {featuredPlayers.map(player => (
            <Link key={player.id} href="/players">
              <div className="card hover:border-pitch-500/40 transition-all text-center group cursor-pointer">
                <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-pitch-900/50 border-2 border-pitch-700/40 overflow-hidden flex items-center justify-center">
                  <SafeImage src={player.photo} alt={player.name} className="w-full h-full object-cover object-top" fallback="⚽" />
                </div>
                <p className="font-bold text-white text-sm group-hover:text-pitch-400 transition-colors leading-tight">{player.name}</p>
                <p className="text-xs text-white/40 mt-0.5">{player.team}</p>
                <div className="mt-3 bg-volt-400/10 border border-volt-400/20 rounded-lg px-2 py-1.5">
                  <p className="text-volt-400 font-extrabold text-sm">{player.marketValue}</p>
                  <p className="text-white/30 text-xs">Market Value</p>
                </div>
                <div className="mt-2 text-xs text-white/40">{player.goals}⚽ {player.assists}🎯</div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Games Zone */}
      <section>
        <h2 className="section-title mb-5">🎮 Games Zone</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Link href="/fc26" className="card hover:border-volt-500/40 transition-all group cursor-pointer text-center space-y-3">
            <div className="text-4xl">🎮</div>
            <h3 className="font-extrabold text-white group-hover:text-volt-400 transition-colors">FC26 Cards</h3>
            <p className="text-white/40 text-xs leading-relaxed">Player ratings & all stats</p>
            <span className="badge-volt text-xs">NEW</span>
          </Link>
          <Link href="/predictor" className="card hover:border-pitch-500/40 transition-all group cursor-pointer text-center space-y-3">
            <div className="text-4xl">🔮</div>
            <h3 className="font-extrabold text-white group-hover:text-pitch-400 transition-colors">Score Predictor</h3>
            <p className="text-white/40 text-xs leading-relaxed">Predict & earn XP</p>
            <span className="badge-green text-xs">+10 XP</span>
          </Link>
          <Link href="/battle" className="card hover:border-fire-400/40 transition-all group cursor-pointer text-center space-y-3">
            <div className="text-4xl">⚔️</div>
            <h3 className="font-extrabold text-white group-hover:text-fire-400 transition-colors">Player Battle</h3>
            <p className="text-white/40 text-xs leading-relaxed">Head-to-head stat wars</p>
            <span className="badge text-xs">VS</span>
          </Link>
          <Link href="/quiz" className="card hover:border-sky-400/40 transition-all group cursor-pointer text-center space-y-3">
            <div className="text-4xl">🧠</div>
            <h3 className="font-extrabold text-white group-hover:text-sky-400 transition-colors">Quiz Zone</h3>
            <p className="text-white/40 text-xs leading-relaxed">10 questions, earn XP</p>
            <span className="badge-sky text-xs">DAILY</span>
          </Link>
        </div>
      </section>

      {/* CTA */}
      <section className="grid md:grid-cols-2 gap-6">
        <div className="card-green border-pitch-600/40 space-y-3">
          <div className="text-4xl">🎙</div>
          <h3 className="text-xl font-extrabold text-white">Interview Your Favourite Player</h3>
          <p className="text-white/50 text-sm leading-relaxed">Read real interviews where kids ask the questions. What do pros eat? How do they train? How nervous do they get?</p>
          <Link href="/interviews" className="btn-primary inline-block text-sm">Read Interviews →</Link>
        </div>
        <div className="card border-volt-500/20 bg-volt-400/5 space-y-3">
          <div className="text-4xl">💬</div>
          <h3 className="text-xl font-extrabold text-white">Debate with Other Kids</h3>
          <p className="text-white/50 text-sm leading-relaxed">Who's the best player? Chat live during matches and debate the big questions with kids your age!</p>
          <Link href="/discussions" className="btn-volt inline-block text-sm">Start Chatting →</Link>
        </div>
      </section>

    </div>
  )
}
