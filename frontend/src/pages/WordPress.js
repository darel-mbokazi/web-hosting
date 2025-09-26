import React, { useEffect, useState } from 'react'
import { TiTick } from 'react-icons/ti'
import { BsQuestionCircleFill } from 'react-icons/bs'
import { useNavigate } from 'react-router-dom'
import { API_URL } from '../config'
import { useCart } from '../context/CartContext'
import toast from 'react-hot-toast'
import {
  FaMoneyBillWave,
  FaHdd,
  FaNetworkWired,
  FaDatabase,
  FaGlobe,
  FaEnvelope,
  FaShieldAlt,
  FaCloudDownloadAlt,
  FaCog,
  FaPaintBrush,
} from 'react-icons/fa'

const WordPress = () => {
  const [plans, setPlans] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showAnswer, setShowAnswer] = useState(false)
  const navigate = useNavigate()
  const { addWordPress } = useCart()

  const handleAddToCart = async (plan) => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        toast.error('Please log in to add hosting to cart')
        navigate('/login')
        return
      }

      console.log('Adding WordPress plan:', plan._id)
      await addWordPress(plan._id)
      toast.success(`${plan.name} plan added to cart`)
      navigate('/cart')
    } catch (err) {
      console.error('Error adding WordPress hosting plan:', err)
      console.error('Error details:', err.message)
      toast.error(err.message || 'Failed to add hosting plan')
    }
  }

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await fetch(
          `${API_URL}/wordpress/plans?t=${Date.now()}`,
          {
            headers: {
              'Cache-Control': 'no-cache',
            },
          }
        )

        if (!response.ok) {
          throw new Error(`HTTP error: ${response.status}`)
        }

        const data = await response.json()
        setPlans(data)
      } catch (err) {
        console.error('Error fetching WordPress hosting plans:', err)
        setError('Unable to load WordPress hosting plans')
      } finally {
        setLoading(false)
      }
    }

    fetchPlans()
  }, [])

  const resourceIcons = {
    storage: FaHdd,
    bandwidth: FaNetworkWired,
    databases: FaDatabase,
    websitesAllowed: FaGlobe,
    emailAccounts: FaEnvelope,
    sslIncluded: FaShieldAlt,
    dailyBackups: FaCloudDownloadAlt,
    controlPanel: FaCog,
    siteBuilder: FaPaintBrush,
  }

  return (
    <div className="min-h-screen bg-background py-20 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl font-bold text-vivid_blue mb-2">
              WordPress Hosting in South Africa
            </h1>
            <p className="text-lg text-center text-gray-600 max-w-3xl">
              Get blazing-fast, secure, and optimized hosting built for
              WordPress websites.
            </p>
          </div>
        </div>

        {loading && (
          <div className="max-w-2xl mx-auto p-6 my-40">
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-vivid_blue"></div>
              <span className="ml-4 text-lg">Loading WordPress plans...</span>
            </div>
          </div>
        )}

        {error && <p className="text-center text-red-600 py-8">{error}</p>}

        {/* Plans Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {plans.map((plan) => (
            <div
              key={plan._id}
              className="bg-white shadow-lg rounded-lg border border-gray-200 hover:shadow-xl transition-shadow duration-300">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-xl text-blue-600">
                    {plan.name}
                  </h3>
                  <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs font-semibold rounded">
                    WordPress
                  </span>
                </div>

                <div className="flex items-center gap-2 mb-4">
                  <FaMoneyBillWave className="text-green-500" />
                  <span className="font-bold text-2xl text-gray-900">
                    R{plan.price.toLocaleString('en-ZA')}
                  </span>
                  <span className="text-gray-500 text-sm">
                    /{plan.billingCycle}
                  </span>
                </div>

                {/* Resources */}
                <div className="space-y-3 mb-6">
                  {Object.entries(plan.resources).map(([key, value]) => {
                    const IconComponent = resourceIcons[key]
                    return (
                      <div
                        key={key}
                        className="flex items-center gap-3 text-sm">
                        {IconComponent && (
                          <IconComponent className="text-gray-400 flex-shrink-0" />
                        )}
                        <div className="flex-1">
                          <span className="font-medium text-gray-700 capitalize">
                            {key.replace(/([A-Z])/g, ' $1')}:
                          </span>
                          <span className="text-gray-600 ml-2">{value}</span>
                        </div>
                      </div>
                    )
                  })}
                </div>

                <button
                  onClick={() => handleAddToCart(plan)}
                  className="w-full bg-vivid_blue text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold">
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Footer Section */}
        <div className="text-center bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <h3 className="text-xl font-semibold mb-3">
            Trusted by Thousands of WordPress Site Owners
          </h3>
          <p className="text-gray-600 flex justify-center items-center gap-2 relative">
            <span className="text-green-600">
              <TiTick size={20} />
            </span>
            30-Day Money-Back Guarantee
            <span
              className="text-vivid_blue cursor-pointer"
              onMouseOver={() => setShowAnswer(true)}
              onMouseOut={() => setShowAnswer(false)}>
              <BsQuestionCircleFill />
            </span>
            {showAnswer && (
              <span className="absolute top-8 bg-gray-800 text-white shadow-lg rounded-md px-4 py-2 text-sm z-10">
                For more information please check our Refund Policy (exclusions
                may apply).
              </span>
            )}
          </p>
        </div>
      </div>
    </div>
  )
}

export default WordPress
