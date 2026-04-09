import PlayerProfile from './PlayerProfile'

interface Props {
  params: { id: string }
}

export async function generateMetadata({ params }: Props) {
  return {
    title: `Jugador #${params.id} | Tennis`,
  }
}

export default function PlayerPage({ params }: Props) {
  return <PlayerProfile id={params.id} />
}
