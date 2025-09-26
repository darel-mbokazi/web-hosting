import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { API_URL } from '../../config'
import { useAuth } from '../../context/AuthContext'
import toast from 'react-hot-toast'
import {
  FaFileInvoice,
  FaUser,
  FaMoneyBillWave,
  FaCalendarAlt,
  FaClock,
  FaCheck,
  FaTimes,
  FaReceipt,
  FaIdCard,
  FaShoppingCart,
  FaExclamationTriangle,
} from 'react-icons/fa'

const InvoicesPage = () => {
  const { token } = useAuth()
  const [invoices, setInvoices] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchInvoices = React.useCallback(() => {
    setLoading(true)
    axios
      .get(`${API_URL}/admin/invoices`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setInvoices(res.data)
        setLoading(false)
      })
      .catch((err) => {
        console.error(err)
        setLoading(false)
        toast.error('Failed to fetch invoices')
      })
  }, [token])

  useEffect(() => {
    fetchInvoices()
  }, [token, fetchInvoices])

  const formatDate = (date) =>
    new Date(date).toLocaleString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })

  const isOverdue = (dueDate) => {
    return new Date(dueDate) < new Date()
  }

  const updateInvoiceStatus = async (id, status) => {
    try {
      await axios.put(
        `${API_URL}/admin/invoices/${id}`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      toast.success(`Invoice marked as ${status}`)
      fetchInvoices()
    } catch (err) {
      console.error(err)
      toast.error('Failed to update invoice')
    }
  }

  const getStatusIcon = (status, dueDate) => {
    if (status === 'paid') {
      return <FaCheck className="text-green-500" />
    }
    if (isOverdue(dueDate)) {
      return <FaExclamationTriangle className="text-red-500" />
    }
    return <FaClock className="text-yellow-500" />
  }

  const getStatusBadge = (status, dueDate) => {
    if (status === 'paid') {
      return 'bg-green-100 text-green-800'
    }
    if (isOverdue(dueDate)) {
      return 'bg-red-100 text-red-800'
    }
    return 'bg-yellow-100 text-yellow-800'
  }

  const getStatusText = (status, dueDate) => {
    if (status === 'paid') {
      return 'PAID'
    }
    if (isOverdue(dueDate)) {
      return 'OVERDUE'
    }
    return 'PENDING'
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
        <FaFileInvoice className="text-3xl text-vivid_blue" />
        <h2 className="text-2xl sm:text-4xl font-bold text-center text-vivid_blue">
          Invoices
        </h2>
      </div>

      {invoices.length === 0 ? (
        <div className="text-center py-12">
          <FaFileInvoice className="text-6xl text-gray-300 mx-auto mb-4" />
          <p className="text-xl text-gray-500">No invoices found</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {invoices.map((invoice) => (
            <div
              key={invoice._id}
              className="bg-white shadow-lg rounded-lg border border-gray-200 hover:shadow-xl transition-shadow duration-300">
              <div className="p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(invoice.status, invoice.dueDate)}
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusBadge(
                        invoice.status,
                        invoice.dueDate
                      )}`}>
                      {getStatusText(invoice.status, invoice.dueDate)}
                    </span>
                  </div>
                  <span className="text-sm text-gray-500">
                    #{invoice._id.slice(-6)}
                  </span>
                </div>

                {/* User Info */}
                <div className="flex items-center gap-3 mb-3">
                  <FaUser className="text-gray-400" />
                  <div>
                    <p className="font-semibold text-gray-800">
                      {invoice.userId?.name}
                    </p>
                    <p className="text-sm text-gray-600">
                      {invoice.userId?.email}
                    </p>
                  </div>
                </div>

                {/* Order ID */}
                <div className="flex items-center gap-3 mb-3">
                  <FaShoppingCart className="text-blue-500" />
                  <div>
                    <p className="text-sm text-gray-600">Order ID</p>
                    <p className="font-mono text-sm text-gray-800">
                      #{invoice.orderId?.slice(-8)}
                    </p>
                  </div>
                </div>

                {/* Amount */}
                <div className="flex items-center gap-3 mb-3">
                  <FaMoneyBillWave className="text-green-500" />
                  <div>
                    <p className="text-sm text-gray-600">Amount Due</p>
                    <p className="font-bold text-lg text-gray-900">
                      R{invoice.amount.toLocaleString('en-ZA')}
                    </p>
                  </div>
                </div>

                {/* Dates */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-3">
                    <FaCalendarAlt className="text-gray-400" />
                    <div className="flex-1">
                      <p className="text-sm text-gray-600">Due Date</p>
                      <p
                        className={`text-sm font-medium ${
                          isOverdue(invoice.dueDate) &&
                          invoice.status !== 'paid'
                            ? 'text-red-600'
                            : 'text-gray-800'
                        }`}>
                        {formatDate(invoice.dueDate)}
                        {isOverdue(invoice.dueDate) &&
                          invoice.status !== 'paid' && (
                            <span className="ml-2 text-xs text-red-500">
                              (Overdue)
                            </span>
                          )}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <FaReceipt className="text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">Created</p>
                      <p className="text-sm font-medium text-gray-800">
                        {formatDate(invoice.createdAt)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Invoice ID */}
                <div className="flex items-center gap-3 mb-4 p-2 bg-gray-50 rounded">
                  <FaIdCard className="text-gray-400" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-600">Invoice ID</p>
                    <p className="text-xs font-mono text-gray-800 truncate">
                      {invoice._id}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-4 border-t border-gray-200">
                  {invoice.status !== 'paid' && (
                    <button
                      onClick={() => updateInvoiceStatus(invoice._id, 'paid')}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200">
                      <FaCheck />
                      Mark Paid
                    </button>
                  )}
                  {invoice.status !== 'unpaid' && (
                    <button
                      onClick={() => updateInvoiceStatus(invoice._id, 'unpaid')}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors duration-200">
                      <FaTimes />
                      Mark Unpaid
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

export default InvoicesPage
