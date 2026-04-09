'use client'

import { useSwipeable } from 'react-swipeable'

function pad(n: number) { return String(n).padStart(2, '0') }
function formatDate(d: Date): string {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}
function formatLabel(dateStr: string): string {
  const today = formatDate(new Date())
  const tomorrow = formatDate(new Date(Date.now() + 86400000))
  const yesterday = formatDate(new Date(Date.now() - 86400000))
  if (dateStr === today) return 'Hoy'
  if (dateStr === tomorrow) return 'Mañana'
  if (dateStr === yesterday) return 'Ayer'
  return new Date(dateStr + 'T12:00:00').toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric', month: 'short' })
}

interface Props {
  selectedDate: string
  onDateChange: (date: string) => void
}

export default function SwipeDays({ selectedDate, onDateChange }: Props) {
  const changeDay = (delta: number) => {
    const d = new Date(selectedDate + 'T12:00:00')
    d.setDate(d.getDate() + delta)
    onDateChange(formatDate(d))
  }

  const handlers = useSwipeable({
    onSwipedLeft: () => changeDay(1),
    onSwipedRight: () => changeDay(-1),
    trackMouse: false,
    delta: 40,
  })

  const days: string[] = []
  const sel = new Date(selectedDate + 'T12:00:00')
  for (let i = -3; i <= 3; i++) {
    days.push(formatDate(new Date(sel.getTime() + i * 86400000)))
  }

  return (
    <div {...handlers}>
      <div style={{
        display: 'flex',
        overflowX: 'auto',
        gap: 6,
        padding: '10px 12px',
        background: 'rgba(255,255,255,0.02)',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        scrollbarWidth: 'none',
      }}>
        {days.map(day => {
          const isActive = day === selectedDate
          return (
            <button
              key={day}
              onClick={() => onDateChange(day)}
              style={{
                flex: '0 0 auto',
                padding: '6px 14px',
                borderRadius: 20,
                border: isActive ? '1px solid #4ade80' : '1px solid rgba(255,255,255,0.08)',
                background: isActive ? 'rgba(74,222,128,0.1)' : 'transparent',
                color: isActive ? '#4ade80' : 'rgba(255,255,255,0.4)',
                fontSize: 12,
                fontWeight: isActive ? 600 : 400,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.2s',
                fontFamily: 'inherit',
              }}
            >
              {formatLabel(day)}
            </button>
          )
        })}
      </div>
    </div>
  )
}
