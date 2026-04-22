import { NextRequest, NextResponse } from 'next/server'
import { TOP_PLAYERS } from '@/lib/football'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const search = (searchParams.get('q') || '').toLowerCase()
  const position = searchParams.get('position') || ''

  let players = TOP_PLAYERS
  if (search) players = players.filter(p => p.name.toLowerCase().includes(search) || p.team.toLowerCase().includes(search))
  if (position) players = players.filter(p => p.position.toLowerCase().includes(position.toLowerCase()))

  return NextResponse.json(players)
}
