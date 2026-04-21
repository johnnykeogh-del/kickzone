import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

// Seed featured pro player interviews (kid questions + real answers)
const FEATURED_INTERVIEWS = [
  {
    id: 'interview-haaland',
    title: 'Kids Interview: Erling Haaland',
    playerName: 'Erling Haaland',
    playerTeam: 'Manchester City',
    playerPosition: 'Striker',
    status: 'PUBLISHED',
    questions: [
      { q: 'What do you eat before a big game?', a: 'I always have pasta! Simple food gives me the energy I need to run and score. I also drink lots of water the day before.' },
      { q: 'How many hours do you train every day?', a: 'Usually around 3-4 hours on the training pitch, but I also do extra gym work and watch video of games. Football never stops!' },
      { q: 'What\'s it like scoring in front of 50,000 fans?', a: 'It\'s the best feeling in the world! The noise hits you like a wave. When the ball goes in, I just run — I don\'t even think!' },
      { q: 'What advice do you have for kids who want to be professionals?', a: 'Practice every single day, even when you don\'t feel like it. And enjoy it! If you love the game, that love will carry you further than anything else.' },
      { q: 'Who was your football hero when you were our age?', a: 'Definitely Ronaldo — both of them! I had posters on my wall and tried to copy their moves in the garden.' },
    ],
  },
  {
    id: 'interview-saka',
    title: 'Kids Interview: Bukayo Saka',
    playerName: 'Bukayo Saka',
    playerTeam: 'Arsenal',
    playerPosition: 'Winger',
    status: 'PUBLISHED',
    questions: [
      { q: 'How did you join Arsenal?', a: 'I joined the Arsenal academy when I was 7! I used to travel from home to training three times a week. It was tough but I loved it.' },
      { q: 'Are you nervous before big matches?', a: 'Yes! But I\'ve learned that nerves just mean you care. I turn that nervous energy into excitement and use it.' },
      { q: 'What\'s the best goal you\'ve ever scored?', a: 'I scored a long-range shot against Crystal Palace that felt perfect coming off my boot. That one felt amazing.' },
      { q: 'What position did you play when you were young?', a: 'I played everywhere! Striker, midfielder, even in goal once. Playing different positions taught me so much about football.' },
    ],
  },
]

async function seedInterviews() {
  for (const fi of FEATURED_INTERVIEWS) {
    const existing = await prisma.interview.findUnique({ where: { id: fi.id } })
    if (existing) continue

    // Find or create a system user for seeded content
    let systemUser = await prisma.user.findUnique({ where: { username: 'kickzone_hq' } })
    if (!systemUser) {
      const bcrypt = await import('bcryptjs')
      systemUser = await prisma.user.create({
        data: {
          email: 'hq@kickzone.com',
          password: await bcrypt.hash('system_pwd_not_used', 10),
          username: 'kickzone_hq',
          displayName: 'KickZone HQ',
          avatarEmoji: '🏆',
          role: 'ADMIN',
        },
      })
    }

    const interview = await prisma.interview.create({
      data: {
        id: fi.id,
        title: fi.title,
        playerName: fi.playerName,
        playerTeam: fi.playerTeam,
        playerPosition: fi.playerPosition,
        kidId: systemUser.id,
        status: fi.status,
        publishedAt: new Date(),
      },
    })

    for (const q of fi.questions) {
      await prisma.interviewQuestion.create({
        data: {
          interviewId: interview.id,
          userId: systemUser.id,
          question: q.q,
          answer: q.a,
        },
      })
    }
  }
}

export async function GET(req: NextRequest) {
  await seedInterviews()

  const interviews = await prisma.interview.findMany({
    where: { status: 'PUBLISHED' },
    include: {
      kid: { select: { username: true, displayName: true, avatarEmoji: true } },
      questions: { orderBy: { createdAt: 'asc' } },
    },
    orderBy: { publishedAt: 'desc' },
  })

  return NextResponse.json(interviews)
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })

  const { title, playerName, playerTeam, playerPosition } = await req.json()
  if (!title || !playerName || !playerTeam) return NextResponse.json({ error: 'Missing fields' }, { status: 400 })

  const interview = await prisma.interview.create({
    data: {
      title,
      playerName,
      playerTeam,
      playerPosition,
      kidId: (session.user as any).id,
      status: 'PENDING',
    },
  })

  return NextResponse.json(interview)
}
