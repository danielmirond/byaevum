import CompetitionDetail from './CompetitionDetail'

interface Props {
  params: { slug: string }
  searchParams: { id?: string }
}

export async function generateMetadata({ params }: Props) {
  const name = params.slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
  return {
    title: `${name} — Resultados y Cuadro | Tennis`,
    description: `Resultados, cuadro y próximos partidos de ${name}.`,
    openGraph: {
      title: `${name} — Tennis`,
      description: `Sigue ${name} en directo`,
    },
  }
}

export default function CompetitionPage({ params, searchParams }: Props) {
  return <CompetitionDetail slug={params.slug} id={searchParams.id} />
}
