import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { getCard } from '@/lib/cards'

export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const userId = (session.user as any).id
  const { gameId, stat } = await req.json()

  const game = await prisma.game.findUnique({ where: { id: gameId } })
  if (!game) return Response.json({ error: 'Game not found' }, { status: 404 })
  if (game.status !== 'ACTIVE') return Response.json({ error: 'Game not active' }, { status: 400 })
  if (game.currentTurn !== userId) return Response.json({ error: 'Not your turn' }, { status: 400 })

  const p1Deck: number[] = JSON.parse(game.player1Deck)
  const p2Deck: number[] = JSON.parse(game.player2Deck)

  const p1Card = getCard(p1Deck[0])
  const p2Card = getCard(p2Deck[0])

  const p1Val = p1Card[stat as keyof typeof p1Card] as number
  const p2Val = p2Card[stat as keyof typeof p2Card] as number

  let roundWinner: string | null = null
  let newP1Deck = p1Deck.slice(1)
  let newP2Deck = p2Deck.slice(1)

  if (p1Val > p2Val) {
    roundWinner = game.player1Id
    newP1Deck = [...newP1Deck, p1Deck[0], p2Deck[0]]
  } else if (p2Val > p1Val) {
    roundWinner = game.player2Id!
    newP2Deck = [...newP2Deck, p2Deck[0], p1Deck[0]]
  } else {
    // Draw — both players keep their card
    newP1Deck = [...newP1Deck, p1Deck[0]]
    newP2Deck = [...newP2Deck, p2Deck[0]]
  }

  const nextTurn = game.currentTurn === game.player1Id ? game.player2Id! : game.player1Id

  let status = 'ACTIVE'
  let winnerId: string | null = null

  if (newP1Deck.length === 0) {
    status = 'FINISHED'
    winnerId = game.player2Id
  } else if (newP2Deck.length === 0) {
    status = 'FINISHED'
    winnerId = game.player1Id
  }

  const updated = await prisma.game.update({
    where: { id: gameId },
    data: {
      player1Deck: JSON.stringify(newP1Deck),
      player2Deck: JSON.stringify(newP2Deck),
      currentTurn: status === 'ACTIVE' ? nextTurn : null,
      roundStat: stat,
      status,
      winnerId,
    },
  })

  return Response.json({
    p1Card,
    p2Card,
    stat,
    p1Val,
    p2Val,
    roundWinner,
    p1DeckSize: newP1Deck.length,
    p2DeckSize: newP2Deck.length,
    status: updated.status,
    winnerId: updated.winnerId,
  })
}
