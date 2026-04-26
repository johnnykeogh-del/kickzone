import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const userId = (session.user as any).id
  const { gameId } = await req.json()

  const game = await prisma.game.findUnique({ where: { id: gameId } })
  if (!game) return Response.json({ error: 'Game not found' }, { status: 404 })
  if (game.status !== 'WAITING') return Response.json({ error: 'Game already started' }, { status: 400 })
  if (game.player1Id === userId) return Response.json({ error: 'Cannot join your own game' }, { status: 400 })

  const updated = await prisma.game.update({
    where: { id: gameId },
    data: { player2Id: userId, status: 'ACTIVE', currentTurn: game.player1Id },
  })

  return Response.json({ gameId: updated.id })
}
