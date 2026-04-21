'use client'

import { useState, useEffect, useCallback } from 'react'

// ─── Shared data ────────────────────────────────────────────────
const CLUBS = [
  { name: 'Arsenal',          crest: 'https://crests.football-data.org/57.png',   league: 'PL' },
  { name: 'Liverpool',        crest: 'https://crests.football-data.org/64.png',   league: 'PL' },
  { name: 'Manchester City',  crest: 'https://crests.football-data.org/65.png',   league: 'PL' },
  { name: 'Chelsea',          crest: 'https://crests.football-data.org/61.png',   league: 'PL' },
  { name: 'Manchester United',crest: 'https://crests.football-data.org/66.png',   league: 'PL' },
  { name: 'Tottenham',        crest: 'https://crests.football-data.org/73.png',   league: 'PL' },
  { name: 'Newcastle',        crest: 'https://crests.football-data.org/354.png',  league: 'PL' },
  { name: 'Aston Villa',      crest: 'https://crests.football-data.org/397.png',  league: 'PL' },
  { name: 'Real Madrid',      crest: 'https://crests.football-data.org/86.png',   league: 'PD' },
  { name: 'Barcelona',        crest: 'https://crests.football-data.org/81.png',   league: 'PD' },
  { name: 'Atlético Madrid',  crest: 'https://crests.football-data.org/77.png',   league: 'PD' },
  { name: 'Bayern Munich',    crest: 'https://crests.football-data.org/5.png',    league: 'BL1' },
  { name: 'Borussia Dortmund',crest: 'https://crests.football-data.org/4.png',    league: 'BL1' },
  { name: 'Bayer Leverkusen', crest: 'https://crests.football-data.org/3.png',    league: 'BL1' },
  { name: 'PSG',              crest: 'https://crests.football-data.org/524.png',  league: 'FL1' },
  { name: 'Inter Milan',      crest: 'https://crests.football-data.org/98.png',   league: 'SA' },
  { name: 'AC Milan',         crest: 'https://crests.football-data.org/100.png',  league: 'SA' },
  { name: 'Juventus',         crest: 'https://crests.football-data.org/109.png',  league: 'SA' },
  { name: 'Napoli',           crest: 'https://crests.football-data.org/108.png',  league: 'SA' },
  { name: 'Benfica',          crest: 'https://crests.football-data.org/503.png',  league: 'PPL' },
  { name: 'Porto',            crest: 'https://crests.football-data.org/497.png',  league: 'PPL' },
  { name: 'Sporting CP',      crest: 'https://crests.football-data.org/498.png',  league: 'PPL' },
  { name: 'Monaco',           crest: 'https://crests.football-data.org/532.png',  league: 'FL1' },
  { name: 'RB Leipzig',       crest: 'https://crests.football-data.org/11.png',   league: 'BL1' },
]

const PLAYERS = [
  { name: 'Erling Haaland',   photo: 'https://img.a.transfermarkt.technology/portrait/big/418560-1701275689.jpg',  team: 'Man City' },
  { name: 'Kylian Mbappé',    photo: 'https://img.a.transfermarkt.technology/portrait/big/342229-1682683695.jpg',  team: 'Real Madrid' },
  { name: 'Vinicius Jr.',      photo: 'https://img.a.transfermarkt.technology/portrait/big/371998-1695892614.jpg',  team: 'Real Madrid' },
  { name: 'Bukayo Saka',       photo: 'https://img.a.transfermarkt.technology/portrait/big/433177-1695897072.jpg',  team: 'Arsenal' },
  { name: 'Jude Bellingham',   photo: 'https://img.a.transfermarkt.technology/portrait/big/581678-1695892766.jpg',  team: 'Real Madrid' },
  { name: 'Mohamed Salah',     photo: 'https://img.a.transfermarkt.technology/portrait/big/148669-1695893577.jpg',  team: 'Liverpool' },
  { name: 'Harry Kane',        photo: 'https://img.a.transfermarkt.technology/portrait/big/132098-1695893440.jpg',  team: 'Bayern Munich' },
  { name: 'Lamine Yamal',      photo: 'https://img.a.transfermarkt.technology/portrait/big/945518-1695893343.jpg',  team: 'Barcelona' },
  { name: 'Phil Foden',        photo: 'https://img.a.transfermarkt.technology/portrait/big/406635-1695893168.jpg',  team: 'Man City' },
  { name: 'Florian Wirtz',     photo: 'https://img.a.transfermarkt.technology/portrait/big/521361-1695893792.jpg',  team: 'Leverkusen' },
  { name: 'Pedri',             photo: 'https://img.a.transfermarkt.technology/portrait/big/557802-1695893692.jpg',  team: 'Barcelona' },
  { name: 'Lionel Messi',      photo: 'https://img.a.transfermarkt.technology/portrait/big/28003-1698411706.jpg',   team: 'Inter Miami' },
]

