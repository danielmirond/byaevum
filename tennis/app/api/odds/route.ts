import { NextResponse } from 'next/server'

const KEY  = process.env.TENNIS_RAPIDAPI_KEY!
const HOST = process.env.TENNIS_API1_HOST!

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'Event id required' }, { status: 400 })

  try {
    const res = await fetch(`https://${HOST}/api/tennis/event/${id}/odds`, {
      headers: { 'x-rapidapi-key': KEY, 'x-rapidapi-host': HOST },
      next: { revalidate: 120 },
      signal: AbortSignal.timeout(10000),
    })
    if (!res.ok) return NextResponse.json({ error: `API ${res.status}` }, { status: 502 })
    return NextResponse.json(await res.json())
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
