import React, { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'
import { API_URL } from '../config'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(localStorage.getItem('token') || null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProfile = async () => {
      if (!token) {
        setLoading(false)
        return
      }

      try {
        const res = await axios.get(`${API_URL}/auth/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        setUser(res.data)
      } catch (err) {
        console.error('Failed to fetch profile:', err)
        logout()
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [token])

  const updateUser = (updatedUserData) => {
    setUser((prevUser) => ({ ...prevUser, ...updatedUserData }))
    localStorage.setItem(
      'user',
      JSON.stringify({ ...user, ...updatedUserData })
    )
  }

  const register = async (data) => {
    try {
      const res = await axios.post(`${API_URL}/auth/register`, data)
      return { status: res.status, data: res.data }
    } catch (err) {
      if (err.response) {
        return { status: err.response.status, data: err.response.data }
      }
      throw err
    }
  }

  const login = async (data) => {
    try {
      const res = await axios.post(`${API_URL}/auth/login`, data)

      if (res.status === 200) {
        setToken(res.data.token)
        localStorage.setItem('token', res.data.token)
        localStorage.setItem('user', JSON.stringify(res.data.user))
        setUser(res.data.user)
      }

      return { status: res.status, data: res.data }
    } catch (err) {
      if (err.response) {
        return { status: err.response.status, data: err.response.data }
      }
      throw err
    }
  }

  const logout = () => {
    setToken(null)
    setUser(null)
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        register,
        logout,
        loading,
        updateUser,
      }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
