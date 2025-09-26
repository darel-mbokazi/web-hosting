import React, { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { API_URL } from '../config'
import toast from 'react-hot-toast'
import { useCart } from '../context/CartContext'

const Account = () => {
  const { user, loading, logout, token, updateUser } = useAuth()
  const { clearCart } = useCart()
  const navigate = useNavigate()
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
  })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        password: '',
      })
    }
  }, [user])

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-lg text-text">Loading...</p>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-6">
        <h1 className="text-3xl font-bold text-vivid_blue mb-4">Account</h1>
        <p className="text-text mb-6 text-center">
          Please login to view your account.
        </p>
        <Link
          to="/login"
          className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-vivid_blue transition duration-300">
          Login
        </Link>
      </div>
    )
  }

  const handleLogout = () => {
    clearCart()
    logout()
    navigate('/login')
  }

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value })

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)

    try {
      const updateData = {}
      if (formData.name !== user.name) updateData.name = formData.name
      if (formData.email !== user.email) updateData.email = formData.email
      if (formData.phone !== user.phone) updateData.phone = formData.phone
      if (formData.password) updateData.password = formData.password

      // If there's nothing to update
      if (Object.keys(updateData).length === 0) {
        toast.success('No changes to save!')
        setSaving(false)
        return
      }

      const res = await axios.put(
        `${API_URL}/auth/update-profile`,
        updateData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )

      updateUser(res.data)

      setFormData((prev) => ({ ...prev, password: '' }))

      toast.success('Profile updated successfully!')
    } catch (err) {
      console.error('Update error:', err)
      toast.error(err.response?.data?.error || 'Update failed')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="flex justify-center py-20 px-6 bg-gray-50 min-h-screen">
      <div className="bg-white shadow-lg rounded-xl p-8 max-w-md w-full">
        <h1 className="text-3xl font-bold text-vivid_blue text-center mb-6">
          My Account
        </h1>

        <form onSubmit={handleSave} className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-vivid_blue"
              type="text"
              placeholder={user.name}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-vivid_blue"
              type="email"
              placeholder={user.email}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone
            </label>
            <input
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-vivid_blue"
              type="tel"
              placeholder={user.phone || 'Enter phone number'}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              New Password (leave blank to keep current)
            </label>
            <input
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-vivid_blue"
              type="password"
              placeholder="Enter new password"
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full px-6 py-3 bg-primary text-white rounded-lg hover:bg-vivid_blue transition duration-300 disabled:opacity-50">
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </form>

        {user && (
          <button
            onClick={handleLogout}
            className="w-full px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-300">
            Logout
          </button>
        )}
      </div>
    </div>
  )
}

export default Account
