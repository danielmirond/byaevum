'use client'

import { useRouter } from 'next/navigation'

interface RankingRowProps {
  position: number
  name: string
  country?: string
  countryCode?: string
  points: number
  change?: number
  playerId?: string | number
  bestRanking?: number
  prize?: number
}

export default function RankingRow({ position, name, country, countryCode, points, change, playerId, bestRanking, prize }: RankingRowProps) {
  const router = useRouter()
  const isTop3 = position <= 3
  const isTop10 = position <= 10

  return (
    <button
      onClick={() => playerId && router.push(`/jugador/${playerId}`)}
      style={{
        display: 'flex',
        alignItems: 'center',
        padding: '14px 16px',
        background: isTop3 ? 'rgba(74,222,128,0.03)' : 'transparent',
        borderBottom: '1px solid rgba(255,255,255,0.04)',
        gap: 12,
        width: '100%',
        border: 'none',
        borderBottomStyle: 'solid',
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.04)',
        cursor: playerId ? 'pointer' : 'default',
        fontFamily: 'inherit',
        textAlign: 'left',
        transition: 'background 0.15s',
      }}
    >
      {/* Position */}
      <div style={{
        width: 28,
        fontSize: isTop3 ? 16 : 13,
        fontWeight: 700,
        color: isTop3 ? '#4ade80' : isTop10 ? '#fff' : 'rgba(255,255,255,0.3)',
        textAlign: 'right',
        flexShrink: 0,
        fontVariantNumeric: 'tabular-nums',
      }}>
        {position}
      </div>

      {/* Change */}
      <div style={{
        width: 28,
        fontSize: 10,
        fontWeight: 600,
        textAlign: 'center',
        flexShrink: 0,
        color: (change ?? 0) > 0 ? '#4ade80' : (change ?? 0) < 0 ? '#ef4444' : 'rgba(255,255,255,0.15)',
      }}>
        {(change ?? 0) > 0 ? `+${change}` : (change ?? 0) < 0 ? `${change}` : '·'}
      </div>

      {/* Flag + name */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          {countryCode && (
            <img
              src={`https://flagcdn.com/w20/${countryCode.toLowerCase()}.png`}
              alt={countryCode}
              width={16}
              height={11}
              style={{ borderRadius: 2, objectFit: 'cover', flexShrink: 0, opacity: 0.8 }}
              onError={e => { (e.target as HTMLImageElement).style.display = 'none' }}
            />
          )}
          <span style={{
            fontSize: 13,
            fontWeight: 600,
            color: '#fff',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}>
            {name}
          </span>
        </div>
        <div style={{ display: 'flex', gap: 8, marginTop: 2 }}>
          {country && <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.2)' }}>{country}</span>}
          {bestRanking && bestRanking <= 10 && (
            <span style={{ fontSize: 10, color: 'rgba(74,222,128,0.4)' }}>Best #{bestRanking}</span>
          )}
          {prize !== undefined && prize > 0 && (
            <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.15)' }}>
              {(prize / 1000000).toFixed(1)}M€
            </span>
          )}
        </div>
      </div>

      {/* Points */}
      <div style={{ flexShrink: 0, textAlign: 'right' }}>
        <div style={{
          fontSize: 13,
          fontWeight: 700,
          color: '#fff',
          fontVariantNumeric: 'tabular-nums',
        }}>
          {points.toLocaleString()}
        </div>
        <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.2)', letterSpacing: 0.5 }}>PTS</div>
      </div>

      {/* Arrow */}
      <div style={{ color: 'rgba(255,255,255,0.1)', fontSize: 14, flexShrink: 0 }}>›</div>
    </button>
  )
}
