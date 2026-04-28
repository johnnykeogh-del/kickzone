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
  utcDate?: string
  status: string
  score: { home: number | null; away: number | null } | null
}

interface Prediction {
  matchId: number
  home: number
  away: number
}

function getXP(pred: Prediction, actual: { home: number; away: number }): { xp: number; label: string } {
  if (pred.home === actual.home && pred.away === actual.away) return { xp: 10, label: '🎯 EXACT!' }
  const predResult = pred.home > pred.away ? 'H' : pred.home < pred.away ? 'A' : 'D'
  const actResult  = actual.home > actual.away ? 'H' : actual.home < actual.away ? 'A' : 'D'
  if (predResult === actResult) return { xp: 5, label: '✅ Correct result' }
  return { xp: 0, label: '❌ Wrong' }
}

const STORAGE_KEY = 'kickzone_predictions_v2'
const XP_KEY      = 'kickzone_xp'

export default function PredictorPage() {
  const [matches, setMatches]       = useState<PredictableMatch[]>([])
  const [loadingMatches, setLoading] = useState(true)
  const [predictions, setPredictions] = useState<Record<number, Prediction>>({})
  const [locked, setLocked]         = useState(false)
  const [checking, setChecking]     = useState(false)
  const [storedXP, setStoredXP]     = useState(0)
  const [roundXP, setRoundXP]       = useState<number | null>(null)

  // Load XP + any saved predictions from localStorage
  useEffect(() => {
    const xp   = parseInt(localStorage.getItem(XP_KEY) || '0')
    setStoredXP(xp)
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      try {
        const { preds, isLocked } = JSON.parse(saved)
        if (preds)    setPredictions(preds)
        if (isLocked) setLocked(true)
      } catch { /* ignore */ }
    }
  }, [])

  // Fetch upcoming matches
  useEffect(() => {
    setLoading(true)
    fetch('/api/matches/upcoming')
      .then(r => r.json())
      .then(d => setMatches(d.matches || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const setPrediction = (matchId: number, side: 'home' | 'away', value: number) => {
    setPredictions(prev => ({
      ...prev,
      [matchId]: {
        matchId,
        home: side === 'home' ? value : (prev[matchId]?.home ?? 0),
        away: side === 'away' ? value : (prev[matchId]?.away ?? 0),
      },
    }))
  }

  const allSet = matches.length > 0 && matches.every(m => predictions[m.id] !== undefined)

  const handleLock = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ preds: predictions, isLocked: true }))
    setLocked(true)
  }

  // Re-fetch matches to see if any are now FINISHED and score predictions
  const handleCheckScores = async () => {
    setChecking(true)
    try {
      const res = await fetch('/api/matches/upcoming?bust=' + Date.now())
      const d   = await res.json()
      const refreshed: PredictableMatch[] = d.matches || []
      setMatches(refreshed)

      let xp = 0
      let scored = 0
      for (const m of refreshed) {
        const pred = predictions[m.id]
        if (!pred) continue
        if (m.status === 'FINISHED' && m.score?.home != null && m.score?.away != null) {
          xp += getXP(pred, { home: m.score.home, away: m.score.away }).xp
          scored++
        }
      }
      if (scored > 0) {
        setRoundXP(xp)
        const newTotal = storedXP + xp
        setStoredXP(newTotal)
        localStorage.setItem(XP_KEY, String(newTotal))
      }
    } finally {
      setChecking(false)
    }
  }

  const handleReset = () => {
    localStorage.removeItem(STORAGE_KEY)
    setPredictions({})
    setLocked(false)
    setRoundXP(null)
  }

  const finishedCount  = matches.filter(m => m.status === 'FINISHED' && predictions[m.id]).length
  const scheduledCount = matches.filter(m => m.status === 'SCHEDULED').length

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-8">

      {/* Header */}
      <div className="text-center">
        <div className="text-6xl mb-4">🔮</div>
        <h1 className="text-4xl font-extrabold text-white mb-2">
          Score <span className="text-volt-400">Predictor</span>
        </h1>
        <p className="text-white/50 text-lg mb-4">Predict upcoming scores — earn XP for every correct guess!</p>
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

      {/* Loading */}
      {loadingMatches && (
        <div className="space-y-4">
          {[1,2,3,4,5].map(i => <div key={i} className="card h-28 animate-pulse bg-white/5" />)}
        </div>
      )}

      {/* Matches */}
      {!loadingMatches && (
        <div className="space-y-4">
          {matches.map(match => {
            const pred    = predictions[match.id]
            const finished = match.status === 'FINISHED' && match.score?.home != null
            const scored  = finished && pred
              ? getXP(pred, { home: match.score!.home!, away: match.score!.away! })
              : null

            return (
              <div key={match.id} className={`card transition-all ${
                scored ? (scored.xp >= 10 ? 'border-pitch-500/50' : scored.xp >= 5 ? 'border-volt-500/50' : 'border-red-500/30')
                : match.status === 'IN_PLAY' ? 'border-red-500/30' : ''
              }`}>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs text-white/40 font-semibold">{match.leagueFlag} {match.league}</span>
                  <div className="flex items-center gap-2">
                    {match.status === 'IN_PLAY' && (
                      <span className="flex items-center gap-1 text-xs text-red-400 font-bold">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse inline-block" /> LIVE
                      </span>
                    )}
                    {match.status === 'FINISHED' && <span className="text-xs text-white/30 font-semibold">FT</span>}
                    <span className="text-xs text-white/40">{match.kickoff}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {/* Home */}
                  <div className="flex flex-col items-center gap-1.5 flex-1 min-w-0">
                    <div className="w-10 h-10">
                      <SafeImage src={match.homeTeam.crest} alt={match.homeTeam.shortName} className="w-10 h-10 object-contain" fallback="🛡" />
                    </div>
                    <span className="text-sm font-bold text-white truncate text-center max-w-full">{match.homeTeam.name}</span>
                  </div>

                  {/* Score inputs */}
                  <div className="flex items-center gap-2 shrink-0">
                    <input
                      type="number" min={0} max={9}
                      disabled={locked}
                      value={pred?.home ?? ''}
                      onChange={e => setPrediction(match.id, 'home', Math.max(0, Math.min(9, parseInt(e.target.value) || 0)))}
                      className="w-12 h-12 text-center text-xl font-extrabold bg-dark-700 border border-white/20 rounded-xl text-white focus:border-pitch-500 focus:outline-none disabled:opacity-50"
                      placeholder="0"
                    />
                    <span className="text-white/40 font-bold text-lg">–</span>
                    <input
                      type="number" min={0} max={9}
                      disabled={locked}
                      value={pred?.away ?? ''}
                      onChange={e => setPrediction(match.id, 'away', Math.max(0, Math.min(9, parseInt(e.target.value) || 0)))}
                      className="w-12 h-12 text-center text-xl font-extrabold bg-dark-700 border border-white/20 rounded-xl text-white focus:border-pitch-500 focus:outline-none disabled:opacity-50"
                      placeholder="0"
                    />
                  </div>

                  {/* Away */}
                  <div className="flex flex-col items-center gap-1.5 flex-1 min-w-0">
                    <div className="w-10 h-10">
                      <SafeImage src={match.awayTeam.crest} alt={match.awayTeam.shortName} className="w-10 h-10 object-contain" fallback="🛡" />
                    </div>
                    <span className="text-sm font-bold text-white truncate text-center max-w-full">{match.awayTeam.name}</span>
                  </div>
                </div>

                {/* Result row */}
                {finished && (
                  <div className="mt-3 flex items-center justify-between">
                    {scored ? (
                      <div className={`text-xs font-bold px-2 py-1 rounded-lg ${scored.xp >= 10 ? 'bg-pitch-500/20 text-pitch-400' : scored.xp >= 5 ? 'bg-volt-400/20 text-volt-400' : 'bg-red-500/20 text-red-400'}`}>
                        {scored.label} +{scored.xp} XP
                      </div>
                    ) : <div />}
                    <div className="text-xs text-white/40">
                      Final: <span className="text-white/70 font-bold">{match.score!.home}–{match.score!.away}</span>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* Actions */}
      {!loadingMatches && (
        <div className="flex flex-col items-center gap-4">
          {!locked ? (
            <>
              <button
                onClick={handleLock}
                disabled={!allSet}
                className={`btn-volt px-8 py-3 text-base w-full max-w-sm ${!allSet ? 'opacity-40 cursor-not-allowed' : ''}`}
              >
                🔮 Lock in Predictions!
              </button>
              {!allSet && (
                <p className="text-white/30 text-sm">Enter a score for all {matches.length} matches to submit</p>
              )}
            </>
          ) : (
            <div className="w-full max-w-sm space-y-4">
              {/* Locked banner */}
              <div className="bg-pitch-900/50 border border-pitch-700/30 rounded-2xl p-5 text-center">
                <div className="text-3xl mb-2">🔒</div>
                <p className="text-white font-bold mb-1">Predictions locked!</p>
                {scheduledCount > 0 && (
                  <p className="text-white/50 text-sm">
                    {scheduledCount} match{scheduledCount !== 1 ? 'es' : ''} still to play — come back after kick-off to check your score.
                  </p>
                )}
              </div>

              {/* Check scores button */}
              {finishedCount > 0 && roundXP === null && (
                <button
                  onClick={handleCheckScores}
                  disabled={checking}
                  className="btn-primary px-8 py-3 text-base w-full"
                >
                  {checking ? '⏳ Checking…' : `🏆 Check Scores (${finishedCount} finished)`}
                </button>
              )}

              {/* XP result */}
              {roundXP !== null && (
                <div className={`rounded-2xl p-6 border text-center ${roundXP >= 40 ? 'bg-pitch-900/50 border-pitch-500/40' : roundXP >= 20 ? 'bg-volt-400/10 border-volt-400/30' : 'bg-dark-700 border-white/10'}`}>
                  <div className="text-5xl mb-2">{roundXP >= 40 ? '🏆' : roundXP >= 25 ? '🥇' : roundXP >= 10 ? '🥈' : '⚽'}</div>
                  <div className="text-4xl font-extrabold text-volt-400 mb-1">+{roundXP} XP</div>
                  <p className="text-white/70 font-semibold mb-1">
                    {roundXP >= 40 ? 'PERFECT SCORE! 🎯' : roundXP >= 25 ? 'Great predictions! 🔥' : roundXP >= 10 ? 'Not bad!' : 'Keep practising!'}
                  </p>
                  <p className="text-white/40 text-sm">Total XP: {storedXP}</p>
                </div>
              )}

              <button onClick={handleReset} className="btn-ghost px-6 py-2 w-full text-sm">
                🔄 New Round
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
