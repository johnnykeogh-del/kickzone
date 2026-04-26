import { NextRequest, NextResponse } from 'next/server'
import { getAllLeaguePlayers } from '@/lib/football'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const search   = (searchParams.get('q') || '').toLowerCase()
  const position = (searchParams.get('position') || '').toLowerCase()
  const league   = searchParams.get('league') || ''
  const page     = Math.max(1, parseInt(searchParams.get('page') || '1'))
  const limit    = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') || '24')))

  let players = await getAllLeaguePlayers()

  if (search)   players = players.filter(p => p.name.toLowerCase().includes(search) || p.team.toLowerCase().includes(search))
  if (position) players = players.filter(p => p.position.toLowerCase().includes(position))
  if (league)   players = players.filter(p => p.leagueCode === league)

  const total  = players.length
  const pages  = Math.ceil(total / limit)
  const offset = (page - 1) * limit
  const data   = players.slice(offset, offset + limit)

  return NextResponse.json({ players: data, total, page, pages })
}
