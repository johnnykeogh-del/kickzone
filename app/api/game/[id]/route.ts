import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { getCard } from '@/lib/cards'

export const dynamic = 'force-dynamic'

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session?.user) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const userId = (session.user as any).id
  const game = await prisma.game.findUnique({
    where: { id: params.id },
    include: {
      player1: { select: { id: true, username: true, displayName: true, avatarEmoji: true } },
      player2: { select: { id: true, username: true, displayName: true, avatarEmoji: true } },
    },
  })

  if (!game) return Response.json({ error: 'Not found' }, { status: 404 })
  if (game.player1Id !== userId && game.player2Id !== userId)
    return Response.json({ error: 'Not in this game' }, { status: 403 })

  const isP1 = game.player1Id === userId
  const myDeck: number[] = JSON.parse(isP1 ? game.player1Deck : game.player2Deck)
  const oppDeck: number[] = JSON.parse(isP1 ? game.player2Deck : game.player1Deck)

  return Response.json({
    id: game.id,
    status: game.status,
    isMyTurn: game.currentTurn === userId,
    myCard: myDeck.length > 0 ? getCard(myDeck[0]) : null,
    myDeckSize: myDeck.length,
    oppDeckSize: oppDeck.length,
    opponent: isP1 ? game.player2 : game.player1,
    winnerId: game.winnerId,
    iWon: game.winnerId === userId,
  })
}
