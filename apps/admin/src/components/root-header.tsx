import React from 'react'
import { SidebarTrigger } from '@nexcom/ui/components/sidebar'

export default function RootHeader() {
  return (
    <header className='border-b w-full sticky z-50 top-0'>
      <nav className='p-4'>
        <SidebarTrigger />
      </nav>
    </header>
  )
}
