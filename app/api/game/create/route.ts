import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { dealCards } from '@/lib/cards'

export const dynamic = 'force-dynamic'

export async function POST() {
  const session = await getServerSession(authOptions)
  if (!session?.user) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const userId = (session.user as any).id
  const { p1, p2 } = dealCards()

  const game = await prisma.game.create({
    data: {
      player1Id: userId,
      status: 'WAITING',
      player1Deck: JSON.stringify(p1),
      player2Deck: JSON.stringify(p2),
    },
  })

  return Response.json({ gameId: game.id })
}
