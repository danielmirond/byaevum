import { getLocalityBySlug } from '@/lib/boat-rental-localities'
import { samboatAwinUrl, getBoatRentalCanonical } from '@/lib/boat-rental-helpers'
import BoatRentalLocalityPage from '@/components/BoatRentalLocalityPage'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

interface LocalityPageParams {
  coast: string
  province: string
  locality: string
}

export async function generateMetadata({ params }: { params: LocalityPageParams }): Promise<Metadata> {
  const locality = getLocalityBySlug(params.locality)

  if (!locality) {
    return {}
  }

  const canonical = getBoatRentalCanonical(locality.coast, locality.province, locality.locality)
  const title = `Alquila Barcos en ${locality.locality} | Playasdeespana.es`
  const description = locality.description.substring(0, 160)

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: canonical,
      type: 'website',
    },
    alternates: {
      canonical,
    },
  }
}

export default function LocalityPage({ params }: { params: LocalityPageParams }) {
  const locality = getLocalityBySlug(params.locality)

  if (!locality) {
    notFound()
  }

  const afinityId = process.env.NEXT_PUBLIC_AWIN_AFFID || 'playasdeespana'
  const awinUrl = samboatAwinUrl(afinityId, locality.samboatUrl, `playasdeespana_${locality.slug}`)

  return (
    <BoatRentalLocalityPage
      coast={locality.coast}
      province={locality.province}
      locality={locality.locality}
      slug={locality.slug}
      description={locality.description}
      beaches={locality.beaches}
      moorings={locality.moorings}
      pricing={locality.pricing}
      regulations={locality.regulations}
      bestSeason={locality.bestSeason}
      insiderTip={locality.insiderTip}
      faq={locality.faq}
      googleTrendsVolume={locality.googleTrendsVolume}
      samboatAwinUrl={awinUrl}
      samboatDeeplink={locality.samboatUrl}
      images={locality.images}
    />
  )
}
