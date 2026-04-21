import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const comments = await prisma.comment.findMany({
    where: { discussionId: params.id, parentId: null },
    include: {
      user: { select: { username: true, displayName: true, avatarEmoji: true, favoriteTeam: true } },
      replies: {
        include: {
          user: { select: { username: true, displayName: true, avatarEmoji: true } },
          _count: { select: { votes: true } },
        },
        orderBy: { createdAt: 'asc' },
      },
      _count: { select: { votes: true } },
    },
    orderBy: { createdAt: 'asc' },
  })
  return NextResponse.json(comments)
}

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session?.user) return NextResponse.json({ error: 'Sign in to comment' }, { status: 401 })

  const { body, parentId } = await req.json()
  if (!body?.trim()) return NextResponse.json({ error: 'Comment cannot be empty' }, { status: 400 })

  const comment = await prisma.comment.create({
    data: {
      body: body.trim(),
      discussionId: params.id,
      userId: (session.user as any).id,
      parentId: parentId || null,
    },
    include: {
      user: { select: { username: true, displayName: true, avatarEmoji: true } },
      _count: { select: { votes: true } },
    },
  })

  return NextResponse.json(comment)
}
