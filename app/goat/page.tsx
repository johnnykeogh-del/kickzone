'use client'

import { useState, useEffect } from 'react'
import SafeImage from '@/components/SafeImage'

// ---- Data ----

const HEAD2HEAD = [
  { label: 'Career Goals',        messi: 838,  ronaldo: 912  },
  { label: 'Career Assists',      messi: 380,  ronaldo: 240  },
  { label: "Ballon d'Or Awards",  messi: 8,    ronaldo: 5    },
  { label: 'World Cup Winner',    messi: 1,    ronaldo: 0    },
  { label: 'Champions Leagues',   messi: 4,    ronaldo: 5    },
  { label: 'League Titles',       messi: 12,   ronaldo: 7    },
  { label: 'Club Trophies',       messi: 44,   ronaldo: 34   },
  { label: 'International Goals', messi: 112,  ronaldo: 135  },
]

interface Legend {
  id: string
  name: string
  wikiName: string
  flag: string
  years: string
  clubs: string
  fact: string
  color: string
  border: string
  text: string
}

const LEGENDS: Legend[] = [
  { id: 'messi',      name: 'Lionel Messi',        wikiName: 'Lionel Messi',           flag: '🇦🇷', years: '2004–',   clubs: 'Barcelona, PSG, Inter Miami',        fact: "8x Ballon d'Or · 2022 World Cup winner",         color: 'from-blue-950 to-blue-800',    border: 'border-blue-500',    text: 'text-blue-400' },
  { id: 'ronaldo',    name: 'Cristiano Ronaldo',    wikiName: 'Cristiano Ronaldo',      flag: '🇵🇹', years: '2002–',   clubs: 'Man Utd, Real Madrid, Juventus',     fact: "912 career goals · 5x Champions League",         color: 'from-red-950 to-red-800',      border: 'border-red-500',     text: 'text-red-400' },
  { id: 'maradona',   name: 'Diego Maradona',       wikiName: 'Diego Maradona',         flag: '🇦🇷', years: '1976–97', clubs: 'Napoli, Barcelona, Boca Juniors',    fact: "Hand of God · 1986 World Cup legend",            color: 'from-sky-950 to-sky-800',      border: 'border-sky-400',     text: 'text-sky-400' },
  { id: 'pele',       name: 'Pelé',                 wikiName: 'Pelé',                   flag: '🇧🇷', years: '1956–77', clubs: 'Santos, New York Cosmos',            fact: "3x World Cup winner · 1,283 career goals",       color: 'from-yellow-950 to-yellow-800',border: 'border-yellow-400',  text: 'text-yellow-400' },
  { id: 'cruyff',     name: 'Johan Cruyff',         wikiName: 'Johan Cruyff',           flag: '🇳🇱', years: '1964–84', clubs: 'Ajax, Barcelona',                    fact: "3x Ballon d'Or · Invented the Cruyff Turn",      color: 'from-orange-950 to-orange-800',border: 'border-orange-400',  text: 'text-orange-400' },
  { id: 'r9',         name: 'Ronaldo R9',           wikiName: 'Ronaldo (Brazilian footballer)', flag: '🇧🇷', years: '1993–2011','clubs': 'Barcelona, Real Madrid, Inter', fact: "2x World Cup winner · 2x Ballon d'Or",           color: 'from-green-950 to-green-800',  border: 'border-green-400',   text: 'text-green-400' },
  { id: 'zidane',     name: 'Zinedine Zidane',      wikiName: 'Zinedine Zidane',        flag: '🇫🇷', years: '1988–2006','clubs': 'Juventus, Real Madrid',            fact: "World Cup 1998 · Ballon d'Or 1998 · €73M man",   color: 'from-purple-950 to-purple-800',border: 'border-purple-400',  text: 'text-purple-400' },
  { id: 'ronaldinho', name: 'Ronaldinho',           wikiName: 'Ronaldinho',             flag: '🇧🇷', years: '1998–2015','clubs': 'PSG, Barcelona, AC Milan',         fact: "2x Ballon d'Or · 2002 World Cup joy",            color: 'from-yellow-950 to-amber-800', border: 'border-amber-400',   text: 'text-amber-400' },
  { id: 'best',       name: 'George Best',          wikiName: 'George Best',            flag: '🇬🇧', years: '1963–84', clubs: 'Manchester United',                  fact: "Ballon d'Or 1968 · 5th Beatle · Man Utd legend",  color: 'from-red-950 to-rose-800',     border: 'border-rose-400',    text: 'text-rose-400' },
  { id: 'henry',      name: 'Thierry Henry',        wikiName: 'Thierry Henry',          flag: '🇫🇷', years: '1994–2012','clubs': 'Arsenal, Barcelona',              fact: "Arsenal's all-time top scorer · World Cup 1998",  color: 'from-red-950 to-red-800',      border: 'border-red-400',     text: 'text-red-400' },
  { id: 'kaka',       name: 'Kaká',                 wikiName: 'Kaká',                   flag: '🇧🇷', years: '2001–17', clubs: 'AC Milan, Real Madrid',              fact: "Ballon d'Or 2007 · Champions League 2003 & 07",  color: 'from-yellow-950 to-yellow-800',border: 'border-yellow-500',  text: 'text-yellow-400' },
  { id: 'iniesta',    name: 'Andrés Iniesta',       wikiName: 'Andrés Iniesta',         flag: '🇪🇸', years: '2002–23', clubs: 'Barcelona, Vissel Kobe',             fact: "WC winner 2010 · 4x Champions League",           color: 'from-blue-950 to-indigo-800',  border: 'border-indigo-400',  text: 'text-indigo-400' },
  { id: 'xavi',       name: 'Xavi Hernández',       wikiName: 'Xavi Hernández',         flag: '🇪🇸', years: '1998–2019','clubs': 'Barcelona, Al Sadd',              fact: "Spain's passing master · 4x Champions League",   color: 'from-blue-950 to-blue-800',    border: 'border-blue-400',    text: 'text-blue-400' },
  { id: 'maldini',    name: 'Paolo Maldini',        wikiName: 'Paolo Maldini',          flag: '🇮🇹', years: '1984–2009','clubs': 'AC Milan',                         fact: "5x Champions League · Greatest ever defender",   color: 'from-red-950 to-red-800',      border: 'border-red-400',     text: 'text-red-400' },
  { id: 'vanbasten',  name: 'Marco van Basten',     wikiName: 'Marco van Basten',       flag: '🇳🇱', years: '1981–95', clubs: 'Ajax, AC Milan',                     fact: "3x Ballon d'Or · Euro 88 overhead goal",         color: 'from-orange-950 to-orange-800',border: 'border-orange-400',  text: 'text-orange-400' },
  { id: 'platini',    name: 'Michel Platini',       wikiName: 'Michel Platini',         flag: '🇫🇷', years: '1972–87', clubs: 'Juventus, Saint-Étienne',            fact: "3 consecutive Ballon d'Or (1983–85)",            color: 'from-blue-950 to-sky-800',     border: 'border-sky-400',     text: 'text-sky-400' },
  { id: 'beckenbauer',name: 'Franz Beckenbauer',    wikiName: 'Franz Beckenbauer',      flag: '🇩🇪', years: '1964–83', clubs: 'Bayern Munich, New York Cosmos',     fact: "WC winner as player & manager · Der Kaiser",     color: 'from-gray-900 to-gray-700',    border: 'border-gray-400',    text: 'text-gray-300' },
  { id: 'puskas',     name: 'Ferenc Puskás',        wikiName: 'Ferenc Puskás',          flag: '🇭🇺', years: '1943–66', clubs: 'Honvéd, Real Madrid',                fact: "84 goals in 85 Hungary games · Real Madrid great",color: 'from-purple-950 to-purple-800',border: 'border-purple-400',  text: 'text-purple-400' },
  { id: 'yashin',     name: 'Lev Yashin',           wikiName: 'Lev Yashin',             flag: '🇷🇺', years: '1949–70', clubs: 'Dynamo Moscow',                      fact: "Only keeper to win Ballon d'Or (1963)",          color: 'from-gray-950 to-gray-800',    border: 'border-gray-500',    text: 'text-gray-300' },
  { id: 'eusebio',    name: 'Eusébio',              wikiName: 'Eusébio',                flag: '🇵🇹', years: '1957–79', clubs: 'Benfica',                             fact: "European Golden Boot 1968 · WC top scorer 1966", color: 'from-red-950 to-amber-800',    border: 'border-amber-500',   text: 'text-amber-400' },
  { id: 'romario',    name: 'Romário',              wikiName: 'Romário',                flag: '🇧🇷', years: '1985–2007','clubs': 'PSV, Barcelona, Flamengo',         fact: "1994 World Cup winner · 1000+ career goals",     color: 'from-yellow-950 to-green-900', border: 'border-green-500',   text: 'text-green-400' },
  { id: 'rivaldo',    name: 'Rivaldo',              wikiName: 'Rivaldo',                flag: '🇧🇷', years: '1993–2015','clubs': 'Barcelona, AC Milan',              fact: "Ballon d'Or 1999 · 2002 World Cup winner",       color: 'from-blue-950 to-yellow-900',  border: 'border-yellow-600',  text: 'text-yellow-400' },
  { id: 'muller',     name: 'Gerd Müller',          wikiName: 'Gerd Müller',            flag: '🇩🇪', years: '1963–81', clubs: 'Bayern Munich',                      fact: "WC 1974 winner · 68 Bundesliga goals in a season",color:'from-red-950 to-gray-800',     border: 'border-gray-400',    text: 'text-gray-300' },
  { id: 'rcarlosa',   name: 'Roberto Carlos',       wikiName: 'Roberto Carlos',         flag: '🇧🇷', years: '1991–2011','clubs': 'Inter, Real Madrid, Fenerbahçe',  fact: "That free-kick vs France 1997 · WC 2002 winner", color: 'from-green-950 to-yellow-900', border: 'border-yellow-500',  text: 'text-yellow-400' },
  { id: 'garrincha',  name: 'Garrincha',            wikiName: 'Garrincha',              flag: '🇧🇷', years: '1953–72', clubs: 'Botafogo',                            fact: "2x World Cup winner · Pelé's wing partner",      color: 'from-green-950 to-green-800',  border: 'border-green-400',   text: 'text-green-400' },
]

