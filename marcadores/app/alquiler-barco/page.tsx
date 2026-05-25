'use client'

import { getAllLocalities } from '@/lib/boat-rental-localities'
import Link from 'next/link'

export default function BoatRentalHubPage() {
  const localities = getAllLocalities()

  // Group by coast
  const coasts = new Map<string, typeof localities>()
  localities.forEach((locality) => {
    if (!coasts.has(locality.coast)) {
      coasts.set(locality.coast, [])
    }
    coasts.get(locality.coast)!.push(locality)
  })

  const totalSearchVolume = localities.reduce((sum, loc) => sum + loc.googleTrendsVolume, 0)

  return (
    <div className="min-h-screen bg-white">
      {/* HERO */}
      <section className="bg-gradient-to-br from-blue-500 via-blue-400 to-cyan-400 py-16 px-4 md:py-32 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Alquila Barcos en las Costas de España
          </h1>
          <p className="text-lg md:text-xl text-blue-50 max-w-2xl mx-auto mb-8">
            Descubre fondeos seguros, playas hermosas y las mejores tarifas de alquiler de barcos en todas las costas españolas.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="#coasts"
              className="inline-block bg-white text-blue-600 font-bold py-3 px-6 rounded-lg hover:bg-gray-100 transition-colors"
            >
              Explorar Costas
            </a>
            <a
              href="https://www.awin1.com/cread.php?awinmid=32683&awinaffid=playasdeespana&clickref=playasdeespana_main&ued=https://www.samboat.es"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors border-2 border-white"
            >
              Ver en SamBoat
            </a>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="bg-gray-50 py-12 px-4">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div>
            <div className="text-4xl font-bold text-blue-600 mb-2">{localities.length}+</div>
            <p className="text-gray-600">Localidades</p>
          </div>
          <div>
            <div className="text-4xl font-bold text-blue-600 mb-2">{coasts.size}</div>
            <p className="text-gray-600">Costas Españolas</p>
          </div>
          <div>
            <div className="text-4xl font-bold text-blue-600 mb-2">€100+</div>
            <p className="text-gray-600">Precios desde</p>
          </div>
        </div>
      </section>

      {/* COASTS SECTION */}
      <div id="coasts" className="max-w-4xl mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold mb-8 text-gray-900">Costas Disponibles</h2>

        <div className="space-y-12">
          {Array.from(coasts.entries()).map(([coast, coastLocalities]) => (
            <div key={coast} className="border-b pb-12 last:border-b-0">
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{coast}</h3>
                <p className="text-gray-600">
                  {coastLocalities.length} localidades disponibles
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {coastLocalities.slice(0, 4).map((locality) => (
                  <Link
                    key={locality.slug}
                    href={`/alquiler-barco/costas/${coast.toLowerCase().replace(/\s+/g, '-')}/provincias/${locality.province.toLowerCase()}/`}
                    className="group border border-gray-200 rounded-lg p-4 hover:shadow-md hover:border-blue-300 transition-all"
                  >
                    <h4 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors mb-1">
                      {locality.locality}
                    </h4>
                    <p className="text-sm text-gray-600">
                      €{locality.pricing.small.min} - €{locality.pricing.captain.max}/día
                    </p>
                  </Link>
                ))}
              </div>

              <Link
                href={`/alquiler-barco/costas/${coast.toLowerCase().replace(/\s+/g, '-')}`}
                className="text-blue-600 hover:text-blue-700 font-semibold"
              >
                Ver todas las localidades de {coast} →
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* CTA SECTION */}
      <section className="bg-blue-600 text-white py-12 px-4 md:py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">
            Comienza tu Aventura en Barco
          </h2>
          <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
            Explora cientos de barcos verificados en todas las costas españolas. Reserva seguro con SamBoat.
          </p>
          <a
            href="https://www.awin1.com/cread.php?awinmid=32683&awinaffid=playasdeespana&clickref=playasdeespana_bottom&ued=https://www.samboat.es"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-white text-blue-600 font-bold py-4 px-8 rounded-lg hover:bg-gray-100 transition-colors text-lg"
          >
            Explorar Ofertas en SamBoat
          </a>
          <p className="text-blue-200 text-sm mt-6">
            Afiliado con SamBoat • Sin costos adicionales
          </p>
        </div>
      </section>
    </div>
  )
}
