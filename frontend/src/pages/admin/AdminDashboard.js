import React, { useState } from 'react'
import { Link, Outlet } from 'react-router-dom'
import {
  FaUsers,
  FaShoppingCart,
  FaFileInvoice,
  FaServer,
  FaWordpress,
  FaPuzzlePiece,
  FaBars,
  FaTimes,
} from 'react-icons/fa'

const AdminDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  const closeSidebar = () => {
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false)
    }
  }

  // Close sidebar on window resize
  React.useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsSidebarOpen(false)
      }
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <div className="min-h-screen flex mb-20">
      {/* Mobile Menu Button - Right side */}
      <button
        onClick={toggleSidebar}
        className="md:hidden fixed top-24 right-4 z-50 p-3 bg-vivid_blue text-white rounded-lg shadow-lg">
        {isSidebarOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
      </button>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-6 bg-background min-h-screen w-full md:w-auto order-1 md:order-1">
        <div className="pt-16 md:pt-0">
          <Outlet />
        </div>
      </main>

      {/* Sidebar on mobile */}
      <aside
        className={`
        fixed md:static inset-y-0 right-0 top-24 z-40
        w-64 text-white bg-vivid_blue max-h-svh p-6 space-y-6
        transform transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full md:translate-x-0'}
        order-2 md:order-2
      `}>
        {/* Close button for mobile */}
        <div className="flex justify-between items-center md:justify-center">
          <h1 className="text-2xl font-bold pt-5 text-center">Admin Panel</h1>
        </div>

        <nav className="flex flex-col gap-3">
          <Link
            to="/admin/users"
            className="flex items-center gap-3 hover:text-primary p-3 rounded-lg hover:bg-blue-700 transition-colors duration-200"
            onClick={closeSidebar}>
            <FaUsers className="text-lg" />
            <span>Users</span>
          </Link>
          <Link
            to="/admin/orders"
            className="flex items-center gap-3 hover:text-primary p-3 rounded-lg hover:bg-blue-700 transition-colors duration-200"
            onClick={closeSidebar}>
            <FaShoppingCart className="text-lg" />
            <span>Orders</span>
          </Link>
          <Link
            to="/admin/invoices"
            className="flex items-center gap-3 hover:text-primary p-3 rounded-lg hover:bg-blue-700 transition-colors duration-200"
            onClick={closeSidebar}>
            <FaFileInvoice className="text-lg" />
            <span>Invoices</span>
          </Link>
          <Link
            to="/admin/hosting"
            className="flex items-center gap-3 hover:text-primary p-3 rounded-lg hover:bg-blue-700 transition-colors duration-200"
            onClick={closeSidebar}>
            <FaServer className="text-lg" />
            <span>Hosting</span>
          </Link>
          <Link
            to="/admin/wordpress"
            className="flex items-center gap-3 hover:text-primary p-3 rounded-lg hover:bg-blue-700 transition-colors duration-200"
            onClick={closeSidebar}>
            <FaWordpress className="text-lg" />
            <span>WordPress</span>
          </Link>
          <Link
            to="/admin/addons"
            className="flex items-center gap-3 hover:text-primary p-3 rounded-lg hover:bg-blue-700 transition-colors duration-200"
            onClick={closeSidebar}>
            <FaPuzzlePiece className="text-lg" />
            <span>Addons</span>
          </Link>
        </nav>
      </aside>
    </div>
  )
}

export default AdminDashboard
