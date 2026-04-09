'use client'

import { useState, useEffect } from 'react'
import SwipeDays from '@/components/SwipeDays'

function pad(n: number) { return String(n).padStart(2, '0') }
function todayStr() { const d = new Date(); return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}` }

interface TvEvent {
  homeTeam?: { name?: string }
  awayTeam?: { name?: string }
  tournament?: { name?: string; uniqueTournament?: { name?: string; groundType?: string; tennisPoints?: number } }
  startTimestamp?: number
  status?: { type?: string; description?: string }
  id?: number
  channels?: Array<{ name?: string }>
  groundType?: string
  roundInfo?: { name?: string }
}

const channelStyle = (name: string) => {
  const n = name.toLowerCase()
  if (n.includes('eurosport'))  return { bg: 'rgba(59,130,246,0.12)', text: '#60a5fa' }
  if (n.includes('dazn'))       return { bg: 'rgba(255,193,7,0.1)', text: '#fbbf24' }
  if (n.includes('movistar'))   return { bg: 'rgba(59,130,246,0.12)', text: '#60a5fa' }
  if (n.includes('teledeporte') || n.includes('tdp')) return { bg: 'rgba(239,68,68,0.1)', text: '#ef4444' }
  if (n.includes('la 1') || n.includes('tve')) return { bg: 'rgba(59,130,246,0.12)', text: '#60a5fa' }
  return { bg: 'rgba(255,255,255,0.05)', text: 'rgba(255,255,255,0.4)' }
}

export default function TvPage() {
  const [date, setDate] = useState(todayStr())
  const [events, setEvents] = useState<TvEvent[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    fetch(`/api/matches?date=${date}`)
      .then(r => r.json())
      .then(json => {
        const evts = json.events?.events || json.events || []
        setEvents(Array.isArray(evts) ? evts : [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [date])

  const formatTime = (ts?: number) => {
    if (!ts) return ''
    return new Date(ts * 1000).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'Europe/Madrid' })
  }

  // Group by tournament
  const grouped: Record<string, TvEvent[]> = {}
  events.forEach(evt => {
    const key = evt.tournament?.uniqueTournament?.name ?? evt.tournament?.name ?? 'Otros'
    if (!grouped[key]) grouped[key] = []
    grouped[key].push(evt)
  })

  return (
    <div>
      <SwipeDays selectedDate={date} onDateChange={setDate} />

      {loading ? (
        <div style={{ textAlign: 'center', padding: 60 }}>
          <div style={{ width: 24, height: 24, border: '2px solid rgba(255,255,255,0.1)', borderTopColor: '#4ade80', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto' }} />
          <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
        </div>
      ) : events.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 60 }}>
          <div style={{ fontSize: 24, marginBottom: 8, opacity: 0.2 }}>📺</div>
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.2)', letterSpacing: 1 }}>Sin tenis en TV</div>
        </div>
      ) : (
        Object.entries(grouped).map(([tournament, matches]) => (
          <div key={tournament}>
            <div style={{
              padding: '16px 16px 8px',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: 1 }}>
                {tournament}
              </span>
              {matches[0]?.tournament?.uniqueTournament?.tennisPoints && (
                <span style={{
                  fontSize: 9, color: 'rgba(74,222,128,0.5)',
                  background: 'rgba(74,222,128,0.08)', padding: '1px 6px',
                  borderRadius: 6, fontWeight: 600,
                }}>
                  {matches[0].tournament.uniqueTournament.tennisPoints}pts
                </span>
              )}
            </div>

            <div style={{ padding: '0 10px' }}>
              {matches.map((evt, i) => {
                const isLive = evt.status?.type === 'inprogress'
                const surface = evt.groundType ?? evt.tournament?.uniqueTournament?.groundType
                return (
                  <div key={evt.id ?? i} style={{
                    background: isLive ? 'rgba(239,68,68,0.04)' : 'rgba(255,255,255,0.03)',
                    borderRadius: 12,
                    padding: '14px 16px',
                    marginBottom: 6,
                    border: isLive ? '1px solid rgba(239,68,68,0.15)' : '1px solid rgba(255,255,255,0.05)',
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, alignItems: 'center' }}>
                      <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                        {surface && (
                          <span style={{
                            padding: '2px 5px', borderRadius: 3, fontSize: 9, fontWeight: 600,
                            background: surface.toLowerCase().includes('clay') ? 'rgba(234,88,12,0.15)' : 'rgba(59,130,246,0.15)',
                            color: surface.toLowerCase().includes('clay') ? '#fb923c' : '#60a5fa',
                          }}>{surface}</span>
                        )}
                        <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.2)' }}>{evt.roundInfo?.name}</span>
                      </div>
                      <span style={{
                        fontSize: 13, fontVariantNumeric: 'tabular-nums', fontWeight: 600,
                        color: isLive ? '#ef4444' : '#fff',
                        display: 'flex', alignItems: 'center', gap: 4,
                      }}>
                        {isLive && <span style={{ fontSize: 5, animation: 'pulse-live 1.5s infinite' }}>●</span>}
                        {isLive ? evt.status?.description : formatTime(evt.startTimestamp)}
                      </span>
                    </div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: '#fff', marginBottom: 10 }}>
                      {evt.homeTeam?.name ?? '—'}
                      <span style={{ color: 'rgba(255,255,255,0.15)', margin: '0 6px', fontWeight: 400, fontSize: 12 }}>vs</span>
                      {evt.awayTeam?.name ?? '—'}
                    </div>
                    {evt.channels && evt.channels.length > 0 && (
                      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                        {evt.channels.map((ch, j) => {
                          const cs = channelStyle(ch.name ?? '')
                          return (
                            <span key={j} style={{
                              padding: '3px 10px', borderRadius: 6, fontSize: 10, fontWeight: 600,
                              background: cs.bg, color: cs.text, letterSpacing: 0.5,
                            }}>{ch.name}</span>
                          )
                        })}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        ))
      )}
    </div>
  )
}
