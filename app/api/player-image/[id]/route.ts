export const dynamic = 'force-dynamic'

async function fetchWikiImage(title: string): Promise<string | null> {
  const res = await fetch(
    `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`,
    { headers: { 'User-Agent': 'mykickzone/1.0' }, next: { revalidate: 604800 } }
  )
  if (!res.ok) return null
  const data = await res.json()
  return data.thumbnail?.source ?? null
}

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const name = decodeURIComponent(params.id)

  // Try exact name, then "(footballer)" disambiguation, then search
  const attempts = [
    name,
    `${name} (footballer)`,
    `${name} (soccer)`,
  ]

  let imageUrl: string | null = null
  for (const attempt of attempts) {
    imageUrl = await fetchWikiImage(attempt)
    if (imageUrl) break
  }

  if (imageUrl) {
    const imgRes = await fetch(imageUrl)
    if (imgRes.ok) {
      const buffer = await imgRes.arrayBuffer()
      return new Response(buffer, {
        headers: {
          'Content-Type': imgRes.headers.get('content-type') || 'image/jpeg',
          'Cache-Control': 'public, max-age=604800',
        },
      })
    }
  }

  return new Response('Not found', { status: 404 })
}
