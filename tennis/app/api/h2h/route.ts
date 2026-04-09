import { NextResponse } from 'next/server'

const KEY  = process.env.TENNIS_RAPIDAPI_KEY!
const HOST = process.env.TENNIS_API1_HOST!

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const p1 = searchParams.get('player1')
  const p2 = searchParams.get('player2')

  if (!p1 || !p2) {
    return NextResponse.json({ error: 'player1 and player2 IDs required' }, { status: 400 })
  }

  try {
    const res = await fetch(`https://${HOST}/api/tennis/team/${p1}/h2h/${p2}`, {
      headers: {
        'x-rapidapi-key': KEY,
        'x-rapidapi-host': HOST,
        'Content-Type': 'application/json',
      },
      next: { revalidate: 600 },
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
