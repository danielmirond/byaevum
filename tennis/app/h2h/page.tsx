'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import PlayerSearch from '@/components/PlayerSearch'

interface Player {
  id: string | number
  name: string
  country?: string
}

function slugify(name: string): string {
  return name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

export default function H2HPage() {
  const router = useRouter()
  const [player1, setPlayer1] = useState<Player | null>(null)
  const [player2, setPlayer2] = useState<Player | null>(null)
  const canCompare = player1 && player2

  const handleCompare = () => {
    if (!player1 || !player2) return
    router.push(`/h2h/${slugify(player1.name)}-vs-${slugify(player2.name)}?p1=${player1.id}&p2=${player2.id}`)
  }

  return (
    <div style={{ padding: '24px 16px' }}>
      <div style={{ textAlign: 'center', marginBottom: 28 }}>
        <h2 style={{ fontSize: 20, fontWeight: 800, color: '#fff', letterSpacing: 2, textTransform: 'uppercase', margin: 0 }}>
          Head to Head
        </h2>
        <div style={{ width: 24, height: 2, background: '#4ade80', margin: '10px auto 0', borderRadius: 2 }} />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <PlayerSearch label="Jugador 1" onSelect={setPlayer1} selected={player1} />
        <div style={{ textAlign: 'center', fontSize: 12, fontWeight: 800, color: 'rgba(255,255,255,0.1)', padding: '2px 0', letterSpacing: 4 }}>VS</div>
        <PlayerSearch label="Jugador 2" onSelect={setPlayer2} selected={player2} />
      </div>

      <button
        onClick={handleCompare}
        disabled={!canCompare}
        style={{
          width: '100%',
          marginTop: 24,
          padding: '14px 0',
          borderRadius: 12,
          border: 'none',
          background: canCompare ? '#4ade80' : 'rgba(255,255,255,0.05)',
          color: canCompare ? '#0a0a0f' : 'rgba(255,255,255,0.15)',
          fontSize: 13,
          fontWeight: 700,
          cursor: canCompare ? 'pointer' : 'not-allowed',
          transition: 'all 0.2s',
          textTransform: 'uppercase',
          letterSpacing: 2,
          fontFamily: 'inherit',
        }}
      >
        Comparar
      </button>

      {/* Popular */}
      <div style={{ marginTop: 40 }}>
        <div style={{ fontSize: 9, fontWeight: 700, color: 'rgba(255,255,255,0.15)', marginBottom: 12, textTransform: 'uppercase', letterSpacing: 2 }}>
          Populares
        </div>
        {[
          { name: 'Djokovic vs Nadal', slug: 'djokovic-vs-nadal' },
          { name: 'Sinner vs Alcaraz', slug: 'sinner-vs-alcaraz' },
          { name: 'Djokovic vs Alcaraz', slug: 'djokovic-vs-alcaraz' },
          { name: 'Nadal vs Federer', slug: 'nadal-vs-federer' },
        ].map(h => (
          <button
            key={h.slug}
            onClick={() => router.push(`/h2h/${h.slug}`)}
            style={{
              display: 'flex',
              alignItems: 'center',
              width: '100%',
              padding: '14px 16px',
              marginBottom: 4,
              borderRadius: 10,
              border: '1px solid rgba(255,255,255,0.05)',
              background: 'rgba(255,255,255,0.02)',
              textAlign: 'left',
              fontSize: 14,
              fontWeight: 500,
              color: '#fff',
              cursor: 'pointer',
              fontFamily: 'inherit',
              transition: 'all 0.15s',
            }}
          >
            <span style={{ flex: 1 }}>{h.name}</span>
            <span style={{ color: 'rgba(255,255,255,0.1)', fontSize: 16 }}>›</span>
          </button>
        ))}
      </div>
    </div>
  )
}
