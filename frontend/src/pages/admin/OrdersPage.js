import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { API_URL } from '../../config'
import { useAuth } from '../../context/AuthContext'
import toast from 'react-hot-toast'
import {
  FaShoppingCart,
  FaUser,
  FaMoneyBill,
  FaCalendar,
  FaGlobe,
  FaServer,
  FaWordpress,
  FaCog,
  FaCheck,
  FaTimes,
  FaSync,
} from 'react-icons/fa'

const OrdersPage = () => {
  const { token } = useAuth()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchOrders = () => {
      setLoading(true)
      axios
        .get(`${API_URL}/admin/orders`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          setOrders(res.data)
          setLoading(false)
        })
        .catch((err) => {
          console.error(err)
          setLoading(false)
          toast.error('Failed to fetch orders')
        })
    }
    fetchOrders()
  }, [token])

  const formatDate = (date) =>
    new Date(date).toLocaleString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })

  const updateOrderStatus = async (id, status) => {
    try {
      await axios.put(
        `${API_URL}/admin/orders/${id}`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      toast.success(`Order marked as ${status}`)
      // Refetch orders after update
      const res = await axios.get(`${API_URL}/admin/orders`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setOrders(res.data)
    } catch (err) {
      console.error(err)
      toast.error('Failed to update order')
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'paid':
        return <FaCheck className="text-green-500" />
      case 'pending':
        return <FaSync className="text-yellow-500" />
      case 'cancelled':
        return <FaTimes className="text-red-500" />
      default:
        return <FaShoppingCart />
    }
  }

  const getItemIcon = (itemType) => {
    switch (itemType) {
      case 'domain':
        return <FaGlobe className="text-blue-500" />
      case 'hosting':
        return <FaServer className="text-green-500" />
      case 'wordpress':
        return <FaWordpress className="text-blue-600" />
      case 'addon':
        return <FaCog className="text-gray-500" />
      default:
        return <FaShoppingCart />
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-vivid_blue"></div>
      </div>
    )
  }

  return (
    <div className="p-4 sm:p-6 mb-10">
      <div className="flex items-center justify-center gap-3 my-6">
        <FaShoppingCart className="text-3xl text-vivid_blue" />
        <h2 className="text-2xl sm:text-4xl font-bold text-center text-vivid_blue">
          Orders
        </h2>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-12">
          <FaShoppingCart className="text-6xl text-gray-300 mx-auto mb-4" />
          <p className="text-xl text-gray-500">No orders found</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {orders.map((o) => (
            <div
              key={o._id}
              className="bg-white shadow-lg rounded-lg border border-gray-200 hover:shadow-xl transition-shadow duration-300">
              <div className="p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(o.status)}
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        o.status === 'paid'
                          ? 'bg-green-100 text-green-800'
                          : o.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                      {o.status.toUpperCase()}
                    </span>
                  </div>
                  <span className="text-sm text-gray-500">
                    #{o._id.slice(-6)}
                  </span>
                </div>

                {/* User Info */}
                <div className="flex items-center gap-3 mb-3">
                  <FaUser className="text-gray-400" />
                  <div>
                    <p className="font-semibold text-gray-800">
                      {o.userId?.name}
                    </p>
                    <p className="text-sm text-gray-600">{o.userId?.email}</p>
                  </div>
                </div>

                {/* Total Amount */}
                <div className="flex items-center gap-3 mb-3">
                  <FaMoneyBill className="text-green-500" />
                  <div>
                    <p className="text-sm text-gray-600">Total Amount</p>
                    <p className="font-bold text-lg text-gray-900">
                      R{o.total.toLocaleString('en-ZA')}
                    </p>
                  </div>
                </div>

                {/* Date */}
                <div className="flex items-center gap-3 mb-4">
                  <FaCalendar className="text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Order Date</p>
                    <p className="text-sm font-medium text-gray-800">
                      {formatDate(o.createdAt)}
                    </p>
                  </div>
                </div>

                {/* Items */}
                <div className="mb-4">
                  <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                    <FaShoppingCart className="text-gray-400" />
                    Order Items
                  </h4>
                  <ul className="space-y-2">
                    {o.items.map((item, idx) => (
                      <li
                        key={idx}
                        className="flex items-center gap-3 text-sm p-2 bg-gray-50 rounded">
                        <span className="flex-shrink-0">
                          {getItemIcon(item.itemType)}
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-800 truncate">
                            {item.name}
                          </p>
                          <div className="flex justify-between text-xs text-gray-600">
                            <span>R{item.price.toLocaleString('en-ZA')}</span>
                            {item.billingCycle && (
                              <span>{item.billingCycle}</span>
                            )}
                            {item.registrationPeriod && (
                              <span>{item.registrationPeriod} yr</span>
                            )}
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-4 border-t border-gray-200">
                  {o.status !== 'paid' && (
                    <button
                      onClick={() => updateOrderStatus(o._id, 'paid')}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200">
                      <FaCheck />
                      Mark Paid
                    </button>
                  )}
                  {o.status !== 'cancelled' && (
                    <button
                      onClick={() => updateOrderStatus(o._id, 'cancelled')}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200">
                      <FaTimes />
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default OrdersPage
