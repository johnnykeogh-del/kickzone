'use client'

import { useState, useEffect, useCallback } from 'react'
import { useSession } from 'next-auth/react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Suspense } from 'react'

interface Comment {
  id: string
  body: string
  user: { displayName: string; avatarEmoji: string; username: string; favoriteTeam?: string }
  replies: Comment[]
  _count: { votes: number }
  createdAt: string
}

interface Discussion {
  id: string
  title: string
  body: string
  type: string
  matchLabel?: string
  user: { displayName: string; avatarEmoji: string; username: string }
  _count: { comments: number }
  createdAt: string
}

const TYPE_LABELS: Record<string, string> = {
  GENERAL: '💬 General',
  MATCH: '⚽ Match Chat',
  DEBATE: '🔥 Debate',
  QUESTION: '❓ Question',
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'Just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return `${Math.floor(hrs / 24)}d ago`
}

function DiscussionThread({ discussion }: { discussion: Discussion }) {
  const { data: session } = useSession()
  const [open, setOpen] = useState(false)
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState('')
  const [posting, setPosting] = useState(false)

  async function loadComments() {
    const res = await fetch(`/api/discussions/${discussion.id}/comments`)
    setComments(await res.json())
  }

  async function postComment() {
    if (!newComment.trim()) return
    setPosting(true)
    await fetch(`/api/discussions/${discussion.id}/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ body: newComment }),
    })
    setNewComment('')
    await loadComments()
    setPosting(false)
  }

  useEffect(() => { if (open) loadComments() }, [open])

  return (
    <div className="card space-y-3">
      <div className="flex items-start gap-3">
        <span className="text-2xl mt-0.5 shrink-0">{discussion.user.avatarEmoji}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-bold text-white text-sm">{discussion.user.displayName}</span>
            <span className={`badge text-xs ${discussion.type === 'MATCH' ? 'badge-fire' : discussion.type === 'DEBATE' ? 'badge-volt' : 'badge-sky'}`}>
              {TYPE_LABELS[discussion.type] || discussion.type}
            </span>
            {discussion.matchLabel && <span className="badge-green text-xs">{discussion.matchLabel}</span>}
          </div>
          <h3 className="font-extrabold text-white mt-1">{discussion.title}</h3>
          <p className="text-white/50 text-sm mt-1 leading-relaxed">{discussion.body}</p>
        </div>
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-white/5">
        <div className="flex items-center gap-4 text-xs text-white/30">
          <span>{timeAgo(discussion.createdAt)}</span>
          <span>💬 {discussion._count.comments} comments</span>
        </div>
        <button
          onClick={() => setOpen(!open)}
          className="text-sm text-pitch-400 hover:text-pitch-300 font-semibold transition-colors"
        >
          {open ? 'Hide ▲' : 'Join Chat ▼'}
        </button>
      </div>

      {open && (
        <div className="space-y-3 pt-2">
          {comments.map(c => (
            <div key={c.id} className="flex gap-3">
              <span className="text-xl shrink-0 mt-0.5">{c.user.avatarEmoji}</span>
              <div className="flex-1 bg-white/5 rounded-xl p-3">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold text-pitch-400">{c.user.displayName}</span>
                  {c.user.favoriteTeam && <span className="text-xs text-white/20">❤ {c.user.favoriteTeam}</span>}
                  <span className="text-xs text-white/20 ml-auto">{timeAgo(c.createdAt)}</span>
                </div>
                <p className="text-sm text-white/80 leading-relaxed">{c.body}</p>
              </div>
            </div>
          ))}

          {session ? (
            <div className="flex gap-2 mt-2">
              <span className="text-xl shrink-0">{(session.user as any)?.avatarEmoji || '⚽'}</span>
              <div className="flex-1 flex gap-2">
                <input
                  value={newComment}
                  onChange={e => setNewComment(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && !e.shiftKey && postComment()}
                  placeholder="Say something... ⚽"
                  className="input text-sm flex-1"
                />
                <button onClick={postComment} disabled={posting || !newComment.trim()} className="btn-primary text-sm px-4 disabled:opacity-40">
                  Send
                </button>
              </div>
            </div>
          ) : (
            <p className="text-sm text-white/30 text-center py-2">
              <Link href="/login" className="text-pitch-400 hover:underline font-semibold">Sign in</Link> to join the chat!
            </p>
          )}
        </div>
      )}
    </div>
  )
}

function NewDiscussionForm({ onCreated, defaultType, defaultMatchLabel }: { onCreated: () => void; defaultType?: string; defaultMatchLabel?: string }) {
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [type, setType] = useState(defaultType || 'GENERAL')
  const [posting, setPosting] = useState(false)
  const [show, setShow] = useState(!!defaultMatchLabel)

  async function submit() {
    if (!title.trim() || !body.trim()) return
    setPosting(true)
    await fetch('/api/discussions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, body, type, matchLabel: defaultMatchLabel }),
    })
    setTitle(''); setBody(''); setShow(false)
    onCreated()
    setPosting(false)
  }

  if (!show) return (
    <button onClick={() => setShow(true)} className="btn-volt w-full text-sm py-3">
      ✏️ Start a New Discussion
    </button>
  )

  return (
    <div className="card space-y-3">
      <h3 className="font-bold text-white">New Discussion {defaultMatchLabel && `— ${defaultMatchLabel}`}</h3>
      <select value={type} onChange={e => setType(e.target.value)} className="input text-sm">
        {Object.entries(TYPE_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
      </select>
      <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Your topic title..." className="input text-sm" />
      <textarea value={body} onChange={e => setBody(e.target.value)} placeholder="What do you want to discuss? ⚽" className="input text-sm resize-none h-24" />
      <div className="flex gap-2">
        <button onClick={submit} disabled={posting || !title || !body} className="btn-primary text-sm disabled:opacity-40 flex-1">Post It!</button>
        <button onClick={() => setShow(false)} className="btn-ghost text-sm px-4">Cancel</button>
      </div>
    </div>
  )
}

function DiscussionsContent() {
  const { data: session } = useSession()
  const searchParams = useSearchParams()
  const typeParam = searchParams.get('type') || ''
  const matchLabel = searchParams.get('label') || ''

  const [discussions, setDiscussions] = useState<Discussion[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState(typeParam || '')

  const load = useCallback(async () => {
    setLoading(true)
    const params = new URLSearchParams()
    if (filter) params.set('type', filter)
    const res = await fetch(`/api/discussions?${params}`)
    setDiscussions(await res.json())
    setLoading(false)
  }, [filter])

  useEffect(() => { load() }, [load])

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-white mb-2">💬 Discussions</h1>
        <p className="text-white/50">Chat with kids about football — matches, players, debates and more!</p>
      </div>

      {matchLabel && (
        <div className="card-green border-pitch-600/40 mb-5 flex items-center gap-3">
          <span className="text-2xl">⚽</span>
          <div>
            <p className="font-bold text-white">Discussing: {matchLabel}</p>
            <p className="text-white/40 text-sm">Share your thoughts on this match!</p>
          </div>
        </div>
      )}

      {session && (
        <div className="mb-6">
          <NewDiscussionForm onCreated={load} defaultType={typeParam || undefined} defaultMatchLabel={matchLabel || undefined} />
        </div>
      )}

      {!session && (
        <div className="card mb-6 text-center py-6">
          <p className="text-white/50 mb-3">Join the conversation!</p>
          <div className="flex gap-3 justify-center">
            <Link href="/register" className="btn-volt text-sm">Join Free 🚀</Link>
            <Link href="/login" className="btn-ghost text-sm">Sign In</Link>
          </div>
        </div>
      )}

      {/* Filter tabs */}
      <div className="flex gap-2 flex-wrap mb-5">
        {[['', '🌍 All'], ...Object.entries(TYPE_LABELS)].map(([k, v]) => (
          <button
            key={k}
            onClick={() => setFilter(k)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${filter === k ? 'bg-pitch-500 text-white' : 'bg-white/5 text-white/50 hover:bg-white/10'}`}
          >
            {v}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => <div key={i} className="card h-32 animate-pulse bg-white/5" />)}
        </div>
      ) : discussions.length === 0 ? (
        <div className="text-center py-16 text-white/30">
          <p className="text-4xl mb-3">💬</p>
          <p className="font-semibold">No discussions yet — be the first!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {discussions.map(d => <DiscussionThread key={d.id} discussion={d} />)}
        </div>
      )}
    </div>
  )
}

export default function DiscussionsPage() {
  return <Suspense fallback={<div className="text-white/30 text-center py-20">Loading...</div>}><DiscussionsContent /></Suspense>
}
