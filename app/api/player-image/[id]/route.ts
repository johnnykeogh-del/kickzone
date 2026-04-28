export const dynamic = 'force-dynamic'

const UA = 'mykickzone/1.0 (kids football site)'
const CACHE = 'public, max-age=604800'

// ── Wikipedia ───────────────────────────────────────────────────
async function wikiImage(title: string): Promise<string | null> {
  try {
    const res = await fetch(
      `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`,
      { headers: { 'User-Agent': UA }, next: { revalidate: 604800 } }
    )
    if (!res.ok) return null
    const data = await res.json()
    return data.thumbnail?.source ?? null
  } catch { return null }
}

// ── TheSportsDB (free tier, no key needed) ─────────────────────
async function sportsDbImage(name: string): Promise<string | null> {
  try {
    const res = await fetch(
      `https://www.thesportsdb.com/api/v1/json/3/searchplayers.php?p=${encodeURIComponent(name)}`,
      { next: { revalidate: 604800 } }
    )
    if (!res.ok) return null
    const data = await res.json()
    const p = data.player?.[0]
    return p?.strThumb || p?.strCutout || null
  } catch { return null }
}

// ── SVG initials avatar (final fallback — always works) ─────────
function svgAvatar(name: string, pos: string): Response {
  const initials = name.split(' ').map((w: string) => w[0]).filter(Boolean).slice(0, 2).join('').toUpperCase()
  const colors: Record<string, [string, string]> = {
    Goalkeeper: ['#EAB308', '#3d3200'],
    Defender:   ['#22C55E', '#052e16'],
    Midfielder: ['#3B82F6', '#1e3a8a'],
    Forward:    ['#EF4444', '#450a0a'],
  }
  const [fg, bg] = colors[pos] || ['#9CA3AF', '#1f2937']
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80"><circle cx="40" cy="40" r="40" fill="${bg}"/><text x="40" y="52" text-anchor="middle" fill="${fg}" font-family="system-ui,sans-serif" font-size="26" font-weight="bold">${initials}</text></svg>`
  return new Response(svg, {
    headers: { 'Content-Type': 'image/svg+xml', 'Cache-Control': CACHE },
  })
}

async function proxyImage(url: string): Promise<Response | null> {
  try {
    const res = await fetch(url, { headers: { 'User-Agent': UA } })
    if (!res.ok) return null
    const buf = await res.arrayBuffer()
    return new Response(buf, {
      headers: {
        'Content-Type': res.headers.get('content-type') || 'image/jpeg',
        'Cache-Control': CACHE,
      },
    })
  } catch { return null }
}

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const name = decodeURIComponent(params.id)
  const url  = new URL(req.url)
  const pos  = url.searchParams.get('pos') || ''

  // 1. Try Wikipedia: run exact + (footballer) in parallel for speed
  const [imgExact, imgFoot] = await Promise.all([
    wikiImage(name),
    wikiImage(`${name} (footballer)`),
  ])
  let imageUrl = imgExact || imgFoot

  // 2. TheSportsDB fallback
  if (!imageUrl) imageUrl = await sportsDbImage(name)

  // 3. Proxy the found image
  if (imageUrl) {
    const proxied = await proxyImage(imageUrl)
    if (proxied) return proxied
  }

  // 4. Always return something — SVG initials avatar
  return svgAvatar(name, pos)
}
