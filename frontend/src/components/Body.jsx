import React from 'react'
import FAQ from './FAQ'
import WebHosting from '../pages/WebHosting'
import FeaturedClients from './FeaturedClients'

const Body = () => {

  return (
    <div className="body">
      <WebHosting/>
      <FeaturedClients/>
      <FAQ/>
    </div>
  )
}

export default Body
