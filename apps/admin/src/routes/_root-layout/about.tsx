import * as React from 'react'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_root-layout/about')({
  component: AboutComponent,
})

function AboutComponent() {
  return <div>About</div>
}
