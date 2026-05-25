/**
 * GA4 Tracking Utilities for Boat Rental
 * Tracks SamBoat affiliate clicks, page views, and user interactions
 */

import React from 'react'

declare global {
  interface Window {
    gtag: any
  }
}

/**
 * Track SamBoat click event
 * Usage: trackSamBoatClick('mallorca', 'Islas Baleares', 'from_landing')
 */
export const trackSamBoatClick = (
  locality: string,
  coast: string,
  source?: string
) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'samboat_click', {
      event_category: 'affiliate',
      event_label: locality,
      coast: coast,
      source: source || 'landing',
      value: 1,
      currency: 'EUR',
    })
  }
}

/**
 * Track boat rental page view
 * Usage: trackBoatRentalPageView('mallorca', 'Islas Baleares', 'landing')
 */
export const trackBoatRentalPageView = (
  locality: string,
  coast: string,
  pageType: 'landing' | 'coast_hub' | 'province_hub' | 'main'
) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'boat_rental_page_view', {
      event_category: 'boat_rental',
      event_label: `${locality}_${pageType}`,
      locality: locality,
      coast: coast,
      page_type: pageType,
    })
  }
}

/**
 * Track FAQ accordion interaction
 * Usage: trackFaqInteraction('mallorca', 'edad-minima')
 */
export const trackFaqInteraction = (locality: string, faqId: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'faq_expanded', {
      event_category: 'engagement',
      event_label: faqId,
      locality: locality,
    })
  }
}

/**
 * Track section scroll visibility
 * Usage: trackSectionView('pricing', 'mallorca')
 */
export const trackSectionView = (section: string, locality: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'section_view', {
      event_category: 'engagement',
      event_label: section,
      locality: locality,
    })
  }
}

/**
 * Track guide link click
 * Usage: trackGuideClick('legislacion-espana', 'mallorca')
 */
export const trackGuideClick = (guideSlug: string, locality: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'guide_click', {
      event_category: 'content',
      event_label: guideSlug,
      locality: locality,
    })
  }
}

/**
 * Hook for tracking scroll position and visibility
 * Returns a ref to attach to elements for visibility tracking
 */
export const useVisibilityTracking = (locality: string, sectionName: string) => {
  if (typeof window === 'undefined') {
    return null
  }

  const ref = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    if (!ref.current) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            trackSectionView(sectionName, locality)
            // Only track once
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.5 }
    )

    observer.observe(ref.current)
    return () => observer.disconnect()
  }, [locality, sectionName])

  return ref
}