const TRUE_FALSE = [
  { statement: "Cristiano Ronaldo has scored over 900 career goals", answer: true,  fact: "He passed 900 goals in 2024 — the first player ever to do it! 🐐" },
  { statement: "The Premier League was founded in 1992", answer: true,  fact: "The Premier League replaced the old First Division in 1992! ✅" },
  { statement: "A football pitch must be exactly 100 metres long", answer: false, fact: "Pitches can be between 90-120 metres long — there's no exact size! 📏" },
  { statement: "Lionel Messi has won 8 Ballon d'Or awards", answer: true,  fact: "Messi won his 8th in 2023 — the most ever by any player! 🏅" },
  { statement: "Brazil has won the World Cup 6 times", answer: false, fact: "Brazil have won it 5 times — 1958, 1962, 1970, 1994 and 2002! 🇧🇷" },
  { statement: "A goalkeeper can pick the ball up from a back pass", answer: false, fact: "Since 1992, keepers can't use their hands for a deliberate back pass! 🚫" },
  { statement: "The Champions League was previously called the European Cup", answer: true,  fact: "It was the European Cup from 1955 until 1992, then renamed! 🏆" },
  { statement: "Lamine Yamal was born the day before the 2006 World Cup final", answer: true,  fact: "He was born on 13 July 2007 — the day before the 2006 final! 🤯" },
  { statement: "A yellow card was used for the first time in the 1970 World Cup", answer: true,  fact: "Cards were introduced at Mexico 1970 after referee confusion in 1966! 🟨" },
  { statement: "Erling Haaland's dad played professional football", answer: true,  fact: "Alfie Haaland played for Man City and Norway — football runs in the family! 👨‍👦" },
  { statement: "The offside rule requires 2 defenders between the attacker and the goal", answer: true,  fact: "You need at least 2 defenders (including the keeper) — not just one! 🚩" },
  { statement: "Real Madrid have won the Champions League more than any other club", answer: true,  fact: "Real Madrid have won it 15 times — nearly double the next club! 👑" },
  { statement: "A football is perfectly round", answer: false, fact: "A football is actually a truncated icosahedron — 20 hexagons and 12 pentagons! 🔢" },
  { statement: "Penalty shootouts were first used in a World Cup in 1982", answer: true,  fact: "The first World Cup shootout was West Germany vs France in 1982! 😬" },
  { statement: "Jude Bellingham played for Birmingham City before Dortmund", answer: true,  fact: "He made his debut for Birmingham at just 16 years old! 🔵" },
]

const PL_CLUBS_20 = [
  'Arsenal','Aston Villa','Bournemouth','Brentford','Brighton','Chelsea',
  'Crystal Palace','Everton','Fulham','Ipswich','Leicester','Liverpool',
  'Manchester City','Manchester United','Newcastle','Nottingham Forest',
  'Southampton','Tottenham','West Ham','Wolves'
]

function shuffle<T>(arr: T[]): T[] { return [...arr].sort(() => Math.random() - 0.5) }
function pick<T>(arr: T[], n: number): T[] { return shuffle(arr).slice(0, n) }

function addXP(n: number) {
  const current = parseInt(localStorage.getItem('kickzone_xp') || '0')
  localStorage.setItem('kickzone_xp', String(current + n))
}

