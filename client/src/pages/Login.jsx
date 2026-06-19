import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import axios from '../api/axios'

import { useAuth } from '../context/AuthContext'

const Login = () => {
  const navigate = useNavigate()
  const { login, user } = useAuth()   // This is the key for calling login function in useAuth and set the userdata and Token 
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // If already logged in, redirect away from login page
  useEffect(() => {
    if (user) {
      if (user.role === 'vendor') {
        navigate('/vendor/dashboard')
      } else {
        navigate('/marketplace')
      }
    }
  }, [user])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await axios.post('/api/auth/login', formData)
      login(res.data.user, res.data.token)
      toast.success('Login successful')
      if (res.data.user.role === 'vendor') {
        navigate('/vendor/dashboard')
      } else {
        navigate('/marketplace')
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }



  const loginAsDemo = async (type) => {
    try {
      setLoading(true)

      const credentials =
        type === 'vendor'
          ? {
            email: 'sheetal@gmail.com',
            password: 'sheetal'
          }
          : {
            email: 'gudu@gmail.com',
            password: 'gudu'
          }

      const res = await axios.post('/api/auth/login', credentials)

      login(res.data.user, res.data.token)

      toast.success(
        `Logged in as ${type === 'vendor' ? 'Vendor' : 'Customer'}`
      )

      if (res.data.user.role === 'vendor') {
        navigate('/vendor/dashboard')
      } else {
        navigate('/marketplace')
      }
    } catch (err) {
      toast.error('Demo login failed')
    } finally {
      setLoading(false)
    }
  }
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-blue-600 mb-6">
          Welcome Back
        </h2>

        {error && (
          <div className="bg-red-100 text-red-600 p-3 rounded mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              autoComplete="current-password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>

          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-3 text-gray-500">
              Continue as Guest
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => loginAsDemo('customer')}
            disabled={loading}
            className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700 hover:bg-green-100 transition cursor-pointer disabled:cursor-not-allowed"
          >
            Customer Demo
          </button>

          <button
            onClick={() => loginAsDemo('vendor')}
            disabled={loading}
            className="rounded-lg border border-purple-200 bg-purple-50 px-4 py-3 text-sm font-medium text-purple-700 hover:bg-purple-100 transition cursor-pointer disabled:cursor-not-allowed"
          >
            Vendor Demo
          </button>
        </div>

        <p className="text-center text-sm text-gray-600 mt-6">
          Don't have an account?{' '}
          <Link
            to="/signup"
            className="text-blue-600 hover:underline"
          >
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Login
