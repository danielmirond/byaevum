'use client'

import { useState, useEffect } from 'react'
import MatchCard from '@/components/MatchCard'

interface TournamentData {
  tournament?: { name?: string; id?: number }
  events?: Array<{
    homeTeam?: { name?: string }
    awayTeam?: { name?: string }
    homeTeamSeed?: string
    awayTeamSeed?: string
    homeScore?: { current?: number; period1?: number; period2?: number; period3?: number; point?: string }
    awayScore?: { current?: number; period1?: number; period2?: number; period3?: number; point?: string }
    status?: { type?: string; description?: string }
    startTimestamp?: number
    roundInfo?: { name?: string; round?: number }
    id?: number
    groundType?: string
  }>
}

function formatTime(ts?: number): string {
  if (!ts) return ''
  return new Date(ts * 1000).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'Europe/Madrid' })
}

interface Props { slug: string; id?: string }

export default function CompetitionDetail({ slug, id }: Props) {
  const [data, setData] = useState<TournamentData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const name = slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())

  useEffect(() => {
    if (!id) { setLoading(false); setError('ID de competición no disponible.'); return }
    fetch(`/api/competition?id=${id}`)
      .then(r => r.json())
      .then(json => { setData(json); setLoading(false) })
      .catch(e => { setError(String(e)); setLoading(false) })
  }, [id])

  if (loading) return (
    <div style={{ textAlign: 'center', padding: 60 }}>
      <div style={{ width: 24, height: 24, border: '2px solid rgba(255,255,255,0.1)', borderTopColor: '#4ade80', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto' }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  )
  if (error) return <div style={{ textAlign: 'center', padding: 40, color: 'rgba(255,255,255,0.4)', fontSize: 13 }}>{error}</div>

  const events = data?.events ?? []

  return (
    <div style={{ padding: '24px 12px' }}>
      <div style={{ textAlign: 'center', marginBottom: 20 }}>
        <h1 style={{ fontSize: 18, fontWeight: 800, color: '#fff', letterSpacing: 1, textTransform: 'uppercase', margin: 0 }}>
          {data?.tournament?.name ?? name}
        </h1>
        <div style={{ width: 24, height: 2, background: '#4ade80', margin: '10px auto 0', borderRadius: 2 }} />
      </div>

      {events.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 30, color: 'rgba(255,255,255,0.15)', fontSize: 13 }}>Sin partidos</div>
      ) : (
        events.map((evt, i) => (
          <MatchCard
            key={evt.id ?? i}
            id={evt.id}
            homePlayer={evt.homeTeam?.name ?? '—'}
            awayPlayer={evt.awayTeam?.name ?? '—'}
            homeSeed={evt.homeTeamSeed}
            awaySeed={evt.awayTeamSeed}
            homeScore={evt.homeScore}
            awayScore={evt.awayScore}
            time={formatTime(evt.startTimestamp)}
            status={evt.status?.type}
            statusDesc={evt.status?.description}
            round={evt.roundInfo?.name}
            surface={evt.groundType}
          />
        ))
      )}
    </div>
  )
}
