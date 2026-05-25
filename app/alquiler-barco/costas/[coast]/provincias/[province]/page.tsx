import { getLocalitiesByCoast, getLocalitiesByProvince } from '@/lib/boat-rental-localities'
import Link from 'next/link'
import type { Metadata } from 'next'

interface ProvincePageParams {
  coast: string
  province: string
}

export async function generateMetadata({ params }: { params: ProvincePageParams }): Promise<Metadata> {
  const title = `Alquiler de Barcos en ${params.province} | ${params.coast}`
  const description = `Descubre las mejores ofertas de alquiler de barcos en ${params.province}. Fondeos seguros, playas hermosas y precios competitivos.`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
    },
  }
}

export default function ProvincePage({ params }: { params: ProvincePageParams }) {
  // Get all localities for this coast and filter by province
  const coastLocalities = getLocalitiesByCoast(params.coast)
  const provinceLocalities = coastLocalities.filter(
    (loc) => loc.province.toLowerCase() === params.province.toLowerCase()
  )

  const decodedProvince = decodeURIComponent(params.province)
  const decodedCoast = decodeURIComponent(params.coast)

  return (
    <div className="min-h-screen bg-white">
      {/* HERO */}
      <section className="bg-gradient-to-br from-blue-500 via-blue-400 to-cyan-400 py-16 px-4 md:py-24 text-white">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Alquiler de Barcos en {decodedProvince}
          </h1>
          <p className="text-lg text-blue-50 max-w-2xl">
            Provincia de {decodedProvince}, {decodedCoast}. Explora todas las localidades y encuentra la mejor oferta para tu aventura en barco.
          </p>
        </div>
      </section>

      {/* LOCALITIES GRID */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold mb-8 text-gray-900">Localidades en {decodedProvince}</h2>

        {provinceLocalities.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {provinceLocalities.map((locality) => (
              <Link
                key={locality.slug}
                href={`/alquiler-barco/costas/${params.coast}/provincias/${params.province}/${locality.slug}`}
                className="group border border-gray-200 rounded-lg p-6 hover:shadow-lg hover:border-blue-300 transition-all"
              >
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                    {locality.locality}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">Google Trends: {locality.googleTrendsVolume}</p>
                </div>
                <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                  {locality.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-blue-600">
                    €{locality.pricing.small.min} - €{locality.pricing.captain.max}/día
                  </span>
                  <span className="text-blue-600 group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="bg-gray-50 rounded-lg p-8 text-center text-gray-600">
            <p>No hay localidades disponibles para esta provincia.</p>
          </div>
        )}

        {/* BACK LINK */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <Link href={`/alquiler-barco/costas/${params.coast}`} className="text-blue-600 hover:text-blue-700 font-semibold">
            ← Volver a {decodedCoast}
          </Link>
        </div>
      </div>
    </div>
  )
}
