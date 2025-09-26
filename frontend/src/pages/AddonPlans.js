import React, { useEffect, useState } from 'react'
import { API_URL } from '../config'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import toast from 'react-hot-toast'
import {
  FaMoneyBillWave,
  FaCalendarAlt,
} from 'react-icons/fa'

const AddonPlans = () => {
  const [addons, setAddons] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const { addAddon } = useCart()
  const navigate = useNavigate()

  useEffect(() => {
    const fetchAddons = async () => {
      try {
        const response = await fetch(`${API_URL}/addon/plans`)
        const data = await response.json()

        if (!response.ok) {
          setError(data.error || 'Failed to fetch add-on plans')
        } else {
          setAddons(data)
        }
      } catch (err) {
        console.error('Error fetching add-on plans:', err)
        setError('Unable to load add-on plans')
      } finally {
        setLoading(false)
      }
    }

    fetchAddons()
  }, [])

  const handleAddToCart = async (addon) => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        toast.error('Please log in to add addon to cart')
        navigate('/login')
        return
      }

      await addAddon(addon._id)
      toast.success(`${addon.name} added to cart`)
      navigate('/cart')
    } catch (err) {
      console.error('Error adding addon:', err)
      toast.error('Failed to add addon to cart')
    }
  }

  const getTypeColor = (type) => {
    switch (type) {
      case 'backup':
        return 'bg-blue-100 text-blue-800'
      case 'antivirus':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="min-h-screen bg-background py-20 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="items-center justify-center gap-3 mb-8">
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl font-bold text-vivid_blue mb-2">
              Add-on Plans
            </h1>
            <p className="text-lg text-center text-gray-600">
              Enhance your hosting experience with powerful add-ons.
            </p>
          </div>
        </div>

        {loading && (
          <div className="max-w-2xl mx-auto p-6 my-40">
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-vivid_blue"></div>
              <span className="ml-4 text-lg">Loading Addons...</span>
            </div>
          </div>
        )}
        {error && <p className="text-center text-red-600 py-8">{error}</p>}

        {/* Addons Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {addons.map((addon) => (
            <div
              key={addon._id}
              className="bg-white shadow-lg rounded-lg border border-gray-200 hover:shadow-xl transition-shadow duration-300">
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-lg text-gray-800">
                    {addon.name}
                  </h3>
                  <span
                    className={`px-2 py-1 text-xs font-semibold rounded ${getTypeColor(
                      addon.type
                    )}`}>
                    {addon.type}
                  </span>
                </div>

                <p className="text-gray-600 text-sm mb-4">
                  {addon.description}
                </p>

                <div className="flex items-center gap-2 mb-3">
                  <FaMoneyBillWave className="text-green-500" />
                  <span className="font-bold text-xl text-gray-900">
                    R{addon.price.toLocaleString('en-ZA')}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
                  <FaCalendarAlt className="text-gray-400" />
                  <span>Billing: {addon.billingCycle}</span>
                </div>

                <button
                  onClick={() => handleAddToCart(addon)}
                  className="w-full bg-vivid_blue text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold">
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default AddonPlans
