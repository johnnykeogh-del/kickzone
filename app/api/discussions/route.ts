import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const type = searchParams.get('type') || undefined

  const discussions = await prisma.discussion.findMany({
    where: type ? { type } : undefined,
    include: {
      user: { select: { username: true, displayName: true, avatarEmoji: true, favoriteTeam: true } },
      _count: { select: { comments: true } },
    },
    orderBy: { createdAt: 'desc' },
    take: 30,
  })

  return NextResponse.json(discussions)
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })

  const { title, body, type, matchLabel } = await req.json()
  if (!title || !body) return NextResponse.json({ error: 'Title and body required' }, { status: 400 })

  const discussion = await prisma.discussion.create({
    data: {
      title, body,
      type: type || 'GENERAL',
      matchLabel,
      userId: (session.user as any).id,
    },
    include: {
      user: { select: { username: true, displayName: true, avatarEmoji: true } },
      _count: { select: { comments: true } },
    },
  })

  return NextResponse.json(discussion)
}
