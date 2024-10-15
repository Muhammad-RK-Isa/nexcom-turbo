import React from 'react'
import { api } from '~/lib/trpc/server'

const Home = async () => {
  const data = await api.mirror.query('Mirror is workinggggg!')
  return (
    <div>
      Home
      <p>{data}</p>
    </div>
  )
}

export default Home