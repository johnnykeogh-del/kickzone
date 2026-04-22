import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import bcrypt from 'bcryptjs'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  const { email, password, username, displayName, age, avatarEmoji, favoriteTeam } = await req.json()

  if (!email || !password || !username || !displayName) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const exists = await prisma.user.findFirst({
    where: { OR: [{ email }, { username }] },
  })
  if (exists) return NextResponse.json({ error: 'Email or username already taken' }, { status: 409 })

  const hashed = await bcrypt.hash(password, 10)
  const user = await prisma.user.create({
    data: { email, password: hashed, username, displayName, age, avatarEmoji: avatarEmoji || '⚽', favoriteTeam },
  })

  return NextResponse.json({ ok: true, id: user.id })
}
