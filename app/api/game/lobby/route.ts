import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const userId = (session.user as any).id

  const waiting = await prisma.game.findMany({
    where: { status: 'WAITING', player1Id: { not: userId } },
    include: { player1: { select: { username: true, displayName: true, avatarEmoji: true } } },
    orderBy: { createdAt: 'desc' },
    take: 10,
  })

  const myActive = await prisma.game.findFirst({
    where: {
      status: 'ACTIVE',
      OR: [{ player1Id: userId }, { player2Id: userId }],
    },
  })

  return Response.json({ waiting, myActiveGameId: myActive?.id ?? null })
}
