'use client'

import { useState } from 'react'

interface MatchProps {
  id?: number
  homePlayer: string
  awayPlayer: string
  homeCountry?: string
  awayCountry?: string
  homeSeed?: string
  awaySeed?: string
  homeScore?: { current?: number; period1?: number; period2?: number; period3?: number; period4?: number; period5?: number; point?: string }
  awayScore?: { current?: number; period1?: number; period2?: number; period3?: number; period4?: number; period5?: number; point?: string }
  time?: string
  status?: string
  statusDesc?: string
  round?: string
  surface?: string
}

interface MomentumPoint { set: number; game: number; value: number; breakOccurred: boolean }
interface Highlight { title: string; url: string; thumbnailUrl: string }

function sets(score?: MatchProps['homeScore']): string[] {
  if (!score) return []
  return [score.period1, score.period2, score.period3, score.period4, score.period5]
    .filter(s => s !== undefined && s !== null).map(String)
}

function Flag({ code }: { code?: string }) {
  if (!code) return null
  return (
    <img
      src={`https://flagcdn.com/w20/${code.toLowerCase()}.png`}
      alt={code}
      width={14}
      height={10}
      style={{ borderRadius: 1, objectFit: 'cover', flexShrink: 0, opacity: 0.7 }}
      onError={e => { (e.target as HTMLImageElement).style.display = 'none' }}
    />
  )
}

