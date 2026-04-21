'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'

interface Question { id: string; question: string; answer?: string; upvotes: number }
interface Interview {
  id: string
  title: string
  playerName: string
  playerTeam: string
  playerPosition?: string
  kid: { displayName: string; avatarEmoji: string; username: string }
  questions: Question[]
  publishedAt?: string
}

export default function InterviewsPage() {
  const { data: session } = useSession()
  const [interviews, setInterviews] = useState<Interview[]>([])
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/interviews')
      .then(r => r.json())
      .then(d => { setInterviews(Array.isArray(d) ? d : []); setLoading(false) })
  }, [])

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-white mb-2">🎙 Kid Interviews</h1>
        <p className="text-white/50">Real questions from kids. Real answers from the pros.</p>
      </div>

      {/* Banner */}
      <div className="card-green border-pitch-600/40 mb-8 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="text-5xl">🌟</div>
        <div className="flex-1">
          <h3 className="font-extrabold text-white text-lg">Want to interview your favourite player?</h3>
          <p className="text-white/50 text-sm mt-1">
            Submit your best question and it could be asked to a professional footballer!
            The best questions get featured on KickZone.
          </p>
        </div>
        {session ? (
          <Link href="/interviews/submit" className="btn-volt shrink-0 text-sm">Submit Question 🎤</Link>
        ) : (
          <Link href="/register" className="btn-volt shrink-0 text-sm">Join to Ask Questions 🎤</Link>
        )}
      </div>

      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 2 }).map((_, i) => <div key={i} className="card h-48 animate-pulse bg-white/5" />)}
        </div>
      ) : (
        <div className="space-y-6">
          {interviews.map(interview => (
            <div key={interview.id} className="card space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-pitch-600 to-pitch-900 flex items-center justify-center text-2xl shrink-0 border border-pitch-500/30">
                  ⚽
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="font-extrabold text-white text-lg">{interview.playerName}</h2>
                    <span className="badge-green">{interview.playerTeam}</span>
                    {interview.playerPosition && <span className="badge-sky">{interview.playerPosition}</span>}
                  </div>
                  <p className="text-white/40 text-sm mt-1">
                    Interviewed by <span className="text-pitch-400 font-semibold">{interview.kid.avatarEmoji} {interview.kid.displayName}</span>
                  </p>
                </div>
                <button
                  onClick={() => setExpanded(expanded === interview.id ? null : interview.id)}
                  className="btn-ghost text-sm shrink-0"
                >
                  {expanded === interview.id ? 'Collapse ▲' : `Read Interview ▼`}
                </button>
              </div>

              {/* Preview — first Q */}
              {interview.questions[0] && (
                <div className="bg-white/5 rounded-2xl p-4">
                  <p className="text-volt-400 font-bold text-sm mb-2">🎤 &ldquo;{interview.questions[0].question}&rdquo;</p>
                  {interview.questions[0].answer && (
                    <p className="text-white/70 text-sm leading-relaxed">{interview.questions[0].answer}</p>
                  )}
                </div>
              )}

              {/* Full interview */}
              {expanded === interview.id && interview.questions.slice(1).map((q, i) => (
                <div key={q.id} className="bg-white/5 rounded-2xl p-4 space-y-2">
                  <p className="text-volt-400 font-bold text-sm">🎤 &ldquo;{q.question}&rdquo;</p>
                  {q.answer && <p className="text-white/70 text-sm leading-relaxed">{q.answer}</p>}
                </div>
              ))}

              {interview.questions.length > 1 && expanded !== interview.id && (
                <button
                  onClick={() => setExpanded(interview.id)}
                  className="w-full py-2 text-sm text-pitch-400 hover:text-pitch-300 font-semibold transition-colors"
                >
                  + {interview.questions.length - 1} more questions — Read full interview ↓
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
