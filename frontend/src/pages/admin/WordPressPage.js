import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { API_URL } from '../../config'
import { useAuth } from '../../context/AuthContext'
import toast from 'react-hot-toast'
import {
  FaWordpress,
  FaPlus,
  FaEdit,
  FaTrash,
  FaTimes,
  FaSave,
  FaMoneyBillWave,
  FaHdd,
  FaNetworkWired,
  FaDatabase,
  FaGlobe,
  FaEnvelope,
  FaShieldAlt,
  FaCog,
  FaPaintBrush,
  FaCloudDownloadAlt,
  FaExclamationTriangle,
} from 'react-icons/fa'

const WordPressPage = () => {
  const { token } = useAuth()
  const [plans, setPlans] = useState([])
  const [loading, setLoading] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [planToDelete, setPlanToDelete] = useState(null)
  const [form, setForm] = useState({
    name: '',
    price: '',
    billingCycle: 'monthly',
    resources: {
      storage: '',
      bandwidth: '',
      databases: '',
      websitesAllowed: '',
      emailAccounts: '',
      sslIncluded: 'Free',
      dailyBackups: 'Free',
      controlPanel: 'Direct Admin',
      siteBuilder: 'Free',
    },
  })
  const [editingId, setEditingId] = useState(null)

  const fetchPlans = async () => {
    try {
      const res = await axios.get(`${API_URL}/admin/wordpress-hosting`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setPlans(res.data)
    } catch (err) {
      console.error('Fetch WordPress plans error:', err)
      toast.error('Failed to load WordPress hosting plans')
    }
  }

  useEffect(() => {
    fetchPlans()
  }, [token])

  const fetchPlanById = async (id) => {
    try {
      const res = await axios.get(`${API_URL}/admin/wordpress-hosting/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setForm(res.data)
      setEditingId(id)
      setShowModal(true)
    } catch (err) {
      console.error('Fetch WordPress plan by ID error:', err)
      toast.error('Failed to load WordPress hosting plan')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      if (editingId) {
        await axios.put(
          `${API_URL}/admin/wordpress-hosting/${editingId}`,
          form,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        )
        toast.success('WordPress hosting plan updated')
      } else {
        await axios.post(`${API_URL}/admin/wordpress-hosting`, form, {
          headers: { Authorization: `Bearer ${token}` },
        })
        toast.success('WordPress hosting plan created')
      }
      resetForm()
      setShowModal(false)
      fetchPlans()
    } catch (err) {
      console.error('Save WordPress plan error:', err)
      toast.error('Failed to save WordPress hosting plan')
    } finally {
      setLoading(false)
    }
  }

  const openDeleteModal = (plan) => {
    setPlanToDelete(plan)
    setShowDeleteModal(true)
  }

  const closeDeleteModal = () => {
    setShowDeleteModal(false)
    setPlanToDelete(null)
  }

  const handleDelete = async () => {
    if (!planToDelete) return

    try {
      await axios.delete(
        `${API_URL}/admin/wordpress-hosting/${planToDelete._id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      toast.success('WordPress hosting plan deleted')
      fetchPlans()
      closeDeleteModal()
    } catch (err) {
      console.error('Delete WordPress plan error:', err)
      toast.error('Failed to delete WordPress hosting plan')
    }
  }

  const resetForm = () => {
    setForm({
      name: '',
      price: '',
      billingCycle: 'monthly',
      resources: {
        storage: '',
        bandwidth: '',
        databases: '',
        websitesAllowed: '',
        emailAccounts: '',
        sslIncluded: 'Free',
        dailyBackups: 'Free',
        controlPanel: 'Direct Admin',
        siteBuilder: 'Free',
      },
    })
    setEditingId(null)
  }

  const openCreateModal = () => {
    resetForm()
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    resetForm()
  }

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
    <div className="p-4 sm:p-6 my-10">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <FaWordpress className="text-3xl text-vivid_blue" />
          <h2 className="text-2xl sm:text-4xl font-bold text-vivid_blue">
            WordPress Hosting
          </h2>
        </div>
        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 px-4 py-2 bg-vivid_blue text-white rounded-lg hover:bg-blue-700 transition-colors">
          <FaPlus />
          Create Plan
        </button>
      </div>

      {/* WordPress Plans Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <div
            key={plan._id}
            className="bg-white shadow-lg rounded-lg border border-gray-200 hover:shadow-xl transition-shadow duration-300">
            <div className="p-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-lg text-blue-600">{plan.name}</h3>
                <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs font-semibold rounded">
                  WordPress
                </span>
              </div>

              <div className="flex items-center gap-2 mb-4">
                <FaMoneyBillWave className="text-green-500" />
                <span className="font-bold text-xl text-gray-900">
                  R{plan.price.toLocaleString('en-ZA')}
                </span>
                <span className="text-gray-500 text-sm">
                  /{plan.billingCycle}
                </span>
              </div>

              {/* Resources */}
              <div className="space-y-2 mb-4">
                {Object.entries(plan.resources).map(([key, value]) => {
                  const IconComponent = resourceIcons[key]
                  return (
                    <div key={key} className="flex items-center gap-2 text-sm">
                      {IconComponent && (
                        <IconComponent className="text-gray-400" />
                      )}
                      <span className="font-medium capitalize">
                        {key.replace(/([A-Z])/g, ' $1')}:
                      </span>
                      <span className="text-gray-600">{value}</span>
                    </div>
                  )
                })}
              </div>

              <div className="flex gap-2 pt-4 border-t border-gray-200">
                <button
                  onClick={() => fetchPlanById(plan._id)}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  <FaEdit />
                  Edit
                </button>
                <button
                  onClick={() => openDeleteModal(plan)}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                  <FaTrash />
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="text-lg font-semibold">
                {editingId
                  ? 'Edit WordPress Hosting Plan'
                  : 'Create WordPress Hosting Plan'}
              </h3>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600">
                <FaTimes size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-700">
                    Basic Information
                  </h4>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Plan Name
                    </label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) =>
                        setForm({ ...form, name: e.target.value })
                      }
                      className="w-full border rounded-lg px-3 py-2 text-sm"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Price (R)
                    </label>
                    <input
                      type="number"
                      value={form.price}
                      onChange={(e) =>
                        setForm({ ...form, price: e.target.value })
                      }
                      className="w-full border rounded-lg px-3 py-2 text-sm"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Billing Cycle
                    </label>
                    <select
                      value={form.billingCycle}
                      onChange={(e) =>
                        setForm({ ...form, billingCycle: e.target.value })
                      }
                      className="w-full border rounded-lg px-3 py-2 text-sm">
                      <option value="monthly">Monthly</option>
                      <option value="yearly">Yearly</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-700">Resources</h4>

                  {Object.entries(form.resources).map(([key, value]) => {
                    const IconComponent = resourceIcons[key]
                    return (
                      <div key={key}>
                        <label className="block text-sm font-medium text-gray-700 mb-2 capitalize">
                          {IconComponent && (
                            <IconComponent className="inline mr-2" />
                          )}
                          {key.replace(/([A-Z])/g, ' $1')}
                        </label>
                        <input
                          type="text"
                          value={value}
                          onChange={(e) =>
                            setForm({
                              ...form,
                              resources: {
                                ...form.resources,
                                [key]: e.target.value,
                              },
                            })
                          }
                          className="w-full border rounded-lg px-3 py-2 text-sm"
                        />
                      </div>
                    )
                  })}
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50">
                  <FaSave />
                  {loading
                    ? 'Saving...'
                    : editingId
                    ? 'Update Plan'
                    : 'Create Plan'}
                </button>
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && planToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="flex items-center gap-3 p-6 border-b">
              <div className="flex-shrink-0">
                <FaExclamationTriangle className="text-red-500 text-xl" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                Delete WordPress Plan
              </h3>
            </div>

            <div className="p-6">
              <p className="text-gray-700 mb-4">
                Are you sure you want to delete the WordPress hosting plan{' '}
                <strong>"{planToDelete.name}"</strong>? This action cannot be
                undone.
              </p>

              <div className="flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={closeDeleteModal}
                  className="px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500 transition-colors">
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleDelete}
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                  <FaTrash />
                  Delete Plan
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default WordPressPage