// ─── Badge Quiz ──────────────────────────────────────────────────
function BadgeGame() {
  const TOTAL = 10
  const [questions] = useState(() => pick(CLUBS, TOTAL))
  const [idx, setIdx] = useState(0)
  const [options, setOptions] = useState<string[]>([])
  const [selected, setSelected] = useState<string | null>(null)
  const [score, setScore] = useState(0)
  const [done, setDone] = useState(false)
  const [imgError, setImgError] = useState(false)

  const buildOptions = useCallback((qi: number) => {
    const correct = questions[qi].name
    const wrong = shuffle(CLUBS.filter(c => c.name !== correct)).slice(0, 3).map(c => c.name)
    setOptions(shuffle([correct, ...wrong]))
    setImgError(false)
  }, [questions])

  useEffect(() => { if (questions.length) buildOptions(0) }, [buildOptions, questions])

  const handleAnswer = (opt: string) => {
    if (selected) return
    setSelected(opt)
    const correct = opt === questions[idx].name
    if (correct) { setScore(s => s + 1); addXP(5) }
    setTimeout(() => {
      if (idx + 1 >= TOTAL) { setDone(true) }
      else { setIdx(i => i + 1); buildOptions(idx + 1); setSelected(null) }
    }, 1000)
  }

  if (done) return (
    <div className="text-center py-8 space-y-4">
      <div className="text-6xl">{score >= 8 ? '🏆' : score >= 5 ? '⭐' : '⚽'}</div>
      <div className="text-3xl font-extrabold text-white">{score} / {TOTAL}</div>
      <p className="text-white/50">{score >= 8 ? 'Badge master! 🔥' : score >= 5 ? 'Not bad!' : 'Keep practising!'}</p>
      <p className="text-volt-400 font-bold">+{score * 5} XP earned!</p>
      <button onClick={() => window.location.reload()} className="btn-primary px-6 py-2">Play Again 🔄</button>
    </div>
  )

  const q = questions[idx]
  return (
    <div className="space-y-6">
      <div className="flex justify-between text-sm text-white/40 font-semibold">
        <span>Question {idx + 1} / {TOTAL}</span>
        <span className="text-volt-400">Score: {score}</span>
      </div>
      <div className="h-1.5 bg-dark-700 rounded-full"><div className="h-full bg-pitch-500 rounded-full transition-all" style={{ width: `${(idx / TOTAL) * 100}%` }} /></div>
      <div className="text-center">
        <p className="text-white/50 text-sm mb-4 font-semibold">🛡 Which club is this?</p>
        <div className="w-36 h-36 mx-auto flex items-center justify-center">
          {imgError ? <span className="text-7xl">🛡</span> : (
            <img src={q.crest} alt="?" className="w-full h-full object-contain drop-shadow-2xl" onError={() => setImgError(true)} />
          )}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {options.map(opt => {
          const isCorrect = opt === q.name
          const isSelected = opt === selected
          let style = 'border-white/10 bg-dark-700/50 text-white hover:border-pitch-500/40 cursor-pointer'
          if (selected) {
            if (isCorrect) style = 'border-pitch-500 bg-pitch-900/50 text-pitch-400'
            else if (isSelected) style = 'border-red-500 bg-red-900/30 text-red-300'
            else style = 'border-white/5 bg-dark-700/20 text-white/20 cursor-default'
          }
          return (
            <button key={opt} onClick={() => handleAnswer(opt)} disabled={!!selected}
              className={`border-2 rounded-2xl px-4 py-3 font-bold text-sm transition-all ${style}`}>
              {opt}
            </button>
          )
        })}
      </div>
    </div>
  )
}