export default function MatchCard({
  id, homePlayer, awayPlayer, homeCountry, awayCountry,
  homeSeed, awaySeed, homeScore, awayScore,
  time, status, statusDesc, round, surface,
}: MatchProps) {
  const isLive = status === 'inprogress'
  const isFinished = status === 'finished'
  const homeWon = isFinished && (homeScore?.current ?? 0) > (awayScore?.current ?? 0)
  const awayWon = isFinished && (awayScore?.current ?? 0) > (homeScore?.current ?? 0)
  const homeSets = sets(homeScore)
  const awaySets = sets(awayScore)

  const [expanded, setExpanded] = useState(false)
  const [stats, setStats] = useState<Record<string, unknown>[] | null>(null)
  const [odds, setOdds] = useState<{ home: string; away: string } | null>(null)
  const [momentum, setMomentum] = useState<MomentumPoint[] | null>(null)
  const [highlights, setHighlights] = useState<Highlight[] | null>(null)
  const [loadingExtra, setLoadingExtra] = useState(false)

  const toggleExpand = async () => {
    if (!id) return
    if (expanded) { setExpanded(false); return }
    setExpanded(true)
    if (stats) return // already loaded
    setLoadingExtra(true)

    const fetches = [
      fetch(`/api/event-stats?id=${id}`).then(r => r.json()).catch(() => null),
      fetch(`/api/odds?id=${id}`).then(r => r.json()).catch(() => null),
      fetch(`/api/momentum?id=${id}`).then(r => r.json()).catch(() => null),
      ...(isFinished ? [fetch(`/api/highlights?id=${id}`).then(r => r.json()).catch(() => null)] : []),
    ]

    const results = await Promise.all(fetches)

    // Stats
    const statsData = results[0]
    const allStats = statsData?.statistics?.find((s: Record<string, unknown>) => s.period === 'ALL')
    if (allStats?.groups) setStats(allStats.groups as Record<string, unknown>[])

    // Odds
    const oddsData = results[1]
    if (oddsData?.markets) {
      const fullTime = oddsData.markets.find((m: Record<string, unknown>) => m.marketName === 'Full time')
      if (fullTime?.choices) {
        const choices = fullTime.choices as Record<string, unknown>[]
        setOdds({
          home: String(choices[0]?.fractionalValue ?? ''),
          away: String(choices[1]?.fractionalValue ?? ''),
        })
      }
    }

    // Momentum
    const momData = results[2]
    if (momData?.tennisPowerRankings) setMomentum(momData.tennisPowerRankings)

    // Highlights
    if (isFinished && results[3]?.highlights) {
      setHighlights(results[3].highlights)
    }

    setLoadingExtra(false)
  }

  return (
    <div style={{
      background: isLive ? 'rgba(239,68,68,0.04)' : 'rgba(255,255,255,0.03)',
      borderRadius: 12,
      padding: '14px 16px',
      marginBottom: 6,
      border: isLive ? '1px solid rgba(239,68,68,0.15)' : '1px solid rgba(255,255,255,0.05)',
      animation: 'slide-up 0.3s ease',
    }}>
      {/* Header */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        marginBottom: 12, fontSize: 10, letterSpacing: 0.8, textTransform: 'uppercase',
      }}>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          {surface && (
            <span style={{
              padding: '2px 6px', borderRadius: 4, fontSize: 9, fontWeight: 600,
              background: surface.toLowerCase().includes('clay') ? 'rgba(234,88,12,0.15)' : surface.toLowerCase().includes('grass') ? 'rgba(74,222,128,0.15)' : 'rgba(59,130,246,0.15)',
              color: surface.toLowerCase().includes('clay') ? '#fb923c' : surface.toLowerCase().includes('grass') ? '#4ade80' : '#60a5fa',
            }}>{surface}</span>
          )}
          <span style={{ color: 'rgba(255,255,255,0.3)', fontWeight: 500 }}>{round}</span>
        </div>
        <div style={{
          color: isLive ? '#ef4444' : 'rgba(255,255,255,0.25)',
          fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4,
        }}>
          {isLive && <span style={{ fontSize: 5, animation: 'pulse-live 1.5s infinite' }}>●</span>}
          {isLive ? statusDesc : isFinished ? 'FIN' : time}
        </div>
      </div>

      {/* Scores */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <ScoreRow name={homePlayer} country={homeCountry} seed={homeSeed} sets={homeSets} oppSets={awaySets} point={isLive ? homeScore?.point : undefined} won={homeWon} lost={awayWon} isLive={isLive} />
        <ScoreRow name={awayPlayer} country={awayCountry} seed={awaySeed} sets={awaySets} oppSets={homeSets} point={isLive ? awayScore?.point : undefined} won={awayWon} lost={homeWon} isLive={isLive} />
      </div>

      {/* Live point */}
      {isLive && homeScore?.point !== undefined && (
        <div style={{ marginTop: 8, textAlign: 'center', fontSize: 11, color: 'rgba(255,255,255,0.3)' }}>
          <span style={{ color: '#fff', fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>{homeScore.point}</span>
          <span style={{ margin: '0 6px', color: 'rgba(255,255,255,0.15)' }}>—</span>
          <span style={{ color: '#fff', fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>{awayScore?.point}</span>
        </div>
      )}

      {/* Expand button */}
      {(isFinished || isLive) && id && (
        <button onClick={toggleExpand} style={{
          width: '100%', marginTop: 10, padding: '6px 0', background: 'none', border: 'none',
          color: expanded ? '#4ade80' : 'rgba(255,255,255,0.15)', fontSize: 10, cursor: 'pointer',
          fontFamily: 'inherit', letterSpacing: 1, textTransform: 'uppercase', transition: 'color 0.2s',
        }}>
          {loadingExtra ? '...' : expanded ? '▲ Cerrar' : '▼ Stats · Odds · Video'}
        </button>
      )}

      {/* Expanded content */}
      {expanded && (
        <div style={{ marginTop: 8, borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: 12 }}>

          {/* Odds */}
          {odds && (
            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.2)', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 6, fontWeight: 600 }}>Cuotas</div>
              <div style={{ display: 'flex', gap: 8 }}>
                <div style={{ flex: 1, background: 'rgba(255,255,255,0.04)', borderRadius: 8, padding: '8px 12px', textAlign: 'center' }}>
                  <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', marginBottom: 2 }}>{homePlayer.split(' ').pop()}</div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: '#fff' }}>{odds.home}</div>
                </div>
                <div style={{ flex: 1, background: 'rgba(255,255,255,0.04)', borderRadius: 8, padding: '8px 12px', textAlign: 'center' }}>
                  <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', marginBottom: 2 }}>{awayPlayer.split(' ').pop()}</div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: '#fff' }}>{odds.away}</div>
                </div>
              </div>
            </div>
          )}

          {/* Momentum graph */}
          {momentum && momentum.length > 0 && (
            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.2)', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 8, fontWeight: 600 }}>Momentum</div>
              <MomentumGraph points={momentum} />
            </div>
          )}

          {/* Stats */}
          {stats && stats.map((group, gi) => (
            <div key={gi} style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.2)', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 6, fontWeight: 600 }}>
                {String((group as Record<string, unknown>).groupName ?? '')}
              </div>
              {Array.isArray((group as Record<string, unknown>).statisticsItems) &&
                ((group as Record<string, unknown>).statisticsItems as Record<string, unknown>[]).map((item, si) => (
                  <StatRow key={si} label={String(item.name ?? '')} home={String(item.home ?? '')} away={String(item.away ?? '')} homeValue={Number(item.homeValue ?? 0)} awayValue={Number(item.awayValue ?? 0)} />
                ))
              }
            </div>
          ))}

          {/* Highlights */}
          {highlights && highlights.length > 0 && (
            <div style={{ marginBottom: 8 }}>
              <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.2)', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 8, fontWeight: 600 }}>Highlights</div>
              {highlights.map((h, i) => (
                <a key={i} href={h.url} target="_blank" rel="noopener noreferrer" style={{
                  display: 'flex', gap: 10, alignItems: 'center',
                  background: 'rgba(255,255,255,0.04)', borderRadius: 8, padding: 8, marginBottom: 4,
                  textDecoration: 'none',
                }}>
                  {h.thumbnailUrl && (
                    <img src={h.thumbnailUrl} alt="" width={80} height={45} style={{ borderRadius: 6, objectFit: 'cover', flexShrink: 0 }} />
                  )}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 12, color: '#fff', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{h.title}</div>
                    <div style={{ fontSize: 10, color: '#ef4444', marginTop: 2, fontWeight: 600 }}>▶ YouTube</div>
                  </div>
                </a>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function ScoreRow({ name, country, seed, sets, oppSets, point, won, lost, isLive }: {
  name: string; country?: string; seed?: string; sets: string[]; oppSets: string[]; point?: string; won: boolean; lost: boolean; isLive: boolean
}) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
      <Flag code={country} />
      <div style={{
        flex: 1, fontSize: 13, fontWeight: won ? 700 : 400,
        color: lost ? 'rgba(255,255,255,0.3)' : '#fff',
        display: 'flex', alignItems: 'center', gap: 4, minWidth: 0,
      }}>
        {won && <span style={{ color: '#4ade80', fontSize: 8, flexShrink: 0 }}>▸</span>}
        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{name}</span>
        {seed && <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.2)', flexShrink: 0 }}>[{seed}]</span>}
      </div>
      <div style={{ display: 'flex', gap: 2, alignItems: 'center' }}>
        {sets.map((s, i) => {
          const wonSet = Number(s) > Number(oppSets[i] ?? 0)
          return (
            <span key={i} style={{
              width: 22, height: 22, display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 12, fontWeight: 600, fontVariantNumeric: 'tabular-nums', borderRadius: 4,
              color: wonSet ? '#fff' : 'rgba(255,255,255,0.3)',
              background: wonSet ? 'rgba(74,222,128,0.12)' : 'transparent',
            }}>{s}</span>
          )
        })}
      </div>
    </div>
  )
}

function MomentumGraph({ points }: { points: MomentumPoint[] }) {
  const max = Math.max(...points.map(p => Math.abs(p.value)), 1)
  const w = 100 / points.length

  return (
    <div style={{ position: 'relative', height: 60, background: 'rgba(255,255,255,0.02)', borderRadius: 8, overflow: 'hidden' }}>
      {/* Center line */}
      <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: 1, background: 'rgba(255,255,255,0.06)' }} />
      {/* Bars */}
      <div style={{ display: 'flex', height: '100%', alignItems: 'center' }}>
        {points.map((p, i) => {
          const pct = (Math.abs(p.value) / max) * 45
          const isHome = p.value > 0
          return (
            <div key={i} style={{ width: `${w}%`, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', position: 'relative' }}>
              <div style={{
                position: 'absolute',
                left: '10%', right: '10%',
                ...(isHome
                  ? { bottom: '50%', height: `${pct}%` }
                  : { top: '50%', height: `${pct}%` }
                ),
                background: isHome ? 'rgba(74,222,128,0.4)' : 'rgba(239,68,68,0.4)',
                borderRadius: 2,
                transition: 'height 0.3s',
              }} />
              {p.breakOccurred && (
                <div style={{
                  position: 'absolute',
                  top: isHome ? 2 : 'auto',
                  bottom: isHome ? 'auto' : 2,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: 4, height: 4,
                  borderRadius: 2,
                  background: '#fbbf24',
                }} />
              )}
            </div>
          )
        })}
      </div>
      {/* Labels */}
      <div style={{ position: 'absolute', top: 3, left: 6, fontSize: 8, color: 'rgba(74,222,128,0.4)', fontWeight: 600 }}>HOME</div>
      <div style={{ position: 'absolute', bottom: 3, left: 6, fontSize: 8, color: 'rgba(239,68,68,0.4)', fontWeight: 600 }}>AWAY</div>
    </div>
  )
}

function StatRow({ label, home, away, homeValue, awayValue }: {
  label: string; home: string; away: string; homeValue: number; awayValue: number
}) {
  const total = homeValue + awayValue || 1
  const homePct = (homeValue / total) * 100
  return (
    <div style={{ marginBottom: 6 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, marginBottom: 3 }}>
        <span style={{ color: homeValue >= awayValue ? '#fff' : 'rgba(255,255,255,0.35)', fontVariantNumeric: 'tabular-nums' }}>{home}</span>
        <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: 10 }}>{label}</span>
        <span style={{ color: awayValue >= homeValue ? '#fff' : 'rgba(255,255,255,0.35)', fontVariantNumeric: 'tabular-nums' }}>{away}</span>
      </div>
      <div style={{ display: 'flex', height: 3, borderRadius: 2, overflow: 'hidden', gap: 2 }}>
        <div style={{ width: `${homePct}%`, background: homeValue >= awayValue ? '#4ade80' : 'rgba(255,255,255,0.1)', borderRadius: 2, transition: 'width 0.5s' }} />
        <div style={{ flex: 1, background: awayValue >= homeValue ? '#4ade80' : 'rgba(255,255,255,0.1)', borderRadius: 2 }} />
      </div>
    </div>
  )
}
