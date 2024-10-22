import { createFileRoute } from '@tanstack/react-router'
import { Charts } from '~/components/charts'

export const Route = createFileRoute('/_root-layout/')({
  component: HomeComponent,
})

function HomeComponent() {
  return <Charts />
}
