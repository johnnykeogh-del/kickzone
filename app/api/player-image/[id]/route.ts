export const dynamic = 'force-dynamic'

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const name = decodeURIComponent(params.id)

  const wikiRes = await fetch(
    `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(name)}`,
    { headers: { 'User-Agent': 'mykickzone/1.0' } }
  )

  if (wikiRes.ok) {
    const data = await wikiRes.json()
    const imageUrl = data.thumbnail?.source
    if (imageUrl) {
      const imgRes = await fetch(imageUrl)
      if (imgRes.ok) {
        const buffer = await imgRes.arrayBuffer()
        return new Response(buffer, {
          headers: {
            'Content-Type': imgRes.headers.get('content-type') || 'image/jpeg',
            'Cache-Control': 'public, max-age=86400',
          },
        })
      }
    }
  }

  return new Response('Not found', { status: 404 })
}
