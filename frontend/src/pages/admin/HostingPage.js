import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { API_URL } from '../../config'
import { useAuth } from '../../context/AuthContext'
import toast from 'react-hot-toast'
import {
  FaServer,
  FaPlus,
  FaEdit,
  FaTrash,
  FaTimes,
  FaSave,
  FaHdd,
  FaNetworkWired,
  FaDatabase,
  FaGlobe,
  FaEnvelope,
  FaShieldAlt,
  FaMoneyBillWave,
  FaExclamationTriangle,
} from 'react-icons/fa'

const HostingPage = () => {
  const { token } = useAuth()
  const [plans, setPlans] = useState([])
  const [loading, setLoading] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [planToDelete, setPlanToDelete] = useState(null)
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    billingCycle: 'monthly',
    resources: {
      storage: '',
      bandwidth: '',
      databases: '',
      websitesAllowed: '',
      emailAccounts: '',
      sslIncluded: 'Free',
    },
  })
  const [editingId, setEditingId] = useState(null)

  const fetchPlans = async () => {
    try {
      const res = await axios.get(`${API_URL}/admin/hosting`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setPlans(res.data)
    } catch (err) {
      console.error('Fetch plans error:', err)
      toast.error('Failed to load hosting plans')
    }
  }

  useEffect(() => {
    fetchPlans()
  }, [token])

  const fetchPlanById = async (id) => {
    try {
      const res = await axios.get(`${API_URL}/admin/hosting/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setForm(res.data)
      setEditingId(id)
      setShowModal(true)
    } catch (err) {
      console.error('Fetch plan by ID error:', err)
      toast.error('Failed to load hosting plan')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      if (editingId) {
        await axios.put(`${API_URL}/admin/hosting/${editingId}`, form, {
          headers: { Authorization: `Bearer ${token}` },
        })
        toast.success('Hosting plan updated')
      } else {
        await axios.post(`${API_URL}/admin/hosting`, form, {
          headers: { Authorization: `Bearer ${token}` },
        })
        toast.success('Hosting plan created')
      }
      resetForm()
      setShowModal(false)
      fetchPlans()
    } catch (err) {
      console.error('Save plan error:', err)
      toast.error('Failed to save hosting plan')
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
      await axios.delete(`${API_URL}/admin/hosting/${planToDelete._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      toast.success('Hosting plan deleted')
      fetchPlans()
      closeDeleteModal()
    } catch (err) {
      console.error('Delete plan error:', err)
      toast.error('Failed to delete hosting plan')
    }
  }

  const resetForm = () => {
    setForm({
      name: '',
      description: '',
      price: '',
      billingCycle: 'monthly',
      resources: {
        storage: '',
        bandwidth: '',
        databases: '',
        websitesAllowed: '',
        emailAccounts: '',
        sslIncluded: 'Free',
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

  return (
    <div className="p-4 sm:p-6 my-10">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <FaServer className="text-3xl text-vivid_blue" />
          <h2 className="text-2xl sm:text-4xl font-bold text-vivid_blue">
            Hosting Plans
          </h2>
        </div>
        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 px-4 py-2 bg-vivid_blue text-white rounded-lg hover:bg-blue-700 transition-colors">
          <FaPlus />
          Create Plan
        </button>
      </div>

      {/* Plans Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <div
            key={plan._id}
            className="bg-white shadow-lg rounded-lg border border-gray-200 hover:shadow-xl transition-shadow duration-300">
            <div className="p-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-lg text-gray-800">{plan.name}</h3>
                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded">
                  {plan.billingCycle}
                </span>
              </div>

              <p className="text-gray-600 text-sm mb-4">{plan.description}</p>

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
                <div className="flex items-center gap-2 text-sm">
                  <FaHdd className="text-gray-400" />
                  <span className="font-medium">Storage:</span>
                  <span className="text-gray-600">
                    {plan.resources.storage}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <FaNetworkWired className="text-gray-400" />
                  <span className="font-medium">Bandwidth:</span>
                  <span className="text-gray-600">
                    {plan.resources.bandwidth}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <FaDatabase className="text-gray-400" />
                  <span className="font-medium">Databases:</span>
                  <span className="text-gray-600">
                    {plan.resources.databases}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <FaGlobe className="text-gray-400" />
                  <span className="font-medium">Websites:</span>
                  <span className="text-gray-600">
                    {plan.resources.websitesAllowed}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <FaEnvelope className="text-gray-400" />
                  <span className="font-medium">Email Accounts:</span>
                  <span className="text-gray-600">
                    {plan.resources.emailAccounts}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <FaShieldAlt className="text-gray-400" />
                  <span className="font-medium">SSL:</span>
                  <span className="text-gray-600">
                    {plan.resources.sslIncluded}
                  </span>
                </div>
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
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="text-lg font-semibold">
                {editingId ? 'Edit Hosting Plan' : 'Create Hosting Plan'}
              </h3>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600">
                <FaTimes size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Plan Name
                  </label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
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

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={form.description}
                    onChange={(e) =>
                      setForm({ ...form, description: e.target.value })
                    }
                    className="w-full border rounded-lg px-3 py-2 text-sm"
                    rows="3"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <h4 className="font-semibold text-gray-700 mb-3">
                    Resources
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(form.resources).map(([key, value]) => (
                      <div key={key}>
                        <label className="block text-sm font-medium text-gray-700 mb-2 capitalize">
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
                    ))}
                  </div>
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
                Delete Hosting Plan
              </h3>
            </div>

            <div className="p-6">
              <p className="text-gray-700 mb-4">
                Are you sure you want to delete the hosting plan{' '}
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

export default HostingPage
