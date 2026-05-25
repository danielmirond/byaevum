'use client'

import React from 'react'
import Link from 'next/link'
import { Anchor, MapPin } from 'lucide-react'
import { getLocalityBySlug } from '@/lib/boat-rental-localities'
import { samboatAwinUrl } from '@/lib/boat-rental-helpers'

interface BoatRentalSectionProps {
  playaSlug: string
  localitySlug?: string // e.g., "mallorca", "barcelona"
  coast?: string        // e.g., "Islas Baleares"
  province?: string     // e.g., "Baleares"
}

export default function BoatRentalSection({
  playaSlug,
  localitySlug,
  coast,
  province,
}: BoatRentalSectionProps) {
  if (!localitySlug) {
    return null // Don't render if no locality provided
  }

  const locality = getLocalityBySlug(localitySlug)
  if (!locality) {
    return null
  }

  const affId = process.env.NEXT_PUBLIC_AWIN_AFFID || 'playasdeespana'
  const awinUrl = samboatAwinUrl(affId, locality.samboatUrl, `playasdeespana_playa_${playaSlug}`)

  const localityCoast = coast || locality.coast
  const localityProvince = province || locality.province

  return (
    <section id="s-barcos" className="border-t border-gray-200 py-12 md:py-16">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Anchor className="w-6 h-6 text-blue-600" />
          <h2 className="text-3xl font-bold text-gray-900">
            Alquila Barco en {locality.locality}
          </h2>
        </div>
        <p className="text-gray-600 max-w-2xl">
          Explora las calas y fondeos de {locality.locality} en barco. Acceso directo desde esta playa a embarcaciones verificadas.
        </p>
      </div>

      <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg p-8 mb-8 border border-blue-200">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* LEFT: Quick Info */}
          <div>
            <h3 className="font-bold text-lg text-gray-900 mb-4">Información Rápida</h3>

            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm text-gray-600">Localidad</p>
                  <p className="font-semibold text-gray-900">{locality.locality}</p>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-600 mb-2">Rango de Precios</p>
                <div className="space-y-1">
                  <p className="text-sm">
                    <span className="text-gray-600">Barco &lt;5.5m:</span>{' '}
                    <span className="font-bold text-green-600">
                      €{locality.pricing.small.min}-€{locality.pricing.small.max}/día
                    </span>
                  </p>
                  <p className="text-sm">
                    <span className="text-gray-600">Con patrón:</span>{' '}
                    <span className="font-bold text-green-600">
                      €{locality.pricing.captain.min}-€{locality.pricing.captain.max}/día
                    </span>
                  </p>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-600 mb-2">Mejor Época</p>
                <p className="text-sm font-semibold text-gray-900">{locality.bestSeason}</p>
              </div>
            </div>
          </div>

          {/* RIGHT: CTA */}
          <div className="flex flex-col justify-between">
            <div>
              <h3 className="font-bold text-lg text-gray-900 mb-4">¿Por qué alquilar aquí?</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex gap-2">
                  <span className="text-blue-600 font-bold">✓</span>
                  <span>{locality.beaches.length} calas accesibles en barco</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-blue-600 font-bold">✓</span>
                  <span>{locality.moorings.length} fondeos seguros y protegidos</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-blue-600 font-bold">✓</span>
                  <span>Ofertas verificadas con SamBoat</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-blue-600 font-bold">✓</span>
                  <span>Disponibilidad en tempo alta y baja</span>
                </li>
              </ul>
            </div>

            <div className="mt-6 space-y-3">
              <a
                href={awinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors text-center"
              >
                Ver Barcos en {locality.locality}
              </a>
              <Link
                href={`/alquiler-barco/costas/${localityCoast.toLowerCase().replace(/\s+/g, '-')}/provincias/${localityProvince.toLowerCase()}/${localitySlug}`}
                className="block w-full bg-white text-blue-600 font-bold py-3 px-4 rounded-lg hover:bg-gray-100 transition-colors text-center border border-blue-200"
              >
                Guía Completa de {locality.locality}
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* HIGHLIGHTS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="border border-gray-200 rounded-lg p-4">
          <h4 className="font-bold text-gray-900 mb-2">Playas Destacadas</h4>
          <ul className="text-sm text-gray-600 space-y-1">
            {locality.beaches.slice(0, 3).map((beach, idx) => (
              <li key={idx}>• {beach.name}</li>
            ))}
          </ul>
        </div>

        <div className="border border-gray-200 rounded-lg p-4">
          <h4 className="font-bold text-gray-900 mb-2">Fondeos Recomendados</h4>
          <ul className="text-sm text-gray-600 space-y-1">
            {locality.moorings.slice(0, 3).map((mooring, idx) => (
              <li key={idx}>• {mooring.name}</li>
            ))}
          </ul>
        </div>

        <div className="border border-gray-200 rounded-lg p-4 bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
          <h4 className="font-bold text-purple-900 mb-2">💎 Insider Tip</h4>
          <p className="text-sm text-purple-800 line-clamp-3">{locality.insiderTip}</p>
        </div>
      </div>
    </section>
  )
}
