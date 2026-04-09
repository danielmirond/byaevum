import H2HDetail from './H2HDetail'

interface Props {
  params: { players: string }
  searchParams: { p1?: string; p2?: string }
}

export async function generateMetadata({ params }: Props) {
  const names = params.players.replace(/-vs-/i, ' vs ').replace(/-/g, ' ')
  const capitalized = names.replace(/\b\w/g, c => c.toUpperCase())
  return {
    title: `${capitalized} — Head to Head | Tennis`,
    description: `Historial de enfrentamientos ${capitalized}. Estadísticas H2H completas.`,
    openGraph: {
      title: `${capitalized} — H2H Tennis`,
      description: `Head to Head entre ${capitalized}`,
    },
  }
}

export default function H2HDetailPage({ params, searchParams }: Props) {
  return <H2HDetail players={params.players} p1={searchParams.p1} p2={searchParams.p2} />
}
