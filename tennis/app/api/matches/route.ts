import { NextResponse } from 'next/server'

const KEY  = process.env.TENNIS_RAPIDAPI_KEY!
const HOST = process.env.TENNIS_API1_HOST!

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const dateParam = searchParams.get('date') ?? new Date().toISOString().split('T')[0]

  // Convert YYYY-MM-DD to DD/MM/YYYY for the API
  const [y, m, d] = dateParam.split('-')
  const apiDate = `${d}/${m}/${y}`

  try {
    const res = await fetch(`https://${HOST}/api/tennis/events/${apiDate}`, {
      headers: {
        'x-rapidapi-key': KEY,
        'x-rapidapi-host': HOST,
        'Content-Type': 'application/json',
      },
      next: { revalidate: 120 },
      signal: AbortSignal.timeout(10000),
    })

    if (!res.ok) {
      return NextResponse.json({ error: `API ${res.status}` }, { status: 502 })
    }

    const data = await res.json()
    return NextResponse.json({ events: data, date: dateParam })
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
