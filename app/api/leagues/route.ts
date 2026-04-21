import { NextRequest, NextResponse } from 'next/server'
import { getStandings, LEAGUES, LeagueCode } from '@/lib/football'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const code = (searchParams.get('code') || 'PL') as LeagueCode

  if (!LEAGUES[code]) return NextResponse.json({ error: 'Unknown league' }, { status: 400 })

  const standings = await getStandings(code)
  return NextResponse.json({ standings, league: LEAGUES[code], code })
}
