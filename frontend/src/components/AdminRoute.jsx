import React from "react"
import { Navigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth()

  if (loading) return <p className="text-center mt-10">Loading...</p>

  if (!user || user.role !== "admin") {
    return <Navigate to="/" replace />
  }

  return children
}

export default AdminRoute