// ─── Silhouette Game ─────────────────────────────────────────────
function SilhouetteGame() {
  const TOTAL = 8
  const [questions] = useState(() => pick(PLAYERS, TOTAL))
  const [idx, setIdx] = useState(0)
  const [options, setOptions] = useState<string[]>([])
  const [selected, setSelected] = useState<string | null>(null)
  const [revealed, setRevealed] = useState(false)
  const [score, setScore] = useState(0)
  const [done, setDone] = useState(false)

  const buildOptions = useCallback((qi: number) => {
    const correct = questions[qi].name
    const wrong = shuffle(PLAYERS.filter(p => p.name !== correct)).slice(0, 3).map(p => p.name)
    setOptions(shuffle([correct, ...wrong]))
  }, [questions])

  useEffect(() => { if (questions.length) buildOptions(0) }, [buildOptions, questions])

  const handleAnswer = (opt: string) => {
    if (selected) return
    setSelected(opt)
    setRevealed(true)
    const correct = opt === questions[idx].name
    if (correct) { setScore(s => s + 1); addXP(5) }
    setTimeout(() => {
      if (idx + 1 >= TOTAL) setDone(true)
      else { setIdx(i => i + 1); buildOptions(idx + 1); setSelected(null); setRevealed(false) }
    }, 1500)
  }

  if (done) return (
    <div className="text-center py-8 space-y-4">
      <div className="text-6xl">{score >= 6 ? '🏆' : score >= 4 ? '⭐' : '⚽'}</div>
      <div className="text-3xl font-extrabold text-white">{score} / {TOTAL}</div>
      <p className="text-white/50">{score >= 6 ? 'Incredible! You know your players! 🔥' : 'Not bad at all!'}</p>
      <p className="text-volt-400 font-bold">+{score * 5} XP earned!</p>
      <button onClick={() => window.location.reload()} className="btn-primary px-6 py-2">Play Again 🔄</button>
    </div>
  )

  const q = questions[idx]
  return (
    <div className="space-y-6">
      <div className="flex justify-between text-sm text-white/40 font-semibold">
        <span>Question {idx + 1} / {TOTAL}</span>
        <span className="text-volt-400">Score: {score}</span>
      </div>
      <div className="h-1.5 bg-dark-700 rounded-full"><div className="h-full bg-volt-400 rounded-full transition-all" style={{ width: `${(idx / TOTAL) * 100}%` }} /></div>
      <div className="text-center">
        <p className="text-white/50 text-sm mb-4 font-semibold">👤 Who is this player?</p>
        <div className="w-36 h-36 mx-auto rounded-full overflow-hidden border-4 border-white/10">
          <img
            src={q.photo} alt="?"
            className="w-full h-full object-cover object-top transition-all duration-500"
            style={{ filter: revealed ? 'none' : 'brightness(0) saturate(0)' }}
          />
        </div>
        {revealed && <p className="text-pitch-400 font-extrabold mt-2">{q.name} — {q.team}</p>}
      </div>
      <div className="grid grid-cols-2 gap-3">
        {options.map(opt => {
          const isCorrect = opt === q.name
          const isSelected = opt === selected
          let style = 'border-white/10 bg-dark-700/50 text-white hover:border-volt-400/40 cursor-pointer'
          if (selected) {
            if (isCorrect) style = 'border-pitch-500 bg-pitch-900/50 text-pitch-400'
            else if (isSelected) style = 'border-red-500 bg-red-900/30 text-red-300'
            else style = 'border-white/5 bg-dark-700/20 text-white/20 cursor-default'
          }
          return (
            <button key={opt} onClick={() => handleAnswer(opt)} disabled={!!selected}
              className={`border-2 rounded-2xl px-4 py-3 font-bold text-sm transition-all ${style}`}>
              {opt}
            </button>
          )
        })}
      </div>
    </div>
  )
}

