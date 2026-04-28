'use client'

import { useState, useEffect } from 'react'

interface MatchEntry {
  id: string
  date: string
  opponent: string
  result: 'W' | 'D' | 'L'
  goalsFor: number
  goalsAgainst: number
  myGoals: number
  myAssists: number
  notes: string
  competition: string
}

const COMPETITIONS = ['Friendly', 'League', 'Cup', 'Tournament', 'Training Match', 'Futsal']

const RESULT_STYLES: Record<string, string> = {
  W: 'border-volt-400/60 bg-volt-400/10 text-volt-400',
  D: 'border-yellow-400/60 bg-yellow-400/10 text-yellow-400',
  L: 'border-red-500/60 bg-red-500/10 text-red-400',
}

function emptyForm(): Omit<MatchEntry, 'id'> {
  return {
    date: new Date().toISOString().split('T')[0],
    opponent: '',
    result: 'W',
    goalsFor: 0,
    goalsAgainst: 0,
    myGoals: 0,
    myAssists: 0,
    notes: '',
    competition: 'League',
  }
}

export default function DiaryPage() {
  const [entries, setEntries]   = useState<MatchEntry[]>([])
  const [form, setForm]         = useState(emptyForm())
  const [adding, setAdding]     = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  useEffect(() => {
    const raw = localStorage.getItem('kickzone_diary')
    if (raw) setEntries(JSON.parse(raw))
  }, [])

  const save = (next: MatchEntry[]) => {
    setEntries(next)
    localStorage.setItem('kickzone_diary', JSON.stringify(next))
  }

  const addEntry = () => {
    if (!form.opponent.trim()) return
    const entry: MatchEntry = { ...form, id: Date.now().toString() }
    save([entry, ...entries])
    setForm(emptyForm())
    setAdding(false)
  }

  const removeEntry = (id: string) => {
    save(entries.filter(e => e.id !== id))
    setDeleteId(null)
  }

  const totalGoals   = entries.reduce((s, e) => s + e.myGoals, 0)
  const totalAssists = entries.reduce((s, e) => s + e.myAssists, 0)
  const wins         = entries.filter(e => e.result === 'W').length
  const draws        = entries.filter(e => e.result === 'D').length
  const losses       = entries.filter(e => e.result === 'L').length
  const winPct       = entries.length ? Math.round((wins / entries.length) * 100) : 0

  const field = (key: keyof typeof form, val: any) => setForm(f => ({ ...f, [key]: val }))

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 space-y-6">

      {/* Header */}
      <div className="text-center">
        <div className="text-6xl mb-3">📓</div>
        <h1 className="text-4xl font-extrabold text-white mb-1">
          My Football <span className="text-volt-400">Diary</span>
        </h1>
        <p className="text-white/50">Track every match you play — goals, assists & memories</p>
      </div>

      {/* Stats bar */}
      {entries.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'Matches', value: entries.length, color: 'text-white' },
            { label: 'Goals',   value: totalGoals,     color: 'text-volt-400' },
            { label: 'Assists', value: totalAssists,   color: 'text-pitch-400' },
            { label: 'Win %',   value: `${winPct}%`,   color: 'text-green-400' },
          ].map(s => (
            <div key={s.label} className="card text-center py-4">
              <div className={`text-3xl font-extrabold ${s.color}`}>{s.value}</div>
              <div className="text-white/40 text-xs mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      )}

      {/* W/D/L mini bar */}
      {entries.length > 0 && (
        <div className="card flex items-center gap-4 justify-center">
          <span className="text-volt-400 font-bold text-sm">W {wins}</span>
          <div className="flex-1 flex rounded-full overflow-hidden h-3 bg-white/5">
            {wins   > 0 && <div className="bg-volt-400"   style={{ width: `${(wins/entries.length)*100}%` }} />}
            {draws  > 0 && <div className="bg-yellow-400" style={{ width: `${(draws/entries.length)*100}%` }} />}
            {losses > 0 && <div className="bg-red-500"    style={{ width: `${(losses/entries.length)*100}%` }} />}
          </div>
          <span className="text-yellow-400 font-bold text-sm">D {draws}</span>
          <span className="text-red-400 font-bold text-sm">L {losses}</span>
        </div>
      )}

      {/* Add match button / form */}
      {!adding ? (
        <button onClick={() => setAdding(true)} className="btn-volt w-full py-3 text-base">
          ➕ Add Match
        </button>
      ) : (
        <div className="card border-2 border-volt-400/30 space-y-4">
          <h3 className="font-extrabold text-white text-lg">New Match</h3>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-white/40 font-semibold mb-1 block">Date</label>
              <input
                type="date"
                value={form.date}
                onChange={e => field('date', e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-volt-400/50"
              />
            </div>
            <div>
              <label className="text-xs text-white/40 font-semibold mb-1 block">Competition</label>
              <select
                value={form.competition}
                onChange={e => field('competition', e.target.value)}
                className="w-full bg-dark-800 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-volt-400/50"
              >
                {COMPETITIONS.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs text-white/40 font-semibold mb-1 block">Opponent</label>
            <input
              type="text"
              placeholder="e.g. FC Rangers"
              value={form.opponent}
              onChange={e => field('opponent', e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white placeholder-white/20 focus:outline-none focus:border-volt-400/50"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-xs text-white/40 font-semibold mb-1 block">Result</label>
              <select
                value={form.result}
                onChange={e => field('result', e.target.value as 'W'|'D'|'L')}
                className="w-full bg-dark-800 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-volt-400/50"
              >
                <option value="W">Win</option>
                <option value="D">Draw</option>
                <option value="L">Loss</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-white/40 font-semibold mb-1 block">Score (Us)</label>
              <input type="number" min={0} max={99} value={form.goalsFor}
                onChange={e => field('goalsFor', +e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-volt-400/50"
              />
            </div>
            <div>
              <label className="text-xs text-white/40 font-semibold mb-1 block">Score (Them)</label>
              <input type="number" min={0} max={99} value={form.goalsAgainst}
                onChange={e => field('goalsAgainst', +e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-volt-400/50"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-white/40 font-semibold mb-1 block">My Goals ⚽</label>
              <input type="number" min={0} max={99} value={form.myGoals}
                onChange={e => field('myGoals', +e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-volt-400/50"
              />
            </div>
            <div>
              <label className="text-xs text-white/40 font-semibold mb-1 block">My Assists 🎯</label>
              <input type="number" min={0} max={99} value={form.myAssists}
                onChange={e => field('myAssists', +e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-volt-400/50"
              />
            </div>
          </div>

          <div>
            <label className="text-xs text-white/40 font-semibold mb-1 block">Notes (optional)</label>
            <textarea
              rows={2}
              placeholder="How did it go? Best moment?"
              value={form.notes}
              onChange={e => field('notes', e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white placeholder-white/20 focus:outline-none focus:border-volt-400/50 resize-none"
            />
          </div>

          <div className="flex gap-3">
            <button onClick={addEntry} className="btn-volt flex-1 py-2.5">Save Match</button>
            <button onClick={() => { setAdding(false); setForm(emptyForm()) }} className="btn-ghost flex-1 py-2.5">Cancel</button>
          </div>
        </div>
      )}

      {/* Entries list */}
      {entries.length === 0 && !adding && (
        <div className="card text-center py-12">
          <div className="text-5xl mb-3">📓</div>
          <p className="text-white/40">No matches logged yet.<br/>Add your first one above!</p>
        </div>
      )}

      <div className="space-y-3">
        {entries.map(e => (
          <div key={e.id} className={`card border-l-4 ${RESULT_STYLES[e.result]}`}>
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className={`text-xs font-extrabold px-2 py-0.5 rounded-md border ${RESULT_STYLES[e.result]}`}>{e.result}</span>
                  <span className="text-white font-bold truncate">{e.opponent}</span>
                  <span className="text-white/60 font-mono font-bold">{e.goalsFor}–{e.goalsAgainst}</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-white/40 flex-wrap">
                  <span>{new Date(e.date).toLocaleDateString('en-GB', { day:'numeric', month:'short', year:'numeric' })}</span>
                  <span>· {e.competition}</span>
                  {e.myGoals > 0   && <span className="text-volt-400 font-semibold">⚽ {e.myGoals}</span>}
                  {e.myAssists > 0 && <span className="text-pitch-400 font-semibold">🎯 {e.myAssists}</span>}
                </div>
                {e.notes && <p className="text-white/50 text-xs mt-1.5 italic">"{e.notes}"</p>}
              </div>
              <button
                onClick={() => setDeleteId(e.id)}
                className="text-white/20 hover:text-red-400 transition-colors text-xl shrink-0 leading-none"
              >
                ×
              </button>
            </div>

            {deleteId === e.id && (
              <div className="mt-3 pt-3 border-t border-white/10 flex items-center gap-3">
                <span className="text-xs text-white/50 flex-1">Delete this entry?</span>
                <button onClick={() => removeEntry(e.id)} className="text-xs text-red-400 hover:text-red-300 font-bold">Delete</button>
                <button onClick={() => setDeleteId(null)} className="text-xs text-white/40 hover:text-white font-bold">Cancel</button>
              </div>
            )}
          </div>
        ))}
      </div>

    </div>
  )
}
