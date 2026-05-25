/**
 * Boat Rental Affiliate Helpers
 * SamBoat integration via Awin
 */

const SAMBOAT_AWIN_MID = '32683'
const SAMBOAT_BASE_URL = 'https://www.samboat.es'

export const samboatAwinUrl = (
  affId: string,
  samboatPath: string,
  clickref?: string
): string => {
  const ued = `${SAMBOAT_BASE_URL}${samboatPath}`
  const params = new URLSearchParams({
    awinmid: SAMBOAT_AWIN_MID,
    awinaffid: affId,
    clickref: clickref || 'playasdeespana',
    ued: ued,
  })

  return `https://www.awin1.com/cread.php?${params.toString()}`
}

/**
 * Track SamBoat clicks in GA4
 * Usage: trackSamBoatClick('mallorca', 'Costa Brava')
 */
export const trackSamBoatClick = (locality: string, coast: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'samboat_click', {
      event_category: 'affiliate',
      event_label: locality,
      coast: coast,
      value: 1,
    })
  }
}

/**
 * Get coast slug from coast name
 * "Islas Baleares" -> "islas-baleares"
 */
export const getCoastSlug = (coast: string): string => {
  return coast.toLowerCase().replace(/\s+/g, '-').replace(/á/g, 'a').replace(/é/g, 'e')
}

/**
 * Get province slug from province name
 */
export const getProvinceSlug = (province: string): string => {
  return province.toLowerCase().replace(/\s+/g, '-').replace(/á/g, 'a').replace(/é/g, 'e')
}

/**
 * Construct canonical URL for boat rental page
 */
export const getBoatRentalCanonical = (coast: string, province: string, locality: string): string => {
  const coastSlug = getCoastSlug(coast)
  const provinceSlug = getProvinceSlug(province)
  return `https://playasdeespana.es/alquiler-barco/costas/${coastSlug}/provincias/${provinceSlug}/${locality.toLowerCase()}`
}
