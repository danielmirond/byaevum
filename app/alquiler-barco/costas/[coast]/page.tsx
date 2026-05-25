import { getLocalitiesByCoast } from '@/lib/boat-rental-localities'
import Link from 'next/link'
import type { Metadata } from 'next'

interface CoastPageParams {
  coast: string
}

export async function generateMetadata({ params }: { params: CoastPageParams }): Promise<Metadata> {
  const decodedCoast = decodeURIComponent(params.coast)
  const title = `Alquiler de Barcos en ${decodedCoast} | Playasdeespana.es`
  const description = `Alquila barcos en ${decodedCoast}. Descubre todas las provincias y localidades con fondeos seguros, playas accesibles y las mejores tarifas.`

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

export default function CoastPage({ params }: { params: CoastPageParams }) {
  const decodedCoast = decodeURIComponent(params.coast)
  const localities = getLocalitiesByCoast(decodedCoast)

  // Group by province
  const provinces = new Map<string, typeof localities>()
  localities.forEach((locality) => {
    if (!provinces.has(locality.province)) {
      provinces.set(locality.province, [])
    }
    provinces.get(locality.province)!.push(locality)
  })

  return (
    <div className="min-h-screen bg-white">
      {/* HERO */}
      <section className="bg-gradient-to-br from-blue-500 via-blue-400 to-cyan-400 py-16 px-4 md:py-24 text-white">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Alquiler de Barcos en {decodedCoast}
          </h1>
          <p className="text-lg text-blue-50 max-w-2xl">
            Explora todas las provincias y localidades de {decodedCoast} para encontrar tu próxima aventura en barco.
          </p>
        </div>
      </section>

      {/* PROVINCES */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        {Array.from(provinces.entries()).map(([province, provinceLocs]) => (
          <div key={province} className="mb-12">
            <h2 className="text-2xl font-bold mb-6 text-gray-900">
              Provincia de {province}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {provinceLocs.map((locality) => (
                <Link
                  key={locality.slug}
                  href={`/alquiler-barco/costas/${params.coast}/provincias/${locality.province.toLowerCase()}/${locality.slug}`}
                  className="group border border-gray-200 rounded-lg p-4 hover:shadow-md hover:border-blue-300 transition-all"
                >
                  <h3 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors mb-2">
                    {locality.locality}
                  </h3>
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {locality.description}
                  </p>
                </Link>
              ))}
            </div>

            <Link
              href={`/alquiler-barco/costas/${params.coast}/provincias/${province.toLowerCase()}`}
              className="text-blue-600 hover:text-blue-700 font-semibold text-sm"
            >
              Ver todas las localidades de {province} →
            </Link>

            <hr className="my-8" />
          </div>
        ))}

        {/* BACK LINK */}
        <Link href="/alquiler-barco" className="text-blue-600 hover:text-blue-700 font-semibold">
          ← Volver a Alquiler de Barcos
        </Link>
      </div>
    </div>
  )
}
