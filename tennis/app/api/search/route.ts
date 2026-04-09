import { NextResponse } from 'next/server'

const KEY  = process.env.TENNIS_RAPIDAPI_KEY!
const HOST = process.env.TENNIS_API2_HOST!

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const q = searchParams.get('q')

  if (!q || q.length < 2) {
    return NextResponse.json({ error: 'Query must be at least 2 characters' }, { status: 400 })
  }

  try {
    const res = await fetch(`https://${HOST}/tennis/v2/search?search=${encodeURIComponent(q)}`, {
      headers: {
        'x-rapidapi-key': KEY,
        'x-rapidapi-host': HOST,
        'Content-Type': 'application/json',
      },
      next: { revalidate: 3600 },
      signal: AbortSignal.timeout(10000),
    })

    if (!res.ok) {
      return NextResponse.json({ error: `API ${res.status}` }, { status: 502 })
    }

    const data = await res.json()
    return NextResponse.json(data)
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
