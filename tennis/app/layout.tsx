import type { Metadata, Viewport } from 'next'
import SwipeTabs from '@/components/SwipeTabs'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'Tennis — Live Scores, Rankings ATP, H2H',
    template: '%s | Tennis',
  },
  description: 'Resultados de tenis en directo, rankings ATP y WTA live, Head to Head y tenis en TV.',
  openGraph: {
    title: 'Tennis Live',
    description: 'Live scores, Rankings ATP, H2H, TV',
    type: 'website',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#0a0a0f',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body style={{
        margin: 0,
        padding: 0,
        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
        background: '#0a0a0f',
        color: '#e4e4e7',
        WebkitFontSmoothing: 'antialiased',
        overflowX: 'hidden',
      }}>
        <SwipeTabs>{children}</SwipeTabs>
      </body>
    </html>
  )
}