// ─── True or False ───────────────────────────────────────────────
function TrueFalseGame() {
  const TOTAL = 10
  const [questions] = useState(() => pick(TRUE_FALSE, TOTAL))
  const [idx, setIdx] = useState(0)
  const [answered, setAnswered] = useState<boolean | null>(null)
  const [score, setScore] = useState(0)
  const [done, setDone] = useState(false)

  const handleAnswer = (ans: boolean) => {
    if (answered !== null) return
    setAnswered(ans)
    const correct = ans === questions[idx].answer
    if (correct) { setScore(s => s + 1); addXP(3) }
    setTimeout(() => {
      if (idx + 1 >= TOTAL) setDone(true)
      else { setIdx(i => i + 1); setAnswered(null) }
    }, 1800)
  }

  if (done) return (
    <div className="text-center py-8 space-y-4">
      <div className="text-6xl">{score >= 8 ? '🧠' : score >= 5 ? '⭐' : '🤔'}</div>
      <div className="text-3xl font-extrabold text-white">{score} / {TOTAL}</div>
      <p className="text-white/50">{score >= 8 ? 'Football genius! 🔥' : score >= 5 ? 'Pretty good!' : 'Keep learning!'}</p>
      <p className="text-volt-400 font-bold">+{score * 3} XP earned!</p>
      <button onClick={() => window.location.reload()} className="btn-primary px-6 py-2">Play Again 🔄</button>
    </div>
  )

  const q = questions[idx]
  const correct = answered !== null && answered === q.answer
  const wrong = answered !== null && answered !== q.answer

  return (
    <div className="space-y-6">
      <div className="flex justify-between text-sm text-white/40 font-semibold">
        <span>Question {idx + 1} / {TOTAL}</span>
        <span className="text-volt-400">Score: {score}</span>
      </div>
      <div className="h-1.5 bg-dark-700 rounded-full"><div className="h-full bg-fire-500 rounded-full transition-all" style={{ width: `${(idx / TOTAL) * 100}%` }} /></div>
      <div className="card py-8 text-center min-h-32 flex items-center justify-center">
        <p className="text-lg font-bold text-white leading-snug">{q.statement}</p>
      </div>
      {answered !== null && (
        <div className={`rounded-2xl p-4 border text-sm font-semibold ${correct ? 'border-pitch-500/40 bg-pitch-900/40 text-pitch-400' : 'border-red-500/40 bg-red-900/20 text-red-300'}`}>
          {correct ? '✅ Correct! ' : '❌ Wrong! '}{q.fact}
        </div>
      )}
      <div className="grid grid-cols-2 gap-4">
        {[true, false].map(val => {
          const isSelected = answered === val
          const isCorrectBtn = val === q.answer
          let style = val
            ? 'border-pitch-500/40 bg-pitch-900/30 text-pitch-400 hover:bg-pitch-900/60'
            : 'border-red-500/40 bg-red-900/20 text-red-400 hover:bg-red-900/40'
          if (answered !== null) {
            if (isSelected && correct) style = 'border-pitch-500 bg-pitch-500/20 text-pitch-300'
            else if (isSelected && wrong) style = 'border-red-500 bg-red-500/20 text-red-300'
            else if (!isSelected && isCorrectBtn) style = 'border-pitch-500 bg-pitch-500/10 text-pitch-400'
            else style = 'border-white/5 opacity-30 cursor-default'
          }
          return (
            <button key={String(val)} onClick={() => handleAnswer(val)} disabled={answered !== null}
              className={`border-2 rounded-2xl py-5 text-2xl font-extrabold transition-all cursor-pointer ${style}`}>
              {val ? '✅ TRUE' : '❌ FALSE'}
            </button>
          )
        })}
      </div>
    </div>
  )
}

