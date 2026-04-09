'use client'

import { useState, useEffect, useCallback } from 'react'
import SwipeDays from '@/components/SwipeDays'
import MatchCard from '@/components/MatchCard'

function pad(n: number) { return String(n).padStart(2, '0') }
function todayStr() { const d = new Date(); return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}` }
function isToday(d: string) { return d === todayStr() }

interface Event {
  tournament?: { name?: string; slug?: string; id?: number; category?: { name?: string; slug?: string }; uniqueTournament?: { name?: string; groundType?: string; tennisPoints?: number } }
  homeTeam?: { name?: string; id?: number; country?: { alpha2?: string } }
  awayTeam?: { name?: string; id?: number; country?: { alpha2?: string } }
  homeTeamSeed?: string
  awayTeamSeed?: string
  homeScore?: { current?: number; display?: number; period1?: number; period2?: number; period3?: number; period4?: number; period5?: number; point?: string }
  awayScore?: { current?: number; display?: number; period1?: number; period2?: number; period3?: number; period4?: number; period5?: number; point?: string }
  status?: { type?: string; description?: string }
  startTimestamp?: number
  id?: number
  roundInfo?: { name?: string; round?: number }
  groundType?: string
  slug?: string
}

function formatTime(ts?: number): string {
  if (!ts) return ''
  return new Date(ts * 1000).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'Europe/Madrid' })
}

function isDoubles(evt: Event): boolean {
  const slug = evt.slug ?? ''
  const tName = evt.tournament?.name ?? ''
  return slug.includes('-doubles') || tName.toLowerCase().includes('double') || tName.toLowerCase().includes('dobles')
    || (evt.homeTeam?.name?.includes('/') ?? false)
}

type Filter = 'all' | 'atp' | 'wta' | 'live'

export default function ResultadosPage() {
  const [date, setDate] = useState(todayStr())
  const [events, setEvents] = useState<Event[]>([])
  const [liveEvents, setLiveEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<Filter>('all')
  const [showDoubles, setShowDoubles] = useState(false)
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch(`/api/matches?date=${date}`)
      const json = await res.json()
      const evts = json.events?.events || json.events || []
      setEvents(Array.isArray(evts) ? evts : [])
      setLastUpdate(new Date())
    } catch { /* ignore */ }
    setLoading(false)
  }, [date])

  const fetchLive = useCallback(async () => {
    if (!isToday(date)) return
    try {
      const res = await fetch('/api/live')
      const json = await res.json()
      setLiveEvents(Array.isArray(json.events) ? json.events : [])
      setLastUpdate(new Date())
    } catch { /* ignore */ }
  }, [date])

  useEffect(() => {
    setLoading(true)
    fetchData()
    if (isToday(date)) fetchLive()
  }, [date, fetchData, fetchLive])

  useEffect(() => {
    if (!isToday(date)) return
    const interval = setInterval(() => { fetchLive(); fetchData() }, 30000)
    return () => clearInterval(interval)
  }, [date, fetchLive, fetchData])

  // Merge live into events
  const merged = events.map(evt => {
    const live = liveEvents.find(le => le.id === evt.id)
    return live ? { ...evt, ...live } : evt
  })

  // Apply filters
  let filtered = merged
  if (filter === 'atp') filtered = merged.filter(e => e.tournament?.category?.slug === 'atp' || e.tournament?.category?.name === 'ATP')
  else if (filter === 'wta') filtered = merged.filter(e => e.tournament?.category?.slug === 'wta' || e.tournament?.category?.name === 'WTA')
  else if (filter === 'live') filtered = merged.filter(e => e.status?.type === 'inprogress')

  if (!showDoubles) filtered = filtered.filter(e => !isDoubles(e))

  // Separate live vs rest
  const live = filtered.filter(e => e.status?.type === 'inprogress')
  const rest = filtered.filter(e => e.status?.type !== 'inprogress')

  // Group rest by tournament
  const grouped: Record<string, Event[]> = {}
  rest.forEach(evt => {
    const key = evt.tournament?.uniqueTournament?.name ?? evt.tournament?.name ?? 'Otros'
    if (!grouped[key]) grouped[key] = []
    grouped[key].push(evt)
  })

  const totalLive = liveEvents.filter(e => !showDoubles ? !isDoubles(e) : true).length

  const FILTERS: { key: Filter; label: string }[] = [
    { key: 'all', label: 'Todos' },
    { key: 'live', label: `Live${totalLive > 0 ? ` (${totalLive})` : ''}` },
    { key: 'atp', label: 'ATP' },
    { key: 'wta', label: 'WTA' },
  ]

  return (
    <div>
      <SwipeDays selectedDate={date} onDateChange={setDate} />

      {/* Filters */}
      <div style={{
        display: 'flex',
        gap: 6,
        padding: '10px 12px 6px',
        overflowX: 'auto',
        scrollbarWidth: 'none',
        alignItems: 'center',
      }}>
        {FILTERS.map(f => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            style={{
              padding: '5px 12px',
              borderRadius: 16,
              border: filter === f.key ? '1px solid rgba(74,222,128,0.25)' : '1px solid rgba(255,255,255,0.06)',
              background: filter === f.key ? 'rgba(74,222,128,0.08)' : 'transparent',
              color: filter === f.key ? '#4ade80' : 'rgba(255,255,255,0.35)',
              fontSize: 11,
              fontWeight: 600,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              fontFamily: 'inherit',
              letterSpacing: 0.5,
              transition: 'all 0.15s',
            }}
          >
            {f.label}
          </button>
        ))}
        <span style={{ width: 1, height: 16, background: 'rgba(255,255,255,0.06)', flexShrink: 0 }} />
        <button
          onClick={() => setShowDoubles(!showDoubles)}
          style={{
            padding: '5px 12px',
            borderRadius: 16,
            border: showDoubles ? '1px solid rgba(74,222,128,0.25)' : '1px solid rgba(255,255,255,0.06)',
            background: showDoubles ? 'rgba(74,222,128,0.08)' : 'transparent',
            color: showDoubles ? '#4ade80' : 'rgba(255,255,255,0.35)',
            fontSize: 11,
            fontWeight: 600,
            cursor: 'pointer',
            whiteSpace: 'nowrap',
            fontFamily: 'inherit',
            letterSpacing: 0.5,
          }}
        >
          Dobles
        </button>

        {/* Last update */}
        {lastUpdate && isToday(date) && (
          <span style={{
            marginLeft: 'auto',
            fontSize: 9,
            color: 'rgba(255,255,255,0.15)',
            whiteSpace: 'nowrap',
            flexShrink: 0,
          }}>
            {lastUpdate.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
          </span>
        )}
      </div>

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, padding: '16px 10px' }}>
          {[...Array(6)].map((_, i) => (
            <div key={i} style={{
              height: 80,
              borderRadius: 12,
              background: 'rgba(255,255,255,0.03)',
              animation: 'pulse-skeleton 1.5s ease-in-out infinite',
              animationDelay: `${i * 0.1}s`,
            }} />
          ))}
          <style>{`@keyframes pulse-skeleton { 0%,100% { opacity: 0.4; } 50% { opacity: 0.8; } }`}</style>
        </div>
      ) : (
        <>
          {/* Live */}
          {live.length > 0 && (
            <div>
              <div style={{ padding: '12px 16px 6px', display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#ef4444', animation: 'pulse-live 1.5s infinite' }} />
                <span style={{ fontSize: 11, fontWeight: 700, color: '#ef4444', textTransform: 'uppercase', letterSpacing: 1.5 }}>En vivo</span>
                <span style={{ fontSize: 10, color: '#ef4444', background: 'rgba(239,68,68,0.1)', padding: '1px 6px', borderRadius: 8, fontWeight: 600 }}>{live.length}</span>
              </div>
              <div style={{ padding: '0 10px' }}>
                {live.map((evt, i) => (
                  <MatchCard
                    key={evt.id ?? i}
                    id={evt.id}
                    homePlayer={evt.homeTeam?.name ?? '—'}
                    awayPlayer={evt.awayTeam?.name ?? '—'}
                    homeCountry={evt.homeTeam?.country?.alpha2}
                    awayCountry={evt.awayTeam?.country?.alpha2}
                    homeSeed={evt.homeTeamSeed}
                    awaySeed={evt.awayTeamSeed}
                    homeScore={evt.homeScore}
                    awayScore={evt.awayScore}
                    time={formatTime(evt.startTimestamp)}
                    status={evt.status?.type}
                    statusDesc={evt.status?.description}
                    round={evt.roundInfo?.name}
                    surface={evt.groundType ?? evt.tournament?.uniqueTournament?.groundType}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Grouped */}
          {Object.entries(grouped).map(([tournament, matches]) => (
            <div key={tournament}>
              <div style={{ padding: '14px 16px 6px', display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: 1 }}>{tournament}</span>
                {matches[0]?.tournament?.uniqueTournament?.tennisPoints && (
                  <span style={{ fontSize: 9, color: 'rgba(74,222,128,0.5)', background: 'rgba(74,222,128,0.08)', padding: '1px 6px', borderRadius: 6, fontWeight: 600 }}>
                    {matches[0].tournament.uniqueTournament.tennisPoints}pts
                  </span>
                )}
                <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.15)', marginLeft: 'auto' }}>{matches.length}</span>
              </div>
              <div style={{ padding: '0 10px' }}>
                {matches.map((evt, i) => (
                  <MatchCard
                    key={evt.id ?? i}
                    id={evt.id}
                    homePlayer={evt.homeTeam?.name ?? '—'}
                    awayPlayer={evt.awayTeam?.name ?? '—'}
                    homeCountry={evt.homeTeam?.country?.alpha2}
                    awayCountry={evt.awayTeam?.country?.alpha2}
                    homeSeed={evt.homeTeamSeed}
                    awaySeed={evt.awayTeamSeed}
                    homeScore={evt.homeScore}
                    awayScore={evt.awayScore}
                    time={formatTime(evt.startTimestamp)}
                    status={evt.status?.type}
                    statusDesc={evt.status?.description}
                    round={evt.roundInfo?.name}
                    surface={evt.groundType ?? evt.tournament?.uniqueTournament?.groundType}
                  />
                ))}
              </div>
            </div>
          ))}

          {filtered.length === 0 && (
            <div style={{ textAlign: 'center', padding: 60 }}>
              <div style={{ fontSize: 24, marginBottom: 8, opacity: 0.15 }}>🎾</div>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.15)', letterSpacing: 1 }}>
                {filter === 'live' ? 'Sin partidos en vivo' : 'Sin partidos'}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
