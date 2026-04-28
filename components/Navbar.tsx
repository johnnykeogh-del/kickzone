'use client'

import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { useState, useRef, useEffect } from 'react'
import { usePathname } from 'next/navigation'

const NAV_GROUPS = [
  {
    label: '⚽ Football',
    links: [
      { href: '/leagues',      label: '🏆 League Tables',  desc: 'Standings for every league' },
      { href: '/players',      label: '⭐ Top Players',     desc: 'Stats, ratings & values' },
      { href: '/golden-boot',  label: '👟 Golden Boot',    desc: 'Top scorers across all leagues' },
      { href: '/wonderkids',   label: '🌟 Wonderkids',     desc: 'Best under-22 players' },
    ],
  },
  {
    label: '🎮 Games',
    links: [
      { href: '/games',      label: '🎮 Mini Games',    desc: 'Badge quiz, silhouette & more' },
      { href: '/fc26',       label: '🃏 FC26 Cards',    desc: 'Player cards & stats' },
      { href: '/cardgame',   label: '⚡ Card Battle',   desc: 'Top Trumps vs other kids!' },
      { href: '/predictor',  label: '🔮 Predictor',     desc: 'Predict scores, earn XP' },
      { href: '/penalty',    label: '⚽ Penalty Shootout', desc: '5 kicks vs the keeper' },
      { href: '/wordle',     label: '🟩 Footie Wordle',  desc: 'Guess today\'s mystery player' },
      { href: '/diary',      label: '📓 My Diary',       desc: 'Track your own matches' },
      { href: '/battle',     label: '⚔️ Battle',        desc: 'Player vs Player stats' },
      { href: '/quiz',       label: '🧠 Quiz Zone',     desc: '10 football questions' },
      { href: '/dreamteam',  label: '⚽ Dream Team',    desc: 'Pick your ultimate 11' },
      { href: '/goat',       label: '🐐 GOAT Debate',   desc: 'Messi vs Ronaldo — you decide' },
    ],
  },
  {
    label: '💬 Community',
    links: [
      { href: '/interviews',  label: '🎙 Interviews',   desc: 'Kids interview the pros' },
      { href: '/discussions', label: '💬 Discussions',  desc: 'Chat with other kids' },
    ],
  },
]

function Dropdown({ group, pathname }: { group: typeof NAV_GROUPS[0]; pathname: string }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const isActive = group.links.some(l => pathname === l.href)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold transition-all ${
          isActive ? 'bg-pitch-500/20 text-pitch-400' : 'text-white/70 hover:text-white hover:bg-white/5'
        }`}
      >
        {group.label}
        <svg className={`w-3.5 h-3.5 transition-transform ${open ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="absolute top-full left-0 mt-1 bg-dark-800 border border-white/10 rounded-2xl shadow-2xl shadow-black/50 overflow-hidden min-w-[220px] z-50">
          {group.links.map(l => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className={`flex items-start gap-3 px-4 py-3 hover:bg-white/5 transition-colors ${pathname === l.href ? 'bg-pitch-500/10' : ''}`}
            >
              <span className="text-xl leading-none mt-0.5 w-6 shrink-0">{l.label.split(' ')[0]}</span>
              <div>
                <p className={`text-sm font-bold leading-none mb-0.5 ${pathname === l.href ? 'text-pitch-400' : 'text-white'}`}>
                  {l.label.split(' ').slice(1).join(' ')}
                </p>
                <p className="text-xs text-white/40">{l.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

export default function Navbar() {
  const { data: session } = useSession()
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const user = session?.user as any

  return (
    <nav className="bg-dark-800/80 backdrop-blur-md border-b border-white/10 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0">
            <div className="w-9 h-9 bg-pitch-500 rounded-xl flex items-center justify-center text-xl shadow-lg shadow-pitch-500/30">
              ⚽
            </div>
            <div>
              <span className="text-white font-extrabold text-lg leading-none">Kick</span>
              <span className="text-pitch-400 font-extrabold text-lg leading-none">Zone</span>
            </div>
          </Link>

          {/* Desktop nav — dropdowns */}
          <div className="hidden lg:flex items-center gap-1">
            <Link
              href="/"
              className={`px-3 py-2 rounded-xl text-sm font-semibold transition-all ${
                pathname === '/' ? 'bg-pitch-500/20 text-pitch-400' : 'text-white/70 hover:text-white hover:bg-white/5'
              }`}
            >
              🏠 Home
            </Link>
            {NAV_GROUPS.map(g => (
              <Dropdown key={g.label} group={g} pathname={pathname} />
            ))}
          </div>

          {/* Auth */}
          <div className="hidden lg:flex items-center gap-3 shrink-0">
            {session ? (
              <div className="flex items-center gap-3">
                <Link href="/profile" className="flex items-center gap-2 bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-xl transition-all">
                  <span className="text-xl">{user?.avatarEmoji || '⚽'}</span>
                  <span className="text-sm font-semibold text-white/90">{user?.displayName}</span>
                </Link>
                <button
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="text-white/50 hover:text-white text-sm transition-colors"
                >
                  Sign out
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/login" className="btn-ghost text-sm py-2 px-4">Sign in</Link>
                <Link href="/register" className="btn-volt text-sm py-2 px-4">Join Free! 🚀</Link>
              </div>
            )}
          </div>

          {/* Mobile button */}
          <button
            onClick={() => setOpen(!open)}
            className="lg:hidden p-2 rounded-xl hover:bg-white/5 transition-colors"
          >
            <div className={`w-5 h-0.5 bg-white transition-all ${open ? 'rotate-45 translate-y-1.5' : ''}`} />
            <div className={`w-5 h-0.5 bg-white my-1 transition-all ${open ? 'opacity-0' : ''}`} />
            <div className={`w-5 h-0.5 bg-white transition-all ${open ? '-rotate-45 -translate-y-1.5' : ''}`} />
          </button>
        </div>

        {/* Mobile menu */}
        {open && (
          <div className="lg:hidden py-4 border-t border-white/10">
            <Link href="/" onClick={() => setOpen(false)} className="block px-4 py-2.5 rounded-xl text-sm font-semibold text-white/80 hover:bg-white/5 mb-1">🏠 Home</Link>
            {NAV_GROUPS.map(g => (
              <div key={g.label} className="mb-3">
                <p className="px-4 py-1 text-xs font-extrabold text-white/30 uppercase tracking-wider">{g.label}</p>
                {g.links.map(l => (
                  <Link
                    key={l.href}
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className={`block px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                      pathname === l.href ? 'text-pitch-400 bg-pitch-500/10' : 'text-white/80 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    {l.label}
                  </Link>
                ))}
              </div>
            ))}
            <div className="pt-3 border-t border-white/10 mt-2 flex flex-col gap-2">
              {session ? (
                <>
                  <Link href="/profile" onClick={() => setOpen(false)} className="flex items-center gap-2 px-4 py-2">
                    <span>{user?.avatarEmoji}</span>
                    <span className="font-semibold">{user?.displayName}</span>
                  </Link>
                  <button onClick={() => signOut({ callbackUrl: '/' })} className="text-left px-4 py-2 text-white/50">Sign out</button>
                </>
              ) : (
                <>
                  <Link href="/login" onClick={() => setOpen(false)} className="btn-ghost text-sm text-center">Sign in</Link>
                  <Link href="/register" onClick={() => setOpen(false)} className="btn-volt text-sm text-center">Join Free! 🚀</Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
