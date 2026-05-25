'use client'

import { useState, useEffect } from 'react'
import { X, Anchor } from 'lucide-react'
import { usePathname } from 'next/navigation'

export default function FloatingBoatCTA() {
  const [isVisible, setIsVisible] = useState(false)
  const [coast, setCoast] = useState<string>('')
  const pathname = usePathname()

  useEffect(() => {
    // Only show on boat rental pages
    if (!pathname.includes('/alquiler-barco')) {
      setIsVisible(false)
      return
    }

    // Extract coast from URL: /alquiler-barco/costas/[coast]/...
    const match = pathname.match(/\/alquiler-barco\/costas\/([^/]+)/)
    if (match && match[1]) {
      const decodedCoast = decodeURIComponent(match[1]).replace(/-/g, ' ')
      setCoast(decodedCoast.charAt(0).toUpperCase() + decodedCoast.slice(1))
      setIsVisible(true)
    } else if (pathname === '/alquiler-barco') {
      setIsVisible(true)
      setCoast('España')
    } else {
      setIsVisible(false)
    }
  }, [pathname])

  if (!isVisible) {
    return null
  }

  return (
    <div className="fixed bottom-6 right-6 z-40">
      <div className="relative">
        <div className="bg-blue-600 text-white rounded-lg shadow-lg p-4 max-w-sm">
          <div className="flex items-start gap-3">
            <Anchor className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-bold text-sm mb-1">
                Alquila barco en {coast}
              </p>
              <p className="text-xs text-blue-100 mb-3">
                desde €100/día • Reserva segura con SamBoat
              </p>
              <a
                href="https://www.awin1.com/cread.php?awinmid=32683&awinaffid=playasdeespana&clickref=playasdeespana_floating&ued=https://www.samboat.es"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-white text-blue-600 text-xs font-bold py-2 px-4 rounded hover:bg-gray-100 transition-colors"
              >
                Ver Ofertas
              </a>
            </div>
            <button
              onClick={() => setIsVisible(false)}
              className="flex-shrink-0 text-blue-200 hover:text-white transition-colors"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
