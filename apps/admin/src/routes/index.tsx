import { createFileRoute } from '@tanstack/react-router'
import { api } from '../router'

export const Route = createFileRoute('/')({
  loader: async ({ context: { trpc } }) => {
    await trpc.mirror.ensureData('Mirror is workinggggg!')
    return
  },
  component: HomeComponent,
})

function HomeComponent() {
  const { data, isLoading } = api.mirror.useQuery('Mirror is workinggggg!')
  return (
    <div className="p-2">
      <h3>Welcome Home!</h3>
      <p>{data}</p>
    </div>
  )
}
