import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Alquiler de Barcos en España | Playasdeespana.es',
  description: 'Alquila barcos en todas las costas españolas. Fondeos seguros, playas hermosas, precios competitivos. Reserva con SamBoat.',
  keywords: 'alquiler barcos España, alquiler catamaran, alquiler yate, barcos vela',
  openGraph: {
    title: 'Alquiler de Barcos en España',
    description: 'Descubre las mejores ofertas de alquiler de barcos en las costas españolas',
    type: 'website',
    url: 'https://playasdeespana.es/alquiler-barco',
  },
}

export default function BoatRentalLayout({ children }: { children: React.ReactNode }) {
  return children
}
