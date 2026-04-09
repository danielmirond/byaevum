'use client'

import { useSwipeable } from 'react-swipeable'
import { useRouter, usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'

const TABS = [
  { label: 'Live', path: '/resultados', icon: true },
  { label: 'Rankings', path: '/rankings' },
  { label: 'H2H', path: '/h2h' },
  { label: 'TV', path: '/tv' },
]

export default function SwipeTabs({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [liveCount, setLiveCount] = useState(0)

  const currentIdx = TABS.findIndex(t => pathname.startsWith(t.path))
  const activeIdx = currentIdx === -1 ? 0 : currentIdx

  const goTo = (idx: number) => {
    if (idx >= 0 && idx < TABS.length) router.push(TABS[idx].path)
  }

  const handlers = useSwipeable({
    onSwipedLeft: () => goTo(activeIdx + 1),
    onSwipedRight: () => goTo(activeIdx - 1),
    trackMouse: false,
    delta: 50,
  })

  // Fetch live count
  useEffect(() => {
    const fetchLive = () => {
      fetch('/api/live').then(r => r.json()).then(d => {
        setLiveCount(d.events?.length ?? 0)
      }).catch(() => {})
    }
    fetchLive()
    const interval = setInterval(fetchLive, 30000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div {...handlers} style={{ minHeight: '100dvh', background: '#0a0a0f' }}>
      <div style={{
        background: 'linear-gradient(180deg, #111118 0%, #0d0d14 100%)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}>
        {/* Brand */}
        <div style={{ textAlign: 'center', padding: '14px 0 10px' }}>
          <span style={{
            fontSize: 15, fontWeight: 800, color: '#4ade80',
            letterSpacing: 4, textTransform: 'uppercase',
          }}>TENNIS</span>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', padding: '0 4px' }}>
          {TABS.map((tab, i) => (
            <button
              key={tab.path}
              onClick={() => goTo(i)}
              style={{
                flex: 1, padding: '9px 0 11px', background: 'none', border: 'none',
                color: i === activeIdx ? '#fff' : 'rgba(255,255,255,0.35)',
                fontSize: 11, fontWeight: 600, cursor: 'pointer',
                borderBottom: i === activeIdx ? '2px solid #4ade80' : '2px solid transparent',
                transition: 'all 0.2s', letterSpacing: 1.5, textTransform: 'uppercase',
                fontFamily: 'inherit', display: 'flex', alignItems: 'center',
                justifyContent: 'center', gap: 5,
              }}
            >
              {tab.icon && (
                <span style={{
                  display: 'inline-flex', alignItems: 'center', gap: 3,
                }}>
                  <span style={{
                    width: 5, height: 5, borderRadius: '50%',
                    background: liveCount > 0 ? '#ef4444' : 'rgba(255,255,255,0.15)',
                    animation: liveCount > 0 ? 'pulse-live 1.5s infinite' : 'none',
                    flexShrink: 0,
                  }} />
                </span>
              )}
              {tab.label}
              {tab.icon && liveCount > 0 && (
                <span style={{
                  fontSize: 9, fontWeight: 700, color: '#ef4444',
                  background: 'rgba(239,68,68,0.12)',
                  padding: '1px 5px', borderRadius: 6,
                  minWidth: 16, textAlign: 'center',
                }}>
                  {liveCount}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div style={{ paddingBottom: 40 }}>{children}</div>
    </div>
  )
}
