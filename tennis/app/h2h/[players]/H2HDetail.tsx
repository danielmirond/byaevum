'use client'

import { useState, useEffect } from 'react'

interface H2HData {
  homeTeam?: { name?: string; id?: number }
  awayTeam?: { name?: string; id?: number }
  homeWins?: number
  awayWins?: number
  events?: Array<{
    homeTeam?: { name?: string }
    awayTeam?: { name?: string }
    homeScore?: { current?: number; display?: string; period1?: number; period2?: number; period3?: number }
    awayScore?: { current?: number; display?: string; period1?: number; period2?: number; period3?: number }
    tournament?: { name?: string; uniqueTournament?: { name?: string; groundType?: string } }
    startTimestamp?: number
    roundInfo?: { name?: string }
    groundType?: string
  }>
}

interface Props { players: string; p1?: string; p2?: string }

export default function H2HDetail({ players, p1, p2 }: Props) {
  const [data, setData] = useState<H2HData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const names = players.replace(/-vs-/i, ' vs ').replace(/-/g, ' ')
  const capitalized = names.replace(/\b\w/g, c => c.toUpperCase())

  useEffect(() => {
    if (!p1 || !p2) { setLoading(false); setError('Usa el buscador para seleccionar jugadores.'); return }
    fetch(`/api/h2h?player1=${p1}&player2=${p2}`)
      .then(r => r.json())
      .then(json => { setData(json); setLoading(false) })
      .catch(e => { setError(String(e)); setLoading(false) })
  }, [p1, p2])

  if (loading) return (
    <div style={{ textAlign: 'center', padding: 60 }}>
      <div style={{ width: 24, height: 24, border: '2px solid rgba(255,255,255,0.1)', borderTopColor: '#4ade80', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto' }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  )

  if (error) return <div style={{ textAlign: 'center', padding: 40, color: 'rgba(255,255,255,0.4)', fontSize: 13 }}>{error}</div>

  const homeWins = data?.homeWins ?? 0
  const awayWins = data?.awayWins ?? 0
  const total = homeWins + awayWins || 1

  return (
    <div style={{ padding: '24px 16px' }}>
      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <h1 style={{ fontSize: 18, fontWeight: 800, color: '#fff', letterSpacing: 1, textTransform: 'uppercase', margin: 0 }}>
          {capitalized}
        </h1>
        <div style={{ width: 24, height: 2, background: '#4ade80', margin: '10px auto 0', borderRadius: 2 }} />
      </div>

      {/* Score display */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        padding: '24px 20px',
        background: 'rgba(255,255,255,0.03)',
        borderRadius: 16,
        border: '1px solid rgba(255,255,255,0.05)',
        marginBottom: 32,
      }}>
        <div style={{ textAlign: 'center', flex: '0 0 80px' }}>
          <div style={{ fontSize: 36, fontWeight: 800, color: '#4ade80' }}>{homeWins}</div>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', marginTop: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {data?.homeTeam?.name ?? 'J1'}
          </div>
        </div>
        <div style={{ flex: 1, height: 6, borderRadius: 3, overflow: 'hidden', display: 'flex', background: 'rgba(255,255,255,0.05)', gap: 2 }}>
          <div style={{ width: `${(homeWins / total) * 100}%`, background: '#4ade80', borderRadius: 3, transition: 'width 0.5s' }} />
          <div style={{ flex: 1, background: '#ef4444', borderRadius: 3, transition: 'width 0.5s' }} />
        </div>
        <div style={{ textAlign: 'center', flex: '0 0 80px' }}>
          <div style={{ fontSize: 36, fontWeight: 800, color: '#ef4444' }}>{awayWins}</div>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', marginTop: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {data?.awayTeam?.name ?? 'J2'}
          </div>
        </div>
      </div>

      {/* History */}
      <div style={{ fontSize: 9, fontWeight: 700, color: 'rgba(255,255,255,0.15)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: 2 }}>
        Historial
      </div>

      {data?.events && data.events.length > 0 ? (
        data.events.map((evt, i) => {
          const homeWon = (evt.homeScore?.current ?? 0) > (evt.awayScore?.current ?? 0)
          const surface = evt.groundType ?? evt.tournament?.uniqueTournament?.groundType
          const sets = [evt.homeScore?.period1, evt.homeScore?.period2, evt.homeScore?.period3].filter(s => s != null)
          const oppSets = [evt.awayScore?.period1, evt.awayScore?.period2, evt.awayScore?.period3].filter(s => s != null)

          return (
            <div key={i} style={{
              background: 'rgba(255,255,255,0.03)',
              borderRadius: 10,
              padding: '12px 14px',
              marginBottom: 4,
              border: '1px solid rgba(255,255,255,0.04)',
              animation: 'slide-up 0.3s ease',
              animationDelay: `${i * 0.03}s`,
              animationFillMode: 'both',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: 'rgba(255,255,255,0.2)', marginBottom: 8, alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                  <span>{evt.tournament?.uniqueTournament?.name ?? evt.tournament?.name}</span>
                  {surface && (
                    <span style={{
                      padding: '1px 5px',
                      borderRadius: 3,
                      fontSize: 8,
                      fontWeight: 600,
                      background: surface.toLowerCase().includes('clay') ? 'rgba(234,88,12,0.15)' : surface.toLowerCase().includes('grass') ? 'rgba(74,222,128,0.15)' : 'rgba(59,130,246,0.15)',
                      color: surface.toLowerCase().includes('clay') ? '#fb923c' : surface.toLowerCase().includes('grass') ? '#4ade80' : '#60a5fa',
                    }}>
                      {surface}
                    </span>
                  )}
                </div>
                {evt.startTimestamp && (
                  <span>{new Date(evt.startTimestamp * 1000).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: '2-digit' })}</span>
                )}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ flex: 1, fontSize: 13, fontWeight: homeWon ? 700 : 400, color: homeWon ? '#fff' : 'rgba(255,255,255,0.3)' }}>
                  {homeWon && <span style={{ color: '#4ade80', fontSize: 8, marginRight: 4 }}>▸</span>}
                  {evt.homeTeam?.name}
                </span>
                <div style={{ display: 'flex', gap: 2 }}>
                  {sets.map((s, si) => (
                    <span key={si} style={{
                      width: 20, height: 20, display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 11, fontWeight: 600, fontVariantNumeric: 'tabular-nums', borderRadius: 3,
                      color: Number(s) > Number(oppSets[si] ?? 0) ? '#fff' : 'rgba(255,255,255,0.2)',
                      background: Number(s) > Number(oppSets[si] ?? 0) ? 'rgba(74,222,128,0.1)' : 'transparent',
                    }}>
                      {s}
                    </span>
                  ))}
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
                <span style={{ flex: 1, fontSize: 13, fontWeight: !homeWon ? 700 : 400, color: !homeWon ? '#fff' : 'rgba(255,255,255,0.3)' }}>
                  {!homeWon && <span style={{ color: '#4ade80', fontSize: 8, marginRight: 4 }}>▸</span>}
                  {evt.awayTeam?.name}
                </span>
                <div style={{ display: 'flex', gap: 2 }}>
                  {oppSets.map((s, si) => (
                    <span key={si} style={{
                      width: 20, height: 20, display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 11, fontWeight: 600, fontVariantNumeric: 'tabular-nums', borderRadius: 3,
                      color: Number(s) > Number(sets[si] ?? 0) ? '#fff' : 'rgba(255,255,255,0.2)',
                      background: Number(s) > Number(sets[si] ?? 0) ? 'rgba(74,222,128,0.1)' : 'transparent',
                    }}>
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )
        })
      ) : (
        <div style={{ textAlign: 'center', padding: 30, color: 'rgba(255,255,255,0.15)', fontSize: 13 }}>Sin historial</div>
      )}
    </div>
  )
}
