import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

const Login = () => {
  const [switchForm, setSwitchForm] = useState(true)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  })

  const [message, setMessage] = useState('')
  const navigate = useNavigate()
  const { login, register } = useAuth()

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const validateForm = () => {
    const { name, email, password } = formData
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    if (!emailRegex.test(email)) return 'Invalid email format'
    if (!switchForm && (name.length < 5 || name.length > 15)) {
      return 'Name must be 5–15 characters long'
    }
    if (password.length < 6 || password.length > 12) {
      return 'Password must be 6–12 characters long'
    }
    return null
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage('')

    const validationError = validateForm()
    if (validationError) return setMessage(validationError)

    try {
      if (switchForm) {
        const response = await login({
          email: formData.email,
          password: formData.password,
        })
        if (response?.status === 200) {
          
          toast.success('Login successful')
          navigate('/')

        } else setMessage('Incorrect login credentials')
      } else {
        const response = await register({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        })
        if (response?.status === 201) {
          setMessage('User registered successfully')
          setSwitchForm(true)
        } else if (response?.status === 409) {
          setMessage('Email already exists')
        } else {
          setMessage('Registration failed. Try again.')
        }
      }
    } catch (err) {
      setMessage(err.message || 'Something went wrong')
    }
  }

  return (
    <div className="flex items-center justify-center my-20 bg-gradient-to-br from-blue to-primary">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        {switchForm ? (
          <form onSubmit={handleSubmit} className="space-y-5">
            <h1 className="text-4xl text-vivid_blue pb-3 font-bold text-center">
              Login
            </h1>

            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
            />

            {message && (
              <p className="text-sm text-red-600 text-center">{message}</p>
            )}

            <button
              type="submit"
              className="w-full py-3 bg-primary text-white font-semibold rounded-lg hover:bg-blue transition">
              Login
            </button>

            <p
              onClick={() => navigate('/forgot-password')}
              className="text-sm text-gray-600 text-center cursor-pointer hover:text-blue">
              Forgot Password?
            </p>

            <p className="text-sm text-gray-600 text-center">
              Don’t have an account?{' '}
              <span
                onClick={() => setSwitchForm(false)}
                className="text-primary font-medium cursor-pointer hover:underline">
                Register
              </span>
            </p>
          </form>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <h1 className="text-4xl text-vivid_blue pb-3 font-bold text-center">
              Register
            </h1>

            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
            />

            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
            />

            {message && (
              <p className="text-sm text-red-600 text-center">{message}</p>
            )}

            <button
              type="submit"
              className="w-full py-3 bg-primary text-white font-semibold rounded-lg hover:bg-blue transition">
              Register
            </button>

            <p className="text-sm text-gray-600 text-center">
              Already have an account?{' '}
              <span
                onClick={() => setSwitchForm(true)}
                className="text-primary font-medium cursor-pointer hover:underline">
                Login
              </span>
            </p>
          </form>
        )}
      </div>
    </div>
  )
}

export default Login
