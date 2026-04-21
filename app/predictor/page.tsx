'use client'

import { useState, useEffect } from 'react'
import SafeImage from '@/components/SafeImage'

interface PredictableMatch {
  id: number
  homeTeam: { name: string; shortName: string; crest: string }
  awayTeam: { name: string; shortName: string; crest: string }
  league: string
  leagueFlag: string
  kickoff: string
}

interface Prediction {
  matchId: number
  home: number
  away: number
}

interface Result {
  matchId: number
  actualHome: number
  actualAway: number
}

const MATCHES: PredictableMatch[] = [
  { id: 1, homeTeam: { name: 'Arsenal', shortName: 'ARS', crest: 'https://crests.football-data.org/57.png' }, awayTeam: { name: 'Liverpool', shortName: 'LIV', crest: 'https://crests.football-data.org/64.png' }, league: 'Premier League', leagueFlag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', kickoff: 'Sat 3:00 PM' },
  { id: 2, homeTeam: { name: 'Real Madrid', shortName: 'RMA', crest: 'https://crests.football-data.org/86.png' }, awayTeam: { name: 'Barcelona', shortName: 'FCB', crest: 'https://crests.football-data.org/81.png' }, league: 'La Liga', leagueFlag: '🇪🇸', kickoff: 'Sat 9:00 PM' },
  { id: 3, homeTeam: { name: 'Bayern', shortName: 'BAY', crest: 'https://crests.football-data.org/5.png' }, awayTeam: { name: 'Dortmund', shortName: 'BVB', crest: 'https://crests.football-data.org/4.png' }, league: 'Bundesliga', leagueFlag: '🇩🇪', kickoff: 'Sun 4:30 PM' },
  { id: 4, homeTeam: { name: 'Inter Milan', shortName: 'INT', crest: 'https://crests.football-data.org/98.png' }, awayTeam: { name: 'AC Milan', shortName: 'MIL', crest: 'https://crests.football-data.org/100.png' }, league: 'Serie A', leagueFlag: '🇮🇹', kickoff: 'Sun 8:00 PM' },
  { id: 5, homeTeam: { name: 'PSG', shortName: 'PSG', crest: 'https://crests.football-data.org/524.png' }, awayTeam: { name: 'Monaco', shortName: 'ASM', crest: 'https://crests.football-data.org/532.png' }, league: 'Ligue 1', leagueFlag: '🇫🇷', kickoff: 'Mon 9:00 PM' },
]

const DEMO_RESULTS: Result[] = [
  { matchId: 1, actualHome: 2, actualAway: 1 },
  { matchId: 2, actualHome: 3, actualAway: 2 },
  { matchId: 3, actualHome: 1, actualAway: 1 },
  { matchId: 4, actualHome: 2, actualAway: 0 },
  { matchId: 5, actualHome: 4, actualAway: 1 },
]

function getXP(pred: Prediction, result: Result): { xp: number; label: string } {
  if (pred.home === result.actualHome && pred.away === result.actualAway) return { xp: 10, label: '🎯 EXACT!' }
  const predResult = pred.home > pred.away ? 'H' : pred.home < pred.away ? 'A' : 'D'
  const actResult = result.actualHome > result.actualAway ? 'H' : result.actualHome < result.actualAway ? 'A' : 'D'
  if (predResult === actResult) return { xp: 5, label: '✅ Correct Result' }
  return { xp: 0, label: '❌ Wrong' }
}

export default function PredictorPage() {
  const [predictions, setPredictions] = useState<Record<number, Prediction>>({})
  const [submitted, setSubmitted] = useState(false)
  const [totalXP, setTotalXP] = useState(0)
  const [storedXP, setStoredXP] = useState(0)
  const [showResults, setShowResults] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('kickzone_xp')
    if (saved) setStoredXP(parseInt(saved))
  }, [])

  const setPrediction = (matchId: number, side: 'home' | 'away', value: number) => {
    setPredictions(prev => ({
      ...prev,
      [matchId]: { matchId, home: side === 'home' ? value : (prev[matchId]?.home ?? 0), away: side === 'away' ? value : (prev[matchId]?.away ?? 0) },
    }))
  }

  const allSet = MATCHES.every(m => predictions[m.id] !== undefined)

  const handleSubmit = () => {
    let xp = 0
    MATCHES.forEach(m => {
      const pred = predictions[m.id]
      if (!pred) return
      const result = DEMO_RESULTS.find(r => r.matchId === m.id)!
      xp += getXP(pred, result).xp
    })
    setTotalXP(xp)
    const newTotal = storedXP + xp
    setStoredXP(newTotal)
    localStorage.setItem('kickzone_xp', String(newTotal))
    setSubmitted(true)
  }

  const handleReveal = () => setShowResults(true)

  const handleReset = () => {
    setPredictions({})
    setSubmitted(false)
    setShowResults(false)
    setTotalXP(0)
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-8">

      {/* Header */}
      <div className="text-center">
        <div className="text-6xl mb-4">🔮</div>
        <h1 className="text-4xl font-extrabold text-white mb-2">
          Score <span className="text-volt-400">Predictor</span>
        </h1>
        <p className="text-white/50 text-lg mb-4">Predict this weekend's scores — earn XP for every correct guess!</p>
        <div className="inline-flex items-center gap-2 bg-volt-400/10 border border-volt-400/20 rounded-full px-4 py-1.5">
          <span className="text-volt-400 font-bold text-sm">⚡ Your Total XP: {storedXP}</span>
        </div>
      </div>

      {/* XP Guide */}
      <div className="card flex flex-wrap gap-4 justify-center">
        <div className="text-center">
          <div className="text-2xl font-extrabold text-pitch-400">+10 XP</div>
          <div className="text-white/50 text-xs">🎯 Exact score</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-extrabold text-volt-400">+5 XP</div>
          <div className="text-white/50 text-xs">✅ Correct result</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-extrabold text-white/30">+0 XP</div>
          <div className="text-white/50 text-xs">❌ Wrong</div>
        </div>
      </div>

      {/* Matches */}
      <div className="space-y-4">
        {MATCHES.map(match => {
          const pred = predictions[match.id]
          const result = DEMO_RESULTS.find(r => r.matchId === match.id)!
          const scored = showResults && pred ? getXP(pred, result) : null

          return (
            <div key={match.id} className={`card transition-all ${scored ? (scored.xp >= 10 ? 'border-pitch-500/50' : scored.xp >= 5 ? 'border-volt-500/50' : 'border-red-500/30') : ''}`}>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-white/40 font-semibold">{match.leagueFlag} {match.league}</span>
                <span className="text-xs text-white/40">{match.kickoff}</span>
              </div>

              <div className="flex items-center gap-3">
                {/* Home team */}
                <div className="flex flex-col items-center gap-1.5 flex-1 min-w-0">
                  <div className="w-10 h-10">
                    <SafeImage src={match.homeTeam.crest} alt={match.homeTeam.shortName} className="w-10 h-10 object-contain" fallback="🛡" />
                  </div>
                  <span className="text-sm font-bold text-white truncate text-center max-w-full">{match.homeTeam.name}</span>
                </div>

                {/* Score inputs */}
                <div className="flex items-center gap-2 shrink-0">
                  <input
                    type="number"
                    min={0} max={9}
                    disabled={submitted}
                    value={pred?.home ?? ''}
                    onChange={e => setPrediction(match.id, 'home', parseInt(e.target.value) || 0)}
                    className="w-12 h-12 text-center text-xl font-extrabold bg-dark-700 border border-white/20 rounded-xl text-white focus:border-pitch-500 focus:outline-none disabled:opacity-50"
                    placeholder="0"
                  />
                  <span className="text-white/40 font-bold text-lg">–</span>
                  <input
                    type="number"
                    min={0} max={9}
                    disabled={submitted}
                    value={pred?.away ?? ''}
                    onChange={e => setPrediction(match.id, 'away', parseInt(e.target.value) || 0)}
                    className="w-12 h-12 text-center text-xl font-extrabold bg-dark-700 border border-white/20 rounded-xl text-white focus:border-pitch-500 focus:outline-none disabled:opacity-50"
                    placeholder="0"
                  />
                </div>

                {/* Away team */}
                <div className="flex flex-col items-center gap-1.5 flex-1 min-w-0">
                  <div className="w-10 h-10">
                    <SafeImage src={match.awayTeam.crest} alt={match.awayTeam.shortName} className="w-10 h-10 object-contain" fallback="🛡" />
                  </div>
                  <span className="text-sm font-bold text-white truncate text-center max-w-full">{match.awayTeam.name}</span>
                </div>
              </div>

              {/* Result reveal */}
              {showResults && pred && (
                <div className="mt-3 flex items-center justify-between">
                  <div className={`text-xs font-bold px-2 py-1 rounded-lg ${scored!.xp >= 10 ? 'bg-pitch-500/20 text-pitch-400' : scored!.xp >= 5 ? 'bg-volt-400/20 text-volt-400' : 'bg-red-500/20 text-red-400'}`}>
                    {scored!.label} +{scored!.xp} XP
                  </div>
                  <div className="text-xs text-white/40">
                    Actual: <span className="text-white/70 font-bold">{result.actualHome}–{result.actualAway}</span>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Actions */}
      <div className="flex flex-col items-center gap-4">
        {!submitted ? (
          <button
            onClick={handleSubmit}
            disabled={!allSet}
            className={`btn-volt px-8 py-3 text-base w-full max-w-sm ${!allSet ? 'opacity-40 cursor-not-allowed' : ''}`}
          >
            🔮 Lock in Predictions!
          </button>
        ) : !showResults ? (
          <div className="text-center space-y-4">
            <div className="bg-pitch-900/50 border border-pitch-700/30 rounded-2xl p-6">
              <div className="text-4xl mb-2">🎉</div>
              <p className="text-white/70 mb-4">Predictions locked! Ready to see how you did?</p>
              <button onClick={handleReveal} className="btn-primary px-8 py-3 text-base">
                🏆 Reveal Results!
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center space-y-4 w-full max-w-sm">
            <div className={`rounded-2xl p-6 border ${totalXP >= 30 ? 'bg-pitch-900/50 border-pitch-500/40' : totalXP >= 15 ? 'bg-volt-400/10 border-volt-400/30' : 'bg-dark-700 border-white/10'}`}>
              <div className="text-5xl mb-2">{totalXP >= 40 ? '🏆' : totalXP >= 25 ? '🥇' : totalXP >= 15 ? '🥈' : '⚽'}</div>
              <div className="text-4xl font-extrabold text-volt-400 mb-1">+{totalXP} XP</div>
              <p className="text-white/70 font-semibold mb-1">
                {totalXP >= 40 ? 'PERFECT SCORE! 🎯' : totalXP >= 25 ? 'Great predictions! 🔥' : totalXP >= 15 ? 'Not bad!' : 'Keep practising!'}
              </p>
              <p className="text-white/40 text-sm">Total XP: {storedXP}</p>
            </div>
            <button onClick={handleReset} className="btn-ghost px-6 py-2">🔄 Play Again</button>
          </div>
        )}

        {!submitted && !allSet && (
          <p className="text-white/30 text-sm">Enter a score for all {MATCHES.length} matches to submit</p>
        )}
      </div>
    </div>
  )
}
