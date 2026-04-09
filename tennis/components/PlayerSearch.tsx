'use client'

import { useState, useEffect, useRef } from 'react'

interface Player {
  id: string | number
  name: string
  country?: string
}

interface Props {
  label: string
  onSelect: (player: Player) => void
  selected: Player | null
}

export default function PlayerSearch({ label, onSelect, selected }: Props) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Player[]>([])
  const [loading, setLoading] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)
  const debounceRef = useRef<ReturnType<typeof setTimeout>>()

  useEffect(() => {
    if (query.length < 2) { setResults([]); return }
    clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(async () => {
      setLoading(true)
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`)
        const data = await res.json()
        const players: Player[] = []
        if (Array.isArray(data)) {
          data.forEach((item: Record<string, unknown>) => {
            if (item.id && item.name) players.push({ id: String(item.id), name: String(item.name), country: item.country ? String(item.country) : undefined })
          })
        } else if (data.results && Array.isArray(data.results)) {
          data.results.forEach((item: Record<string, unknown>) => {
            if (item.id && item.name) players.push({ id: String(item.id), name: String(item.name), country: item.country ? String(item.country) : undefined })
          })
        }
        setResults(players)
        setShowDropdown(players.length > 0)
      } catch { setResults([]) }
      finally { setLoading(false) }
    }, 400)
    return () => clearTimeout(debounceRef.current)
  }, [query])

  if (selected) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '12px 16px',
        background: 'rgba(74,222,128,0.06)',
        borderRadius: 12,
        border: '1px solid rgba(74,222,128,0.15)',
      }}>
        <div>
          <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: 1.5, fontWeight: 600 }}>{label}</div>
          <div style={{ fontSize: 15, fontWeight: 700, color: '#fff', marginTop: 3 }}>{selected.name}</div>
        </div>
        <button
          onClick={() => { onSelect(null as unknown as Player); setQuery('') }}
          style={{
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 8,
            padding: '6px 14px',
            fontSize: 10,
            cursor: 'pointer',
            color: 'rgba(255,255,255,0.4)',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: 0.5,
            fontFamily: 'inherit',
          }}
        >
          Cambiar
        </button>
      </div>
    )
  }

  return (
    <div style={{ position: 'relative' }}>
      <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: 1.5, fontWeight: 600, marginBottom: 6, paddingLeft: 2 }}>
        {label}
      </div>
      <input
        type="text"
        value={query}
        onChange={e => setQuery(e.target.value)}
        onFocus={() => results.length > 0 && setShowDropdown(true)}
        placeholder="Buscar jugador..."
        style={{
          width: '100%',
          padding: '13px 16px',
          borderRadius: 12,
          border: '1px solid rgba(255,255,255,0.08)',
          background: 'rgba(255,255,255,0.04)',
          fontSize: 14,
          color: '#fff',
          outline: 'none',
          boxSizing: 'border-box',
          fontFamily: 'inherit',
          transition: 'border-color 0.2s',
        }}
        onFocusCapture={e => { e.currentTarget.style.borderColor = 'rgba(74,222,128,0.3)' }}
        onBlurCapture={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)' }}
      />
      {loading && (
        <div style={{ position: 'absolute', right: 14, top: 36, fontSize: 11, color: 'rgba(255,255,255,0.3)' }}>...</div>
      )}
      {showDropdown && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          background: '#16161e',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 12,
          maxHeight: 200,
          overflowY: 'auto',
          zIndex: 50,
          boxShadow: '0 12px 40px rgba(0,0,0,0.5)',
          marginTop: 4,
        }}>
          {results.map(p => (
            <button
              key={p.id}
              onClick={() => { onSelect(p); setShowDropdown(false); setQuery('') }}
              style={{
                display: 'block',
                width: '100%',
                padding: '11px 16px',
                border: 'none',
                background: 'none',
                textAlign: 'left',
                cursor: 'pointer',
                borderBottom: '1px solid rgba(255,255,255,0.04)',
                fontSize: 14,
                fontFamily: 'inherit',
                color: '#fff',
              }}
            >
              <span style={{ fontWeight: 600 }}>{p.name}</span>
              {p.country && <span style={{ marginLeft: 8, fontSize: 11, color: 'rgba(255,255,255,0.3)' }}>{p.country}</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
