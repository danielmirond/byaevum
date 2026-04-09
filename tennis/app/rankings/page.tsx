'use client'

import { useState, useEffect, useMemo } from 'react'
import RankingRow from '@/components/RankingRow'

interface RankingPlayer {
  ranking: number
  name: string
  team?: { name?: string; id?: number; country?: { alpha2?: string; name?: string } }
  country?: { name?: string; alpha2?: string }
  points: number
  previousRanking?: number
  bestRanking?: number
  id?: number
  prizeTotal?: number
}

export default function RankingsPage() {
  const [type, setType] = useState<'atp' | 'wta'>('atp')
  const [data, setData] = useState<RankingPlayer[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [showTop, setShowTop] = useState<number>(100)

  useEffect(() => {
    setLoading(true)
    setError('')
    setSearch('')
    setShowTop(100)
    fetch(`/api/rankings?type=${type}`)
      .then(r => r.json())
      .then(json => {
        const rankings: RankingPlayer[] = []
        const list = json.rankings || json.data || (Array.isArray(json) ? json : [])
        if (Array.isArray(list)) {
          list.forEach((item: Record<string, unknown>, i: number) => {
            const team = item.team as Record<string, unknown> | undefined
            const country = (team?.country ?? item.country) as Record<string, unknown> | undefined
            const pti = team?.playerTeamInfo as Record<string, unknown> | undefined
            rankings.push({
              ranking: Number(item.ranking ?? item.position ?? i + 1),
              name: String(team?.name ?? item.rowName ?? item.name ?? '—'),
              team: { name: String(team?.name ?? ''), id: Number(team?.id ?? 0), country: { alpha2: String(country?.alpha2 ?? ''), name: String(country?.name ?? '') } },
              country: { name: String(country?.name ?? ''), alpha2: String(country?.alpha2 ?? '') },
              points: Number(item.points ?? 0),
              previousRanking: item.previousRanking != null ? Number(item.previousRanking) : undefined,
              bestRanking: item.bestRanking != null ? Number(item.bestRanking) : undefined,
              id: Number(team?.id ?? item.id ?? 0),
              prizeTotal: pti?.prizeTotal ? Number(pti.prizeTotal) : undefined,
            })
          })
        }
        setData(rankings)
        setLoading(false)
      })
      .catch(e => { setError(String(e)); setLoading(false) })
  }, [type])

  const filtered = useMemo(() => {
    if (!search) return data.slice(0, showTop)
    const q = search.toLowerCase()
    return data.filter(p => p.name.toLowerCase().includes(q) || (p.country?.name ?? '').toLowerCase().includes(q))
  }, [data, search, showTop])

  return (
    <div>
      {/* Toggle */}
      <div style={{ display: 'flex', padding: '12px 14px', gap: 6 }}>
        {(['atp', 'wta'] as const).map(t => (
          <button
            key={t}
            onClick={() => setType(t)}
            style={{
              flex: 1, padding: '9px 0', borderRadius: 10,
              border: type === t ? '1px solid rgba(74,222,128,0.2)' : '1px solid rgba(255,255,255,0.06)',
              background: type === t ? 'rgba(74,222,128,0.08)' : 'rgba(255,255,255,0.02)',
              color: type === t ? '#4ade80' : 'rgba(255,255,255,0.3)',
              fontSize: 13, fontWeight: 700, cursor: 'pointer',
              textTransform: 'uppercase', letterSpacing: 2, fontFamily: 'inherit',
            }}
          >{t}</button>
        ))}
      </div>

      {/* Search */}
      <div style={{ padding: '0 14px 10px' }}>
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Buscar jugador o país..."
          style={{
            width: '100%', padding: '10px 14px', borderRadius: 10,
            border: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.03)',
            fontSize: 13, color: '#fff', outline: 'none', fontFamily: 'inherit',
            boxSizing: 'border-box', transition: 'border-color 0.2s',
          }}
          onFocus={e => { e.currentTarget.style.borderColor = 'rgba(74,222,128,0.2)' }}
          onBlur={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)' }}
        />
      </div>

      {/* Column header */}
      <div style={{
        padding: '2px 16px 6px', display: 'flex', fontSize: 9,
        color: 'rgba(255,255,255,0.12)', textTransform: 'uppercase', letterSpacing: 1.5,
        fontWeight: 600, alignItems: 'center', gap: 12,
      }}>
        <span style={{ width: 28, textAlign: 'right' }}>#</span>
        <span style={{ width: 28, textAlign: 'center' }}>+/-</span>
        <span style={{ flex: 1 }}>Jugador</span>
        <span>Pts</span>
        <span style={{ width: 14 }} />
      </div>

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0, padding: '0' }}>
          {[...Array(10)].map((_, i) => (
            <div key={i} style={{
              height: 56, borderBottom: '1px solid rgba(255,255,255,0.03)',
              background: 'rgba(255,255,255,0.02)',
              animation: 'pulse-skeleton 1.5s ease-in-out infinite',
              animationDelay: `${i * 0.08}s`,
            }} />
          ))}
          <style>{`@keyframes pulse-skeleton { 0%,100% { opacity: 0.3; } 50% { opacity: 0.7; } }`}</style>
        </div>
      ) : error ? (
        <div style={{ textAlign: 'center', padding: 40, color: '#ef4444', fontSize: 13 }}>{error}</div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 60, color: 'rgba(255,255,255,0.15)', fontSize: 13 }}>
          {search ? `No se encontró "${search}"` : 'Sin datos'}
        </div>
      ) : (
        <>
          {filtered.map(player => (
            <RankingRow
              key={`${player.ranking}-${player.name}`}
              position={player.ranking}
              name={player.name}
              country={player.country?.name}
              countryCode={player.country?.alpha2}
              points={player.points}
              change={player.previousRanking ? player.previousRanking - player.ranking : undefined}
              playerId={player.team?.id ?? player.id}
              bestRanking={player.bestRanking}
              prize={player.prizeTotal}
            />
          ))}
          {!search && showTop < data.length && (
            <button
              onClick={() => setShowTop(showTop + 100)}
              style={{
                width: '100%', padding: '14px 0', background: 'none',
                border: 'none', color: '#4ade80', fontSize: 12, fontWeight: 600,
                cursor: 'pointer', fontFamily: 'inherit', letterSpacing: 1,
                textTransform: 'uppercase',
              }}
            >
              Cargar más ({data.length - showTop} restantes)
            </button>
          )}
        </>
      )}
    </div>
  )
}
