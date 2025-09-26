import React from 'react'
import { Link } from 'react-router-dom'

const NoPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background px-6">
      <h1 className="text-6xl md:text-8xl font-extrabold text-vivid_blue mb-4">
        404
      </h1>
      <h2 className="text-2xl md:text-3xl font-semibold text-gray-700 mb-6">
        Page Not Found
      </h2>
      <p className="text-text text-lg mb-8 text-center">
        Oops! The page you are looking for does not exist. It might have been
        moved or deleted.
      </p>
      <Link
        to="/"
        className="px-6 py-3 bg-primary text-white font-medium rounded-lg hover:bg-vivid_blue transition duration-300">
        Go Back Home
      </Link>
    </div>
  )
}

export default NoPage
