'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

const AVATARS = ['⚽', '🏆', '⭐', '🔥', '🦁', '🐯', '🦊', '🐺', '🦅', '🦋', '🚀', '⚡', '💥', '🎯', '🏅']
const TEAM_GROUPS = [
  { label: '🏴󠁧󠁢󠁥󠁮󠁧󠁿 Premier League', teams: ['Arsenal', 'Aston Villa', 'Brentford', 'Brighton', 'Chelsea', 'Crystal Palace', 'Everton', 'Fulham', 'Liverpool', 'Manchester City', 'Manchester United', 'Newcastle United', 'Nottingham Forest', 'Tottenham Hotspur', 'West Ham United', 'Wolverhampton Wanderers'] },
  { label: '🇪🇸 La Liga', teams: ['Athletic Bilbao', 'Atlético Madrid', 'Barcelona', 'Celta Vigo', 'Getafe', 'Girona', 'Osasuna', 'Rayo Vallecano', 'Real Betis', 'Real Madrid', 'Real Sociedad', 'Sevilla', 'Valencia', 'Villarreal'] },
  { label: '🇩🇪 Bundesliga', teams: ['Bayer Leverkusen', 'Bayern Munich', 'Borussia Dortmund', 'Borussia Mönchengladbach', 'Eintracht Frankfurt', 'Freiburg', 'Hoffenheim', 'Mainz', 'RB Leipzig', 'Stuttgart', 'Union Berlin', 'Werder Bremen'] },
  { label: '🇮🇹 Serie A', teams: ['AC Milan', 'Atalanta', 'Bologna', 'Fiorentina', 'Inter Milan', 'Juventus', 'Lazio', 'Napoli', 'Roma', 'Torino', 'Udinese'] },
  { label: '🇫🇷 Ligue 1', teams: ['Brest', 'Lens', 'Lille', 'Lyon', 'Marseille', 'Monaco', 'Montpellier', 'Nice', 'PSG', 'Rennes', 'Strasbourg'] },
  { label: '🇵🇹 Primeira Liga', teams: ['Benfica', 'Braga', 'Porto', 'Sporting CP'] },
  { label: '🇳🇱 Eredivisie', teams: ['Ajax', 'AZ Alkmaar', 'Feyenoord', 'PSV Eindhoven'] },
  { label: '🏴󠁧󠁢󠁳󠁣󠁴󠁿 Scottish Prem', teams: ['Celtic', 'Hearts', 'Hibernian', 'Rangers'] },
  { label: '🇹🇷 Süper Lig', teams: ['Beşiktaş', 'Fenerbahçe', 'Galatasaray', 'Trabzonspor'] },
  { label: '🇦🇷 Argentina', teams: ['Boca Juniors', 'Independiente', 'Racing Club', 'River Plate', 'San Lorenzo'] },
  { label: '🇧🇷 Brazil', teams: ['Corinthians', 'Cruzeiro', 'Flamengo', 'Fluminense', 'Palmeiras', 'Santos', 'São Paulo'] },
  { label: '🌎 MLS', teams: ['Atlanta United', 'Charlotte FC', 'Inter Miami', 'LA Galaxy', 'LAFC', 'New York City FC', 'New York Red Bulls', 'Seattle Sounders'] },
]

export default function RegisterPage() {
  const router = useRouter()
  const [form, setForm] = useState({ email: '', password: '', username: '', displayName: '', age: '', avatarEmoji: '⚽', favoriteTeam: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true); setError('')
    const res = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, age: form.age ? parseInt(form.age) : undefined }),
    })
    if (!res.ok) { setError((await res.json()).error || 'Registration failed'); setLoading(false); return }
    await signIn('credentials', { email: form.email, password: form.password, redirect: false })
    router.push('/')
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">⚽</div>
          <h1 className="text-3xl font-extrabold text-white">Join KickZone!</h1>
          <p className="text-white/40 mt-2">Create your free football account 🚀</p>
        </div>

        <form onSubmit={submit} className="card space-y-4">
          {error && <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl text-sm">{error}</div>}

          {/* Avatar picker */}
          <div>
            <label className="text-xs font-bold text-white/40 uppercase tracking-wider mb-2 block">Pick Your Avatar</label>
            <div className="flex flex-wrap gap-2">
              {AVATARS.map(a => (
                <button type="button" key={a} onClick={() => setForm(f => ({ ...f, avatarEmoji: a }))}
                  className={`w-10 h-10 text-xl rounded-xl transition-all ${form.avatarEmoji === a ? 'bg-pitch-500 scale-110' : 'bg-white/5 hover:bg-white/10'}`}>
                  {a}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-white/40 uppercase tracking-wider mb-1.5 block">Display Name *</label>
              <input value={form.displayName} onChange={e => setForm(f => ({ ...f, displayName: e.target.value }))} placeholder="FootballKid99" className="input text-sm" required />
            </div>
            <div>
              <label className="text-xs font-bold text-white/40 uppercase tracking-wider mb-1.5 block">Username *</label>
              <input value={form.username} onChange={e => setForm(f => ({ ...f, username: e.target.value.toLowerCase().replace(/\s/g, '') }))} placeholder="footballkid99" className="input text-sm" required />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-white/40 uppercase tracking-wider mb-1.5 block">Email *</label>
            <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="you@example.com" className="input text-sm" required />
          </div>

          <div>
            <label className="text-xs font-bold text-white/40 uppercase tracking-wider mb-1.5 block">Password *</label>
            <input type="password" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} placeholder="Min 6 characters" className="input text-sm" required minLength={6} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-white/40 uppercase tracking-wider mb-1.5 block">Age</label>
              <input type="number" value={form.age} onChange={e => setForm(f => ({ ...f, age: e.target.value }))} placeholder="10" className="input text-sm" min={5} max={18} />
            </div>
            <div>
              <label className="text-xs font-bold text-white/40 uppercase tracking-wider mb-1.5 block">Favourite Team</label>
              <select value={form.favoriteTeam} onChange={e => setForm(f => ({ ...f, favoriteTeam: e.target.value }))} className="input text-sm" style={{ colorScheme: 'dark' }}>
                <option value="">Pick a team</option>
                {TEAM_GROUPS.map(g => (
                  <optgroup key={g.label} label={g.label}>
                    {g.teams.map(t => <option key={t} value={t}>{t}</option>)}
                  </optgroup>
                ))}
              </select>
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn-volt w-full py-3 text-base disabled:opacity-50">
            {loading ? 'Creating account...' : `Let's Go! ${form.avatarEmoji}`}
          </button>
        </form>

        <p className="text-center text-white/30 text-sm mt-6">
          Already have an account? <Link href="/login" className="text-pitch-400 hover:underline font-semibold">Sign in</Link>
        </p>
      </div>
    </div>
  )
}
