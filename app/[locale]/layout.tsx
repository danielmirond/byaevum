import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { instrumentSerif, ibmPlexSans, ibmPlexMono } from '@/lib/fonts'
import FloatingBoatCTA from '@/components/FloatingBoatCTA'
import '@/app/globals.css'

export const metadata = {
  title: 'Futbas — Futbol Amateur',
  description: 'Classificacions, resultats, cròmiques i comunitat del futbol amateur català',
}

export default async function LocaleLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode
  params: { locale: string }
}) {
  const messages = await getMessages()

  return (
    <html lang={locale}>
      <body
        className={`${instrumentSerif.variable} ${ibmPlexSans.variable} ${ibmPlexMono.variable}`}
      >
        <NextIntlClientProvider messages={messages}>
          {children}
          <FloatingBoatCTA />
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
