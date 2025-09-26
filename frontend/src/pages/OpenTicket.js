import { useState } from 'react'
import axios from 'axios'
import { API_URL } from '../config'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

const OpenTicket = () => {
  const { token } = useAuth()
  const [subject, setSubject] = useState('')
  const [department, setDepartment] = useState('general')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(null)
  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      await axios.post(
        `${API_URL}/tickets`,
        { subject, department, message },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      toast.success('Ticket submitted successfully')
      setSubject('')
      setDepartment('general')
      setMessage('')
    } catch (err) {
      console.error('Reply error:', err.response || err)
      toast.error('Failed to submit ticket')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-primary py-8 mt-16 pb-60 px-4 sm:px-6">
      <div className="max-w-2xl mx-auto bg-gray-50 p-6 rounded-xl shadow-md">
        <h1 className="text-4xl text-vivid_blue font-bold text-center mb-4">
          Open Ticket
        </h1>
        <p className="text-center text-gray-600 mb-6">
          Please check our knowledgebase first. If you can’t find a solution,
          you can submit a ticket to the appropriate department below.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 font-medium">Subject</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Enter subject"
              required
              className="w-full border rounded-lg px-3 py-2"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Department</label>
            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="w-full border rounded-lg px-3 py-2">
              <option value="general">General</option>
              <option value="account">Account</option>
              <option value="sales">Sales</option>
              <option value="support">Support</option>
            </select>
          </div>

          <div>
            <label className="block mb-1 font-medium">Message</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message here"
              required
              rows="5"
              className="w-full border rounded-lg px-3 py-2"
            />
          </div>
          {success && (
            <p className="text-green-600 text-center mb-4">{success}</p>
          )}
          {error && <p className="text-red-600 text-center mb-4">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="block mx-auto px-6 py-2 bg-blue-600 text-white font-medium rounded-full hover:bg-blue-700 disabled:opacity-50">
            {loading ? 'Submitting...' : 'Submit'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default OpenTicket
