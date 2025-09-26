import React, { useState, useEffect } from 'react'
import axios from 'axios'
import {
  FaUsers,
  FaServer,
  FaShoppingCart,
  FaMoneyBillWave,
  FaChartLine,
  FaPuzzlePiece,
  FaWordpress,
  FaBoxOpen,
  FaClock,
  FaCheckCircle,
  FaSync,
  FaExclamationCircle,
} from 'react-icons/fa'
import { useAuth } from '../context/AuthContext'
import { API_URL } from '../config'

const AdminHomePage = () => {
  const { token } = useAuth()
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeHosting: 0,
    pendingOrders: 0,
    monthlyRevenue: 0,
    openTickets: 0,
    totalAddons: 0,
    wordpressPlans: 0,
    todayOrders: 0,
    totalOrders: 0,
    totalInvoices: 0,
    pendingInvoices: 0,
  })
  const [recentActivities, setRecentActivities] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      setError(null)

      const [
        usersResponse,
        ordersResponse,
        invoicesResponse,
        wordpressResponse,
        addonsResponse,
      ] = await Promise.all([
        axios.get(`${API_URL}/admin/users`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${API_URL}/admin/orders`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${API_URL}/admin/invoices`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${API_URL}/admin/hosting`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${API_URL}/admin/wordpress-hosting`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${API_URL}/admin/addons`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ])

      const users = usersResponse.data
      const orders = ordersResponse.data
      const invoices = invoicesResponse.data
      const wordpressPlans = wordpressResponse.data
      const addons = addonsResponse.data

      // Calculate stats
      const today = new Date().toISOString().split('T')[0]
      const todayOrders = orders.filter(
        (order) =>
          new Date(order.createdAt).toISOString().split('T')[0] === today
      ).length

      const pendingOrders = orders.filter(
        (order) => order.status === 'pending'
      ).length
      const pendingInvoices = invoices.filter(
        (invoice) => invoice.status === 'unpaid'
      ).length

      // Calculate monthly revenue 
      const currentMonth = new Date().getMonth()
      const currentYear = new Date().getFullYear()
      const monthlyRevenue = invoices
        .filter((invoice) => invoice.status === 'paid')
        .filter((invoice) => {
          const invoiceDate = new Date(invoice.createdAt)
          return (
            invoiceDate.getMonth() === currentMonth &&
            invoiceDate.getFullYear() === currentYear
          )
        })
        .reduce((total, invoice) => total + (invoice.amount || 0), 0)

      // Generate recent activities from orders and invoices
      const activities = [
        ...orders.slice(0, 5).map((order) => ({
          id: order._id,
          action: `New ${order.items?.[0]?.itemType || 'order'} order`,
          user: order.userId?.name || 'Customer',
          time: new Date(order.createdAt).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          }),
          status: order.status === 'paid' ? 'completed' : 'pending',
          type: 'order',
        })),
        ...invoices.slice(0, 3).map((invoice) => ({
          id: invoice._id,
          action: `Invoice ${invoice.status}`,
          user: invoice.userId?.name || 'Customer',
          time: new Date(invoice.createdAt).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          }),
          status: invoice.status === 'paid' ? 'completed' : 'pending',
          type: 'invoice',
        })),
      ]
        .sort((a, b) => new Date(b.time) - new Date(a.time))
        .slice(0, 5)

      setStats({
        totalUsers: users.length,
        activeHosting: orders.filter(
          (order) =>
            order.items?.some((item) => item.itemType === 'hosting') &&
            order.status === 'paid'
        ).length,
        pendingOrders,
        monthlyRevenue,
        openTickets: 0, 
        totalAddons: addons.length,
        wordpressPlans: wordpressPlans.length,
        todayOrders,
        totalOrders: orders.length,
        totalInvoices: invoices.length,
        pendingInvoices,
      })

      setRecentActivities(activities)
    } catch (err) {
      console.error('Error fetching dashboard data:', err)
      setError('Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (token) {
      fetchDashboardData()
    }
  }, [token])

  const StatCard = ({
    icon: Icon,
    title,
    value,
    subtitle,
    color = 'blue',
    trend,
    loading: cardLoading,
  }) => (
    <div className="bg-background rounded-lg shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-shadow duration-300">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          {cardLoading ? (
            <div className="animate-pulse bg-gray-200 rounded h-8 w-20 mt-1"></div>
          ) : (
            <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          )}
          {subtitle && !cardLoading && (
            <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
          )}
        </div>
        <div className={`p-3 rounded-full ${getColorClass(color)}`}>
          <Icon size={24} />
        </div>
      </div>
      {trend && !cardLoading && (
        <div
          className={`flex items-center mt-3 text-sm ${
            trend.value > 0 ? 'text-green-600' : 'text-red-600'
          }`}>
          {trend.value > 0 ? '↗' : '↘'} {Math.abs(trend.value)}% {trend.label}
        </div>
      )}
    </div>
  )

  const getColorClass = (color) => {
    const colors = {
      blue: 'bg-blue-100 text-blue-600',
      green: 'bg-green-100 text-green-600',
      yellow: 'bg-yellow-100 text-yellow-600',
      purple: 'bg-purple-100 text-purple-600',
      red: 'bg-red-100 text-red-600',
      indigo: 'bg-indigo-100 text-indigo-600',
    }
    return colors[color] || colors.blue
  }

  const ActivityItem = ({ activity }) => (
    <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
      <div className="flex items-center space-x-3">
        <div
          className={`p-2 rounded-full ${
            activity.status === 'completed'
              ? 'bg-green-100 text-green-600'
              : 'bg-yellow-100 text-yellow-600'
          }`}>
          {activity.status === 'completed' ? (
            <FaCheckCircle size={16} />
          ) : (
            <FaClock size={16} />
          )}
        </div>
        <div>
          <p className="font-medium text-gray-800">{activity.action}</p>
          <p className="text-sm text-gray-500">by {activity.user}</p>
        </div>
      </div>
      <span className="text-sm text-gray-400">{activity.time}</span>
    </div>
  )

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-vivid_blue mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FaExclamationCircle className="text-red-500 text-4xl mx-auto mb-4" />
          <p className="text-red-600 text-lg">{error}</p>
          <button
            onClick={fetchDashboardData}
            className="mt-4 flex items-center gap-2 bg-vivid_blue text-white px-4 py-2 rounded-lg hover:bg-blue-700">
            <FaSync />
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-vivid_blue mb-2">
              Admin Dashboard
            </h1>
            <p className="text-gray-600">
              Welcome back! Here's what's happening with your business today.
            </p>
          </div>
          <button
            onClick={fetchDashboardData}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
            <FaSync />
            Refresh
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={FaUsers}
            title="Total Users"
            value={stats.totalUsers.toLocaleString()}
            subtitle={`${stats.todayOrders} new today`}
            color="blue"
            loading={loading}
          />
          <StatCard
            icon={FaServer}
            title="Active Hosting"
            value={stats.activeHosting}
            subtitle="Running instances"
            color="green"
            loading={loading}
          />
          <StatCard
            icon={FaShoppingCart}
            title="Pending Orders"
            value={stats.pendingOrders}
            subtitle="Need approval"
            color="yellow"
            loading={loading}
          />
          <StatCard
            icon={FaMoneyBillWave}
            title="Monthly Revenue"
            value={`R${stats.monthlyRevenue.toLocaleString('en-ZA')}`}
            subtitle="Current month"
            color="purple"
            loading={loading}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Additional Stats */}
          <div className="lg:col-span-1 grid grid-cols-2 gap-4">
            <StatCard
              icon={FaBoxOpen}
              title="Total Orders"
              value={stats.totalOrders}
              color="indigo"
              loading={loading}
            />
            <StatCard
              icon={FaChartLine}
              title="Total Invoices"
              value={stats.totalInvoices}
              color="blue"
              loading={loading}
            />
            <StatCard
              icon={FaPuzzlePiece}
              title="Total Addons"
              value={stats.totalAddons}
              color="green"
              loading={loading}
            />
            <StatCard
              icon={FaWordpress}
              title="WordPress Plans"
              value={stats.wordpressPlans}
              color="purple"
              loading={loading}
            />
          </div>

          {/* Recent Activity */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-800">
                Recent Activity
              </h2>
              <span className="text-sm text-gray-500">Today</span>
            </div>
            <div className="space-y-1">
              {recentActivities.length > 0 ? (
                recentActivities.map((activity) => (
                  <ActivityItem key={activity.id} activity={activity} />
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">
                  No recent activity
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">
            Quick Actions
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button
              onClick={() => (window.location.href = '/admin/users')}
              className="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-lg hover:border-vivid_blue hover:bg-blue-50 transition-colors duration-200 group">
              <FaUsers
                className="text-gray-400 group-hover:text-vivid_blue mb-2"
                size={24}
              />
              <span className="text-sm font-medium text-gray-700 group-hover:text-vivid_blue">
                Manage Users
              </span>
            </button>
            <button
              onClick={() => (window.location.href = '/admin/orders')}
              className="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-lg hover:border-vivid_blue hover:bg-blue-50 transition-colors duration-200 group">
              <FaShoppingCart
                className="text-gray-400 group-hover:text-vivid_blue mb-2"
                size={24}
              />
              <span className="text-sm font-medium text-gray-700 group-hover:text-vivid_blue">
                View Orders
              </span>
            </button>
            <button
              onClick={() => (window.location.href = '/admin/hosting')}
              className="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-lg hover:border-vivid_blue hover:bg-blue-50 transition-colors duration-200 group">
              <FaServer
                className="text-gray-400 group-hover:text-vivid_blue mb-2"
                size={24}
              />
              <span className="text-sm font-medium text-gray-700 group-hover:text-vivid_blue">
                Hosting Plans
              </span>
            </button>
            <button
              onClick={() => (window.location.href = '/admin/invoices')}
              className="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-lg hover:border-vivid_blue hover:bg-blue-50 transition-colors duration-200 group">
              <FaChartLine
                className="text-gray-400 group-hover:text-vivid_blue mb-2"
                size={24}
              />
              <span className="text-sm font-medium text-gray-700 group-hover:text-vivid_blue">
                Invoices
              </span>
            </button>
          </div>
        </div>

        {/* System Status */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-800">Business Overview</h3>
              <div className="flex items-center text-green-600">
                <FaCheckCircle className="mr-1" />
                <span className="text-sm">Active</span>
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Pending Invoices</span>
                <span className="text-orange-600">{stats.pendingInvoices}</span>
              </div>
              <div className="flex justify-between">
                <span>Today's Orders</span>
                <span className="text-green-600">{stats.todayOrders}</span>
              </div>
              <div className="flex justify-between">
                <span>Active Services</span>
                <span className="text-blue-600">{stats.activeHosting}</span>
              </div>
            </div>
          </div>

          <div className="md:col-span-2 bg-white rounded-lg shadow-lg border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-800 mb-4">
              Revenue Summary
            </h3>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-vivid_blue">
                  R{stats.monthlyRevenue.toLocaleString('en-ZA')}
                </div>
                <div className="text-xs text-gray-500">This Month</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {stats.totalOrders}
                </div>
                <div className="text-xs text-gray-500">Total Orders</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-600">
                  {stats.totalUsers}
                </div>
                <div className="text-xs text-gray-500">Registered Users</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminHomePage
