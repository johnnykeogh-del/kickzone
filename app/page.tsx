import Link from 'next/link'
import { TOP_PLAYERS, getTodaysMatches, getFootballNews } from '@/lib/football'
import SafeImage from '@/components/SafeImage'

export default async function HomePage() {
  const [matches, latestNews] = await Promise.all([getTodaysMatches(), getFootballNews()])
  const featuredPlayers = TOP_PLAYERS.slice(0, 4)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">

      {/* Hero */}
      <section className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-pitch-900 via-pitch-800 to-dark-800 border border-pitch-700/30 p-8 md:p-12">
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '32px 32px' }} />
        <div className="relative z-10 max-w-2xl">
          <h1 className="text-4xl md:text-6xl font-extrabold text-white leading-tight mb-2">
            Football Life<br/>
            <span className="text-pitch-400">for Kids</span>
          </h1>
          <p className="text-white/50 text-base mb-5">Football news, games &amp; legends — all in one place ⚽</p>
          <div className="flex flex-wrap gap-2 mb-8">
            <Link href="/leagues"     className="badge-green hover:opacity-80 transition-opacity cursor-pointer">⚡ Live Season 2025/26</Link>
            <Link href="/leagues"     className="badge-volt hover:opacity-80 transition-opacity cursor-pointer">🏆 Global Coverage</Link>
            <Link href="/#news"       className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-blue-500/20 text-blue-400 border border-blue-500/30 hover:opacity-80 transition-opacity cursor-pointer">📰 Live BBC News</Link>
            <Link href="/players"     className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-purple-500/20 text-purple-400 border border-purple-500/30 hover:opacity-80 transition-opacity cursor-pointer">⚽ 2,500+ Players</Link>
            <Link href="/cardgame"    className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-orange-500/20 text-orange-400 border border-orange-500/30 hover:opacity-80 transition-opacity cursor-pointer">🃏 Card Battle Game</Link>
            <Link href="/goat"        className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 hover:opacity-80 transition-opacity cursor-pointer">🏆 GOAT Legends</Link>
            <Link href="/#streamers"  className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-red-500/20 text-red-400 border border-red-500/30 hover:opacity-80 transition-opacity cursor-pointer">📺 Top YouTubers</Link>
            <Link href="/#skills"     className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-green-500/20 text-green-400 border border-green-500/30 hover:opacity-80 transition-opacity cursor-pointer">💪 Skills Channels</Link>
            <Link href="/wonderkids"  className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-pink-500/20 text-pink-400 border border-pink-500/30 hover:opacity-80 transition-opacity cursor-pointer">🌟 Wonderkids</Link>
            <Link href="/discussions" className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-teal-500/20 text-teal-400 border border-teal-500/30 hover:opacity-80 transition-opacity cursor-pointer">💬 Match Chat</Link>
          </div>
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
      <section id="news">
        <h2 className="section-title mb-5">🔥 Latest Football News</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {latestNews.map(news => {
            const inner = (
              <div className="card hover:border-white/20 transition-all group cursor-pointer h-full">
                <div className="flex items-center justify-between mb-3">
                  <span className="badge-green">{news.tag}</span>
                  {news.hot && <span className="badge-fire">🔥 Hot</span>}
                </div>
                <div className="text-4xl mb-3">{news.image}</div>
                <h3 className="font-bold text-white leading-snug mb-2 group-hover:text-pitch-400 transition-colors">{news.title}</h3>
                <p className="text-sm text-white/50 line-clamp-3 leading-relaxed">{news.summary}</p>
                <p className="text-xs text-white/20 mt-3">{news.time} · BBC Sport</p>
              </div>
            )
            return news.link
              ? <a key={news.id} href={news.link} target="_blank" rel="noopener noreferrer">{inner}</a>
              : <div key={news.id}>{inner}</div>
          })}
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
                  <SafeImage src={`/api/player-image/${encodeURIComponent(player.name)}`} alt={player.name} className="w-full h-full object-cover object-top" fallback="⚽" />
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
          <Link href="/penalty" className="card hover:border-volt-500/40 transition-all group cursor-pointer text-center space-y-3">
            <div className="text-4xl">⚽</div>
            <h3 className="font-extrabold text-white group-hover:text-volt-400 transition-colors">Penalty Shootout</h3>
            <p className="text-white/40 text-xs leading-relaxed">5 kicks vs the keeper</p>
            <span className="badge-volt text-xs">+XP</span>
          </Link>
          <Link href="/wordle" className="card hover:border-green-400/40 transition-all group cursor-pointer text-center space-y-3">
            <div className="text-4xl">🟩</div>
            <h3 className="font-extrabold text-white group-hover:text-green-400 transition-colors">Footie Wordle</h3>
            <p className="text-white/40 text-xs leading-relaxed">Guess today's mystery player</p>
            <span className="badge-green text-xs">DAILY</span>
          </Link>
          <Link href="/diary" className="card hover:border-pitch-500/40 transition-all group cursor-pointer text-center space-y-3">
            <div className="text-4xl">📓</div>
            <h3 className="font-extrabold text-white group-hover:text-pitch-400 transition-colors">My Diary</h3>
            <p className="text-white/40 text-xs leading-relaxed">Track your own matches</p>
            <span className="badge text-xs">PERSONAL</span>
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

      {/* Streamers */}
      <section id="streamers">
        <div className="flex items-center gap-3 mb-2">
          <h2 className="section-title">📺 Football YouTubers & Streamers</h2>
        </div>
        <p className="text-white/40 text-sm mb-5">The biggest football creators kids are watching right now — skills, FIFA packs, pro interviews and challenges!</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {[
            { name: 'F2 / Pro Football Academy', emoji: '🎯', desc: 'Insane skill moves & freestyle tricks', subs: '14M+ subs', url: 'https://www.youtube.com/@thef2', platform: 'YouTube' },
            { name: 'Theo Baker',    emoji: '🎙', desc: 'Ambushes pro players with funny interviews', subs: '4M+ subs', url: 'https://www.youtube.com/@TheoBaker', platform: 'YouTube' },
            { name: 'ChrisMD',       emoji: '🃏', desc: 'FC card packs, challenges & football fun', subs: '7M+ subs', url: 'https://www.youtube.com/@ChrisMD', platform: 'YouTube' },
            { name: 'Spencer FC',    emoji: '⚽', desc: 'Hashtag United & football challenges', subs: '1.5M+ subs', url: 'https://www.youtube.com/@SpencerFC', platform: 'YouTube' },
            { name: 'W2S',           emoji: '🔥', desc: 'FIFA & football with a massive fanbase', subs: '16M+ subs', url: 'https://www.youtube.com/@W2S', platform: 'YouTube' },
            { name: 'Calfreezy',     emoji: '❄️', desc: 'Football videos & hilarious challenges', subs: '2M+ subs', url: 'https://www.youtube.com/@Calfreezy', platform: 'YouTube' },
            { name: 'GOAL',          emoji: '🏆', desc: 'Official highlights, news & top goals', subs: '15M+ subs', url: 'https://www.youtube.com/@goal', platform: 'YouTube' },
            { name: 'Wingrove Family', emoji: '👨‍👩‍👦', desc: 'Family football fun, challenges & vlogs', subs: '', url: 'https://www.youtube.com/channel/UCyY4jVInowKG9Nm20xXGHFw', platform: 'YouTube' },
          ].map(s => (
            <a key={s.name} href={s.url} target="_blank" rel="noopener noreferrer"
               className="card hover:border-red-500/40 transition-all group cursor-pointer text-center space-y-2 hover:scale-[1.02]">
              <div className="text-3xl">{s.emoji}</div>
              <h3 className="font-extrabold text-white text-sm group-hover:text-red-400 transition-colors leading-tight">{s.name}</h3>
              <p className="text-white/40 text-xs leading-relaxed">{s.desc}</p>
              {s.subs && (
                <div className="flex items-center justify-center gap-1.5 pt-1">
                  <span className="text-[10px] bg-red-600/20 text-red-400 font-bold px-2 py-0.5 rounded-full">▶ {s.subs}</span>
                </div>
              )}
            </a>
          ))}
        </div>
      </section>

      {/* Training & Skills */}
      <section id="skills">
        <div className="flex items-center gap-3 mb-2">
          <h2 className="section-title">⚽ Training & Skills Channels</h2>
        </div>
        <p className="text-white/40 text-sm mb-5">Want to actually get better? These channels will teach you real skills, drills and techniques used by professional players!</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {[
            { name: 'Efford Elite',       emoji: '🎓', desc: 'Pro footballer sharing real training tips & tutorials', url: 'https://www.youtube.com/@EffordElite' },
            { name: 'Joner Football',     emoji: '🏃', desc: 'World Top 10 trainer — full individual & group sessions', url: 'https://www.youtube.com/channel/UC5wlBUZsx1r2IsO9-rvON6Q' },
            { name: 'Progressive Soccer', emoji: '📈', desc: 'Technique, speed, fitness & mindset with Coach Dylan', url: 'https://www.youtube.com/progressivesoccer' },
            { name: 'Coerver Coaching',   emoji: '🏅', desc: 'World-famous ball mastery & 1v1 skills programme', url: 'https://www.youtube.com/channel/UCh-plXXdM0j7JJXMoGnk2Pw' },
            { name: '7MLC',               emoji: '🔄', desc: 'Dribbling, turns & ball mastery drills you can do at home', url: 'https://www.youtube.com/channel/UC9xRcqG8V6yNi6Hum92EoGg' },
            { name: 'SkillTwins',         emoji: '👯', desc: 'Pro twin brothers showing you skills step by step', url: 'https://www.youtube.com/@SkillTwins' },
          ].map(s => (
            <a key={s.name} href={s.url} target="_blank" rel="noopener noreferrer"
               className="card hover:border-pitch-500/40 transition-all group cursor-pointer text-center space-y-2 hover:scale-[1.02]">
              <div className="text-3xl">{s.emoji}</div>
              <h3 className="font-extrabold text-white text-sm group-hover:text-pitch-400 transition-colors leading-tight">{s.name}</h3>
              <p className="text-white/40 text-xs leading-relaxed">{s.desc}</p>
              <div className="flex items-center justify-center pt-1">
                <span className="text-[10px] bg-pitch-500/20 text-pitch-400 font-bold px-2 py-0.5 rounded-full">▶ Watch on YouTube</span>
              </div>
            </a>
          ))}
        </div>
      </section>

    </div>
  )
}
