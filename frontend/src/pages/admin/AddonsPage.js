import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { API_URL } from '../../config'
import { useAuth } from '../../context/AuthContext'
import toast from 'react-hot-toast'
import {
  FaPuzzlePiece,
  FaPlus,
  FaEdit,
  FaTrash,
  FaTimes,
  FaSave,
  FaMoneyBillWave,
  FaCalendarAlt,
  FaExclamationTriangle,
} from 'react-icons/fa'

const AddonsPage = () => {
  const { token } = useAuth()
  const [addons, setAddons] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [addonToDelete, setAddonToDelete] = useState(null)
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    billingCycle: 'monthly',
    type: 'other',
  })
  const [editingId, setEditingId] = useState(null)
  const [loading, setLoading] = useState(false)

  const fetchAddons = async () => {
    try {
      const res = await axios.get(`${API_URL}/admin/addons`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setAddons(res.data)
    } catch (err) {
      console.error('Fetch addons error:', err)
      toast.error('Failed to load addons')
    }
  }

  useEffect(() => {
    fetchAddons()
  }, [token])

  const fetchAddonById = async (id) => {
    try {
      const res = await axios.get(`${API_URL}/admin/addons/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setForm(res.data)
      setEditingId(id)
      setShowModal(true)
    } catch (err) {
      console.error('Fetch addon by ID error:', err)
      toast.error('Failed to load addon')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      if (editingId) {
        await axios.put(`${API_URL}/admin/addons/${editingId}`, form, {
          headers: { Authorization: `Bearer ${token}` },
        })
        toast.success('Addon updated')
      } else {
        await axios.post(`${API_URL}/admin/addons`, form, {
          headers: { Authorization: `Bearer ${token}` },
        })
        toast.success('Addon created')
      }
      resetForm()
      setShowModal(false)
      fetchAddons()
    } catch (err) {
      console.error('Save addon error:', err)
      toast.error('Failed to save addon')
    } finally {
      setLoading(false)
    }
  }

  const openDeleteModal = (addon) => {
    setAddonToDelete(addon)
    setShowDeleteModal(true)
  }

  const closeDeleteModal = () => {
    setShowDeleteModal(false)
    setAddonToDelete(null)
  }

  const handleDelete = async () => {
    if (!addonToDelete) return

    try {
      await axios.delete(`${API_URL}/admin/addons/${addonToDelete._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      toast.success('Addon deleted')
      fetchAddons()
      closeDeleteModal()
    } catch (err) {
      console.error('Delete addon error:', err)
      toast.error('Failed to delete addon')
    }
  }

  const resetForm = () => {
    setForm({
      name: '',
      description: '',
      price: '',
      billingCycle: 'monthly',
      type: 'other',
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
    <div className="p-4 sm:p-6 my-10">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <FaPuzzlePiece className="text-3xl text-vivid_blue" />
          <h2 className="text-2xl sm:text-4xl font-bold text-vivid_blue">
            Addons
          </h2>
        </div>
        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 px-4 py-2 bg-vivid_blue text-white rounded-lg hover:bg-blue-700 transition-colors">
          <FaPlus />
          Create Addon
        </button>
      </div>

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

              <p className="text-gray-600 text-sm mb-4">{addon.description}</p>

              <div className="flex items-center gap-2 mb-3">
                <FaMoneyBillWave className="text-green-500" />
                <span className="font-bold text-xl text-gray-900">
                  R{addon.price.toLocaleString('en-ZA')}
                </span>
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                <FaCalendarAlt className="text-gray-400" />
                <span>Billing: {addon.billingCycle}</span>
              </div>

              <div className="flex gap-2 pt-4 border-t border-gray-200">
                <button
                  onClick={() => fetchAddonById(addon._id)}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  <FaEdit />
                  Edit
                </button>
                <button
                  onClick={() => openDeleteModal(addon)}
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
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="text-lg font-semibold">
                {editingId ? 'Edit Addon' : 'Create Addon'}
              </h3>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600">
                <FaTimes size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Addon Name
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
                    <option value="one-time">One-Time</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Type
                  </label>
                  <select
                    value={form.type}
                    onChange={(e) => setForm({ ...form, type: e.target.value })}
                    className="w-full border rounded-lg px-3 py-2 text-sm">
                    <option value="backup">Backup</option>
                    <option value="antivirus">Antivirus</option>
                    <option value="other">Other</option>
                  </select>
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
                    ? 'Update Addon'
                    : 'Create Addon'}
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
      {showDeleteModal && addonToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="flex items-center gap-3 p-6 border-b">
              <div className="flex-shrink-0">
                <FaExclamationTriangle className="text-red-500 text-xl" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                Delete Addon
              </h3>
            </div>

            <div className="p-6">
              <p className="text-gray-700 mb-4">
                Are you sure you want to delete the addon{' '}
                <strong>"{addonToDelete.name}"</strong>? This action cannot be
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
                  Delete Addon
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AddonsPage
