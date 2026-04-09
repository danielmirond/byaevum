'use client'

import { useState, useEffect } from 'react'

interface PlayerData {
  team?: {
    name?: string
    fullName?: string
    country?: { name?: string; alpha2?: string }
    ranking?: number
    playerTeamInfo?: {
      height?: number
      weight?: number
      plays?: string
      birthplace?: string
      residence?: string
      turnedPro?: string
      prizeCurrent?: number
      prizeTotal?: number
      currentRanking?: number
      birthDateTimestamp?: number
    }
  }
}

function formatMoney(val?: number) {
  if (!val) return '—'
  if (val >= 1000000) return `€${(val / 1000000).toFixed(1)}M`
  if (val >= 1000) return `€${(val / 1000).toFixed(0)}K`
  return `€${val}`
}

function getAge(ts?: number) {
  if (!ts) return null
  const birth = new Date(ts * 1000)
  const now = new Date()
  let age = now.getFullYear() - birth.getFullYear()
  if (now.getMonth() < birth.getMonth() || (now.getMonth() === birth.getMonth() && now.getDate() < birth.getDate())) age--
  return age
}

export default function PlayerProfile({ id }: { id: string }) {
  const [data, setData] = useState<PlayerData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/player?id=${id}`)
      .then(r => r.json())
      .then(json => { setData(json); setLoading(false) })
      .catch(() => setLoading(false))
  }, [id])

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: 60 }}>
        <div style={{ width: 24, height: 24, border: '2px solid rgba(255,255,255,0.1)', borderTopColor: '#4ade80', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
      </div>
    )
  }

  const t = data?.team
  const info = t?.playerTeamInfo
  const age = getAge(info?.birthDateTimestamp)

  return (
    <div style={{ padding: '24px 16px' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: 28 }}>
        {/* Ranking badge */}
        {t?.ranking && (
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 4,
            padding: '4px 12px',
            background: 'rgba(74,222,128,0.08)',
            border: '1px solid rgba(74,222,128,0.15)',
            borderRadius: 20,
            marginBottom: 12,
          }}>
            <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', letterSpacing: 1, textTransform: 'uppercase', fontWeight: 600 }}>Ranking</span>
            <span style={{ fontSize: 16, fontWeight: 800, color: '#4ade80' }}>#{t.ranking}</span>
          </div>
        )}

        <h1 style={{
          fontSize: 24,
          fontWeight: 800,
          color: '#fff',
          margin: '0 0 4px',
          letterSpacing: 0.5,
        }}>
          {t?.fullName ?? t?.name ?? '—'}
        </h1>

        <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
          {t?.country?.alpha2 && (
            <img
              src={`https://flagcdn.com/w20/${t.country.alpha2.toLowerCase()}.png`}
              alt={t.country.alpha2}
              width={18}
              height={12}
              style={{ borderRadius: 2, objectFit: 'cover' }}
              onError={e => { (e.target as HTMLImageElement).style.display = 'none' }}
            />
          )}
          <span>{t?.country?.name}{age ? ` · ${age} años` : ''}</span>
        </div>
      </div>

      {/* Stats grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 8,
        marginBottom: 20,
      }}>
        <StatCard label="Altura" value={info?.height ? `${info.height}m` : '—'} />
        <StatCard label="Peso" value={info?.weight ? `${info.weight}kg` : '—'} />
        <StatCard label="Mano" value={info?.plays ?? '—'} />
        <StatCard label="Pro desde" value={info?.turnedPro ?? '—'} />
        <StatCard label="Prize $ temporada" value={formatMoney(info?.prizeCurrent)} accent />
        <StatCard label="Prize $ carrera" value={formatMoney(info?.prizeTotal)} accent />
      </div>

      {/* Info */}
      {(info?.birthplace || info?.residence) && (
        <div style={{
          background: 'rgba(255,255,255,0.03)',
          borderRadius: 12,
          padding: '16px',
          border: '1px solid rgba(255,255,255,0.05)',
        }}>
          {info.birthplace && (
            <div style={{ marginBottom: 8 }}>
              <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.2)', textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 2, fontWeight: 600 }}>Lugar de nacimiento</div>
              <div style={{ fontSize: 13, color: '#fff' }}>{info.birthplace}</div>
            </div>
          )}
          {info.residence && (
            <div>
              <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.2)', textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 2, fontWeight: 600 }}>Residencia</div>
              <div style={{ fontSize: 13, color: '#fff' }}>{info.residence}</div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function StatCard({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div style={{
      background: 'rgba(255,255,255,0.03)',
      borderRadius: 12,
      padding: '14px',
      border: '1px solid rgba(255,255,255,0.05)',
    }}>
      <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.2)', textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 4, fontWeight: 600 }}>{label}</div>
      <div style={{ fontSize: 16, fontWeight: 700, color: accent ? '#4ade80' : '#fff' }}>{value}</div>
    </div>
  )
}
