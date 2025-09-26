import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { API_URL } from '../../config'
import { useAuth } from '../../context/AuthContext'
import toast from 'react-hot-toast'
import {
  FaUsers,
  FaUser,
  FaEnvelope,
  FaSync,
  FaSearch,
  FaFilter,
  FaBan,
  FaCheckCircle,
} from 'react-icons/fa'

const UsersPage = () => {
  const { token } = useAuth()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')

  const fetchUsers = React.useCallback(async () => {
    setLoading(true)
    try {
      const res = await axios.get(`${API_URL}/admin/users`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setUsers(res.data)
    } catch (err) {
      console.error('Fetch users error:', err)
      toast.error('Failed to load users')
    } finally {
      setLoading(false)
    }
  }, [token])

  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  const handleRoleChange = async (userId, newRole) => {
    setUpdating(userId)
    try {
      await axios.patch(
        `${API_URL}/admin/users/role`,
        { userId, role: newRole },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      toast.success('User role updated successfully')
      fetchUsers()
    } catch (err) {
      console.error('Update role error:', err)
      toast.error(err.response?.data?.error || 'Failed to update role')
    } finally {
      setUpdating(null)
    }
  }

  const handleStatusChange = async (userId, currentStatus) => {
    setUpdating(userId)
    try {
      const newStatus = currentStatus === 'active' ? 'suspended' : 'active'
      await axios.patch(
        `${API_URL}/admin/users/status`,
        { userId, status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      toast.success(
        `User ${
          newStatus === 'active' ? 'activated' : 'suspended'
        } successfully`
      )
      fetchUsers()
    } catch (err) {
      console.error('Update status error:', err)
      toast.error(err.response?.data?.error || 'Failed to update status')
    } finally {
      setUpdating(null)
    }
  }

  // Filter users based on search term and role filter
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = roleFilter === 'all' || user.role === roleFilter
    return matchesSearch && matchesRole
  })

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin':
        return 'bg-red-100 text-red-800'
      case 'support':
        return 'bg-blue-100 text-blue-800'
      case 'customer':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusColor = (status) => {
    return status === 'active'
      ? 'bg-green-100 text-green-800'
      : 'bg-red-100 text-red-800'
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-vivid_blue mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Loading users...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background mt-10 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <FaUsers className="text-3xl text-vivid_blue" />
            <div>
              <h1 className="text-2xl text-center sm:text-3xl font-bold text-vivid_blue">
                User Management
              </h1>
            </div>
          </div>
          <button
            onClick={fetchUsers}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
            <FaSync />
            Refresh
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-vivid_blue"
              />
            </div>

            <div className="relative">
              <FaFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-vivid_blue">
                <option value="all">All Roles</option>
                <option value="customer">Customer</option>
                <option value="support">Support</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <div className="text-sm text-gray-600 flex items-center">
              <span className="bg-vivid_blue text-white px-2 py-1 rounded mr-2">
                {filteredUsers.length}
              </span>
              users found
            </div>
          </div>
        </div>

        {/* Desktop Table */}
        <div className="hidden lg:block bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="p-4 text-left font-semibold text-gray-700">
                  User
                </th>
                <th className="p-4 text-left font-semibold text-gray-700">
                  Contact
                </th>
                <th className="p-4 text-left font-semibold text-gray-700">
                  Status
                </th>
                <th className="p-4 text-left font-semibold text-gray-700">
                  Role
                </th>
                <th className="p-4 text-left font-semibold text-gray-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr
                  key={user._id}
                  className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-vivid_blue rounded-full flex items-center justify-center">
                        <FaUser className="text-white text-sm" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{user.name}</p>
                        <p className="text-sm text-gray-500">
                          ID: {user._id.slice(-8)}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2 text-gray-700">
                      <FaEnvelope className="text-gray-400" />
                      {user.email}
                    </div>
                  </td>
                  <td className="p-4">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                        user.status || 'active'
                      )}`}>
                      {user.status === 'suspended' ? (
                        <FaBan size={10} />
                      ) : (
                        <FaCheckCircle size={10} />
                      )}
                      {user.status || 'active'}
                    </span>
                  </td>
                  <td className="p-4">
                    <select
                      value={user.role}
                      onChange={(e) =>
                        handleRoleChange(user._id, e.target.value)
                      }
                      disabled={updating === user._id}
                      className={`px-3 py-1 border rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-vivid_blue ${getRoleColor(
                        user.role
                      )}`}>
                      <option value="customer">Customer</option>
                      <option value="support">Support</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() =>
                          handleStatusChange(user._id, user.status || 'active')
                        }
                        disabled={updating === user._id}
                        className={`flex items-center gap-1 px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                          user.status === 'suspended'
                            ? 'bg-green-100 text-green-700 hover:bg-green-200'
                            : 'bg-red-100 text-red-700 hover:bg-red-200'
                        } disabled:opacity-50`}>
                        {updating === user._id ? (
                          <FaSync className="animate-spin" />
                        ) : user.status === 'suspended' ? (
                          <FaCheckCircle />
                        ) : (
                          <FaBan />
                        )}
                        {user.status === 'suspended' ? 'Activate' : 'Suspend'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="lg:hidden space-y-4">
          {filteredUsers.map((user) => (
            <div
              key={user._id}
              className="bg-white rounded-lg shadow-md border border-gray-200 p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-vivid_blue rounded-full flex items-center justify-center">
                    <FaUser className="text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{user.name}</p>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </div>
                </div>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                    user.status || 'active'
                  )}`}>
                  {user.status || 'active'}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Role
                  </label>
                  <select
                    value={user.role}
                    onChange={(e) => handleRoleChange(user._id, e.target.value)}
                    disabled={updating === user._id}
                    className={`w-full px-3 py-2 border rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-vivid_blue ${getRoleColor(
                      user.role
                    )}`}>
                    <option value="customer">Customer</option>
                    <option value="support">Support</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <button
                    onClick={() =>
                      handleStatusChange(user._id, user.status || 'active')
                    }
                    disabled={updating === user._id}
                    className={`w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      user.status === 'suspended'
                        ? 'bg-green-100 text-green-700 hover:bg-green-200'
                        : 'bg-red-100 text-red-700 hover:bg-red-200'
                    } disabled:opacity-50`}>
                    {updating === user._id ? (
                      <FaSync className="animate-spin" />
                    ) : user.status === 'suspended' ? (
                      <FaCheckCircle />
                    ) : (
                      <FaBan />
                    )}
                    {user.status === 'suspended' ? 'Activate' : 'Suspend'}
                  </button>
                </div>
              </div>

              <div className="text-xs text-gray-500 border-t pt-2">
                User ID: {user._id}
              </div>
            </div>
          ))}
        </div>

        {filteredUsers.length === 0 && (
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-8 text-center">
            <FaUsers className="text-4xl text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">
              No users found
            </h3>
            <p className="text-gray-500">
              {searchTerm || roleFilter !== 'all'
                ? 'Try adjusting your search or filter criteria'
                : 'No users in the system'}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default UsersPage
