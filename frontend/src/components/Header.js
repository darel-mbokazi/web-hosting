import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { API_URL } from '../config'
import { useCart } from '../context/CartContext'
import toast from 'react-hot-toast'
import {
  FaSearch,
  FaCheckCircle,
  FaTimesCircle,
  FaShoppingCart,
  FaGlobe,
  FaExclamationTriangle,
  FaSync,
  FaArrowRight,
} from 'react-icons/fa'

const Header = () => {
  const [domain, setDomain] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { state, refreshCart } = useCart()
  const navigate = useNavigate()

  const isValidDomain = (domain) => {
    const domainPattern = /^[a-zA-Z0-9-]+\.[a-zA-Z]{2,}$/
    return domainPattern.test(domain)
  }

  const handleSearch = async () => {
    const lowerCaseDomain = domain.toLowerCase()

    if (!isValidDomain(lowerCaseDomain)) {
      setError('Please enter a valid domain name')
      setResult(null)
      return
    }

    setLoading(true)
    setError('')
    setResult(null)

    try {
      const response = await fetch(`${API_URL}/domain/search`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ domainName: lowerCaseDomain }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Domain search failed')
        setResult(null)
      } else {
        setResult(data)
      }
    } catch (err) {
      console.error(err)
      setError('Failed to fetch domain information')
    } finally {
      setLoading(false)
    }
  }

  const handleAddToCart = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        toast.error('Please log in to add domain to cart')
        navigate('/login')
        return
      }

      const response = await fetch(`${API_URL}/domain/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ domainName: domain }),
      })

      const data = await response.json()

      if (!response.ok) {
        toast.error(data.error || 'Failed to register domain')
        setError(data.error || 'Failed to register domain')
        return
      }

      await refreshCart()
      toast.success(`Domain ${domain} added to cart`)
    } catch (err) {
      console.error(err)
      toast.error('Error adding domain to cart')
      setError('Error adding domain to cart')
    }
  }

  const domainInCart = state.items.some(
    (item) =>
      item.itemType === 'domain' &&
      item.name.toLowerCase().includes(domain.toLowerCase())
  )

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  return (
    <div className="min-h-screen bg-backgroun flex items-center justify-center px-4 sm:px-6">
      <div className="max-w-2xl w-full text-center">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <FaGlobe className="text-4xl text-vivid_blue" />
            <h1 className="text-3xl sm:text-4xl font-bold text-vivid_blue">
              Domain Name Search
            </h1>
          </div>
          <p className="text-lg text-gray-600">
            Find your perfect domain name and start your online journey
          </p>
        </div>

        {/* Search Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <div className="relative flex-1">
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Enter your domain name (e.g., mywebsite.com)"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                onKeyPress={handleKeyPress}
                className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-vivid_blue text-lg"
              />
            </div>
            <button
              onClick={handleSearch}
              disabled={loading}
              className="flex items-center justify-center gap-2 bg-vivid_blue text-white font-semibold px-8 py-4 rounded-xl hover:bg-blue-700 disabled:opacity-50 transition-colors min-w-[140px] text-lg">
              {loading ? <FaSync className="animate-spin" /> : <FaSearch />}
              {loading ? 'Searching...' : 'Search'}
            </button>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <div className="flex items-center gap-2 text-red-700 justify-center">
                <FaExclamationTriangle />
                <span className="font-medium">{error}</span>
              </div>
            </div>
          )}
        </div>

        {/* Results */}
        {result && (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
            <div
              className={`flex items-center justify-center gap-3 mb-4 ${
                result.available ? 'text-green-600' : 'text-red-600'
              }`}>
              {result.available ? (
                <>
                  <FaCheckCircle className="text-3xl" />
                  <span className="text-2xl font-bold">Domain Available!</span>
                </>
              ) : (
                <>
                  <FaTimesCircle className="text-3xl" />
                  <span className="text-2xl font-bold">Domain Taken</span>
                </>
              )}
            </div>

            <p className="text-lg text-gray-700 mb-6">
              The domain{' '}
              <span className="font-bold text-vivid_blue text-xl">
                {domain.toLowerCase()}
              </span>{' '}
              is{' '}
              {result.available
                ? 'available for registration'
                : 'already registered'}
              .
            </p>

            {result.available && (
              <div className="space-y-3">
                {domainInCart ? (
                  <div className="space-y-3">
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <p className="text-green-700 font-medium">
                        ✓ Domain added to cart
                      </p>
                    </div>
                    <button
                      onClick={() => navigate('/web-hosting')}
                      className="flex items-center justify-center gap-2 w-full bg-green-600 text-white font-semibold px-6 py-3 rounded-lg hover:bg-green-700 transition-colors">
                      Choose Hosting Plan <FaArrowRight />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={handleAddToCart}
                    className="flex items-center justify-center gap-2 w-full bg-vivid_blue text-white font-semibold px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
                    <FaShoppingCart />
                    Add to Cart - R150/year
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default Header