// ─── Name All 20 PL Clubs ────────────────────────────────────────
function NameTheClubs() {
  const TIME = 90
  const [started, setStarted] = useState(false)
  const [input, setInput] = useState('')
  const [found, setFound] = useState<string[]>([])
  const [timeLeft, setTimeLeft] = useState(TIME)
  const [done, setDone] = useState(false)

  useEffect(() => {
    if (!started || done) return
    if (timeLeft <= 0) { setDone(true); addXP(found.length * 2); return }
    const t = setTimeout(() => setTimeLeft(tl => tl - 1), 1000)
    return () => clearTimeout(t)
  }, [started, done, timeLeft, found.length])

  const handleInput = (val: string) => {
    setInput(val)
    const match = PL_CLUBS_20.find(c =>
      c.toLowerCase() === val.trim().toLowerCase() && !found.includes(c)
    )
    if (match) { setFound(prev => [...prev, match]); setInput(''); if (found.length + 1 === 20) { setDone(true); addXP(40) } }
  }

  const missed = PL_CLUBS_20.filter(c => !found.includes(c))
  const timerColor = timeLeft <= 15 ? 'text-red-400' : timeLeft <= 30 ? 'text-volt-400' : 'text-pitch-400'

  if (!started) return (
    <div className="text-center space-y-6 py-4">
      <div className="text-5xl">🏴󠁧󠁢󠁥󠁮󠁧󠁿</div>
      <h3 className="text-2xl font-extrabold text-white">Name all 20 Premier League clubs!</h3>
      <p className="text-white/50">You have 90 seconds. Type a club name and press Enter.</p>
      <button onClick={() => setStarted(true)} className="btn-primary px-8 py-3 text-base">Start! ⏱</button>
    </div>
  )

  if (done) return (
    <div className="text-center space-y-4 py-4">
      <div className="text-6xl">{found.length === 20 ? '🏆' : found.length >= 15 ? '⭐' : '⚽'}</div>
      <div className="text-3xl font-extrabold text-white">{found.length} / 20</div>
      <p className="text-white/50">{found.length === 20 ? 'PERFECT! All 20! 🔥' : found.length >= 15 ? 'Brilliant!' : 'Keep practising!'}</p>
      <p className="text-volt-400 font-bold">+{found.length * 2} XP earned!</p>
      {missed.length > 0 && (
        <div className="card text-left">
          <p className="text-white/40 text-sm font-semibold mb-2">You missed:</p>
          <div className="flex flex-wrap gap-2">
            {missed.map(c => <span key={c} className="badge-fire text-xs">{c}</span>)}
          </div>
        </div>
      )}
      <button onClick={() => window.location.reload()} className="btn-primary px-6 py-2">Play Again 🔄</button>
    </div>
  )

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <span className="text-white/40 text-sm font-semibold">{found.length} / 20 found</span>
        <span className={`text-2xl font-extrabold ${timerColor}`}>⏱ {timeLeft}s</span>
      </div>
      <div className="h-1.5 bg-dark-700 rounded-full"><div className="h-full bg-pitch-500 rounded-full transition-all" style={{ width: `${(timeLeft / TIME) * 100}%` }} /></div>
      <input
        autoFocus
        className="input w-full text-lg"
        placeholder="Type a club name..."
        value={input}
        onChange={e => handleInput(e.target.value)}
      />
      <div className="flex flex-wrap gap-2 min-h-12">
        {found.map(c => <span key={c} className="badge-green text-xs">{c} ✓</span>)}
      </div>
    </div>
  )
}

// ─── Main Games Page ─────────────────────────────────────────────
const GAMES = [
  { id: 'badge',      label: '🛡 Guess the Badge',     desc: '10 club crests, name the team',       component: BadgeGame },
  { id: 'silhouette', label: '👤 Guess the Player',    desc: '8 silhouettes, name the star',        component: SilhouetteGame },
  { id: 'truefalse',  label: '✅ True or False',        desc: '10 football facts — real or fake?',  component: TrueFalseGame },
  { id: 'name20',     label: '🏴󠁧󠁢󠁥󠁮󠁧󠁿 Name the 20',       desc: 'All 20 PL clubs in 90 seconds',       component: NameTheClubs },
]

export default function GamesPage() {
  const [active, setActive] = useState('badge')
  const [key, setKey] = useState(0)
  const Game = GAMES.find(g => g.id === active)!.component

  const switchGame = (id: string) => { setActive(id); setKey(k => k + 1) }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      <div className="text-center">
        <h1 className="text-4xl font-extrabold text-white mb-2">🎮 Mini <span className="text-volt-400">Games</span></h1>
        <p className="text-white/50">Test your football knowledge — earn XP with every correct answer!</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {GAMES.map(g => (
          <button key={g.id} onClick={() => switchGame(g.id)}
            className={`text-left p-4 rounded-2xl border-2 transition-all ${active === g.id ? 'border-volt-400 bg-volt-400/10' : 'border-white/10 bg-white/5 hover:border-white/20'}`}>
            <div className="font-extrabold text-white text-sm mb-0.5">{g.label}</div>
            <div className="text-white/40 text-xs">{g.desc}</div>
          </button>
        ))}
      </div>

      <div className="card">
        <Game key={key} />
      </div>
    </div>
  )
}
