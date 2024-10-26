import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_root-layout/products/')({
  component: () => <div>Hello /_root-layout/products/!</div>,
})
