import { NextRequest, NextResponse } from 'next/server'
import { getAllLeaguePlayers } from '@/lib/football'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const search   = (searchParams.get('q') || '').toLowerCase()
  const position = (searchParams.get('position') || '').toLowerCase()
  const league   = searchParams.get('league') || ''
  const sort     = searchParams.get('sort') || 'az'
  const page     = Math.max(1, parseInt(searchParams.get('page') || '1'))
  const limit    = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') || '24')))

  let players = await getAllLeaguePlayers()

  if (search)   players = players.filter(p => p.name.toLowerCase().includes(search) || p.team.toLowerCase().includes(search))
  if (position) players = players.filter(p => p.position.toLowerCase().includes(position))
  if (league)   players = players.filter(p => p.leagueCode === league)

  if (sort === 'az')       players = [...players].sort((a, b) => a.name.localeCompare(b.name))
  else if (sort === 'za')  players = [...players].sort((a, b) => b.name.localeCompare(a.name))
  else if (sort === 'youngest') players = [...players].sort((a, b) => (b.age || 99) - (a.age || 99))
  else if (sort === 'oldest')   players = [...players].sort((a, b) => (a.age || 0) - (b.age || 0))
  else if (sort === 'number')   players = [...players].sort((a, b) => (a.shirtNumber ?? 999) - (b.shirtNumber ?? 999))

  const total  = players.length
  const pages  = Math.ceil(total / limit)
  const offset = (page - 1) * limit
  const data   = players.slice(offset, offset + limit)

  return NextResponse.json({ players: data, total, page, pages })
}
