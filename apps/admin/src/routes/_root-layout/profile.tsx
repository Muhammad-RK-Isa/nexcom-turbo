import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_root-layout/profile')({
  component: () => <div>Hello /_root-layout/profile!</div>,
})