// ---- Component ----

export default function GoatPage() {
  const [h2hVote, setH2hVote]   = useState<'messi' | 'ronaldo' | null>(null)
  const [h2hCounts, setH2hCounts] = useState({ messi: 5842, ronaldo: 5317 })
  const [goatVotes, setGoatVotes] = useState<Record<string, number>>({})
  const [myGoat, setMyGoat]     = useState<string | null>(null)

  useEffect(() => {
    const v = localStorage.getItem('kickzone_goat_vote') as 'messi' | 'ronaldo' | null
    const c = localStorage.getItem('kickzone_goat_counts')
    const gv = localStorage.getItem('kickzone_all_goat_votes')
    const mg = localStorage.getItem('kickzone_my_goat')
    if (v) setH2hVote(v)
    if (c) setH2hCounts(JSON.parse(c))
    if (gv) setGoatVotes(JSON.parse(gv))
    if (mg) setMyGoat(mg)
  }, [])

  const voteH2H = (pick: 'messi' | 'ronaldo') => {
    if (h2hVote) return
    const next = { ...h2hCounts, [pick]: h2hCounts[pick] + 1 }
    setH2hCounts(next); setH2hVote(pick)
    localStorage.setItem('kickzone_goat_vote', pick)
    localStorage.setItem('kickzone_goat_counts', JSON.stringify(next))
  }

  const voteGoat = (id: string) => {
    if (myGoat) return
    const next = { ...goatVotes, [id]: (goatVotes[id] || 0) + 1 }
    setGoatVotes(next); setMyGoat(id)
    localStorage.setItem('kickzone_all_goat_votes', JSON.stringify(next))
    localStorage.setItem('kickzone_my_goat', id)
  }

  const h2hTotal     = h2hCounts.messi + h2hCounts.ronaldo
  const messiPct     = h2hTotal ? Math.round((h2hCounts.messi / h2hTotal) * 100) : 50
  const ronaldoPct   = 100 - messiPct
  const goatTotal    = Object.values(goatVotes).reduce((a, b) => a + b, 0)

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-10">

      {/* Header */}
      <div className="text-center">
        <div className="text-6xl mb-3">🐐</div>
        <h1 className="text-4xl font-extrabold text-white mb-2">The GOAT <span className="text-volt-400">Debate</span></h1>
        <p className="text-white/50 text-lg">Who is the Greatest Footballer of All Time?</p>
      </div>

      {/* Messi vs Ronaldo battle */}
      <section className="space-y-4">
        <h2 className="text-xl font-extrabold text-white text-center">⚔️ The Modern Debate: Messi vs Ronaldo</h2>

        {h2hVote && (
          <div className="card space-y-2">
            <div className="flex justify-between text-sm font-bold">
              <span className="text-blue-400">🔵 Messi — {messiPct}%</span>
              <span className="text-red-400">Ronaldo — {ronaldoPct}% 🔴</span>
            </div>
            <div className="h-4 bg-red-700 rounded-full overflow-hidden">
              <div className="h-full bg-blue-600 rounded-full transition-all duration-700" style={{ width: `${messiPct}%` }} />
            </div>
            <p className="text-center text-white/30 text-xs">{h2hTotal.toLocaleString()} votes</p>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-6">
          {([
            { key: 'messi'   as const, name: 'Lionel Messi',     flag: '🇦🇷', age: 37, club: 'Inter Miami',  wikiName: 'Lionel Messi',      color: 'from-blue-900 to-blue-700', border: 'border-blue-500', text: 'text-blue-400',
              facts: ["🏅 8x Ballon d'Or — most ever","🇦🇷 Led Argentina to 2022 World Cup glory","⚽ 474 La Liga goals — all-time record","🎯 380 career assists — unprecedented","📈 91 goals in one calendar year (2012)"] },
            { key: 'ronaldo' as const, name: 'Cristiano Ronaldo', flag: '🇵🇹', age: 39, club: 'Al Nassr',    wikiName: 'Cristiano Ronaldo', color: 'from-red-900 to-red-700',  border: 'border-red-500',  text: 'text-red-400',
              facts: ["🏆 5x Champions League winner","🌍 International top scorer — 135 goals","💪 Won titles in England, Spain, Italy","🔥 First player to score 900 career goals","🥇 Won leagues in 4 different countries"] },
          ]).map(p => (
            <div key={p.key} className={`rounded-3xl border-2 ${p.border} bg-gradient-to-b ${p.color} p-6 space-y-4`}>
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-white/20 shrink-0 bg-black/20">
                  <SafeImage src={`/api/player-image/${encodeURIComponent(p.wikiName)}`} alt={p.name} className="w-full h-full object-cover object-top" fallback="⚽" />
                </div>
                <div>
                  <h3 className="text-2xl font-extrabold text-white">{p.name}</h3>
                  <p className="text-white/50 text-sm">{p.flag} Age {p.age} · {p.club}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {HEAD2HEAD.slice(0, 4).map(s => (
                  <div key={s.label} className="bg-black/20 rounded-xl p-2.5 text-center border border-white/10">
                    <div className={`text-xl font-extrabold ${p.text}`}>{(p.key === 'messi' ? s.messi : s.ronaldo).toLocaleString()}</div>
                    <div className="text-white/40 text-xs leading-tight">{s.label}</div>
                  </div>
                ))}
              </div>
              <div className="space-y-1.5">
                {p.facts.map(f => <div key={f} className="text-sm text-white/70">{f}</div>)}
              </div>
              <button onClick={() => voteH2H(p.key)} disabled={!!h2hVote}
                className={`w-full py-4 rounded-2xl text-lg font-extrabold transition-all ${
                  h2hVote === p.key ? `${p.border} border-2 bg-white/10 text-white` :
                  h2hVote ? 'border border-white/10 text-white/30 cursor-default' :
                  `border-2 ${p.border} text-white hover:bg-white/10 cursor-pointer`
                }`}>
                {h2hVote === p.key ? '✅ Your vote!' : h2hVote ? `${p.key === 'messi' ? messiPct : ronaldoPct}% voted here` : `🗳 Vote for ${p.name.split(' ')[0]}`}
              </button>
            </div>
          ))}
        </div>

        {/* Head-to-head table */}
        <div className="card overflow-hidden p-0">
          <div className="px-4 py-3 bg-white/5 border-b border-white/5 text-center">
            <h3 className="font-extrabold text-white">📊 Head to Head Stats</h3>
          </div>
          {HEAD2HEAD.map((s, i) => (
            <div key={s.label} className={`grid grid-cols-3 items-center px-4 py-3 ${i < HEAD2HEAD.length - 1 ? 'border-b border-white/5' : ''}`}>
              <div className={`text-center text-base font-extrabold ${s.messi > s.ronaldo ? 'text-blue-400' : 'text-white/40'}`}>{s.messi.toLocaleString()} {s.messi > s.ronaldo && '👑'}</div>
              <div className="text-center text-xs text-white/40 font-semibold px-2">{s.label}</div>
              <div className={`text-center text-base font-extrabold ${s.ronaldo > s.messi ? 'text-red-400' : 'text-white/40'}`}>{s.ronaldo > s.messi && '👑'} {s.ronaldo.toLocaleString()}</div>
            </div>
          ))}
        </div>
      </section>

      {/* All-time GOAT vote */}
      <section className="space-y-5">
        <div className="text-center">
          <h2 className="text-2xl font-extrabold text-white">🏆 Who's YOUR All-Time GOAT?</h2>
          <p className="text-white/40 text-sm mt-1">From every era — vote for the one player you think is the greatest ever</p>
          {myGoat && goatTotal > 0 && (
            <p className="text-volt-400 text-sm font-bold mt-2">You voted! · {goatTotal.toLocaleString()} total votes</p>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
          {LEGENDS.map(l => {
            const votes  = goatVotes[l.id] || 0
            const pct    = goatTotal ? Math.round((votes / goatTotal) * 100) : 0
            const isMyPick = myGoat === l.id
            return (
              <button key={l.id} onClick={() => voteGoat(l.id)} disabled={!!myGoat}
                className={`rounded-2xl border-2 bg-gradient-to-b ${l.color} p-3 text-left transition-all hover:scale-[1.02] ${
                  isMyPick ? `${l.border} ring-2 ring-volt-400` :
                  myGoat   ? 'border-white/10 opacity-60' :
                  `${l.border} hover:opacity-90`
                } ${!myGoat ? 'cursor-pointer' : 'cursor-default'}`}>
                <div className="w-full aspect-square rounded-xl overflow-hidden bg-black/30 mb-2">
                  <SafeImage src={`/api/player-image/${encodeURIComponent(l.wikiName)}`} alt={l.name} className="w-full h-full object-cover object-top" fallback="⚽" />
                </div>
                <p className={`font-extrabold text-xs leading-tight ${l.text}`}>{l.name}</p>
                <p className="text-white/40 text-[10px] mt-0.5">{l.flag} {l.years}</p>
                <p className="text-white/30 text-[10px] leading-tight mt-0.5 line-clamp-2">{l.fact}</p>
                {myGoat && (
                  <div className="mt-1.5">
                    <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full bg-gradient-to-r ${l.color.replace('from-', 'from-').replace('to-', 'to-')}`}
                           style={{ width: `${pct}%`, backgroundColor: 'currentColor' }} />
                    </div>
                    <p className="text-[10px] text-white/40 mt-0.5 text-center">{pct}%{isMyPick ? ' ✅' : ''}</p>
                  </div>
                )}
              </button>
            )
          })}
        </div>
      </section>

    </div>
  )
}
