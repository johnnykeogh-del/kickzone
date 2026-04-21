'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function LoginPage() {
  const router = useRouter()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true); setError('')
    const res = await signIn('credentials', { ...form, redirect: false })
    if (res?.error) { setError('Wrong email or password — try again!'); setLoading(false); return }
    router.push('/')
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">⚽</div>
          <h1 className="text-3xl font-extrabold text-white">Welcome Back!</h1>
          <p className="text-white/40 mt-1">Sign in to KickZone</p>
        </div>

        <form onSubmit={submit} className="card space-y-4">
          {error && <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl text-sm">{error}</div>}

          <div>
            <label className="text-xs font-bold text-white/40 uppercase tracking-wider mb-1.5 block">Email</label>
            <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="you@example.com" className="input" required />
          </div>
          <div>
            <label className="text-xs font-bold text-white/40 uppercase tracking-wider mb-1.5 block">Password</label>
            <input type="password" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} placeholder="Your password" className="input" required />
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full py-3 text-base disabled:opacity-50">
            {loading ? 'Signing in...' : 'Sign In ⚡'}
          </button>
        </form>

        <p className="text-center text-white/30 text-sm mt-6">
          New to KickZone? <Link href="/register" className="text-pitch-400 hover:underline font-semibold">Join free! 🚀</Link>
        </p>
      </div>
    </div>
  )
}
