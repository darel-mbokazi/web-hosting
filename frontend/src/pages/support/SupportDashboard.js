import { useEffect, useState } from 'react'
import axios from 'axios'
import { API_URL } from '../../config'
import { useAuth } from '../../context/AuthContext'
import toast from 'react-hot-toast'
import {
  FaHeadset,
  FaFilter,
  FaReply,
  FaCheckCircle,
  FaEnvelope,
  FaUser,
  FaTag,
  FaClock,
} from 'react-icons/fa'

const SupportDashboard = () => {
  const { token } = useAuth()
  const [tickets, setTickets] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [replyMessage, setReplyMessage] = useState({})
  const [filter, setFilter] = useState('all')

  const fetchTickets = async () => {
    try {
      let endpoint = '/support/tickets'
      if (filter === 'unresolved') endpoint = '/support/tickets/unresolved'

      const res = await axios.get(`${API_URL}${endpoint}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setTickets(res.data)
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load tickets')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        let endpoint = '/support/tickets'
        if (filter === 'unresolved') endpoint = '/support/tickets/unresolved'

        const res = await axios.get(`${API_URL}${endpoint}`, {
          headers: { Authorization: `Bearer ${token}` },
        })

        setTickets(res.data)
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to load tickets')
      } finally {
        setLoading(false)
      }
    }
    if (token) fetchData()
  }, [token, filter])

  const handleReply = async (ticketId) => {
    if (!replyMessage[ticketId]) return
    try {
      const res = await axios.post(
        `${API_URL}/support/tickets/reply`,
        { ticketId, message: replyMessage[ticketId] },
        { headers: { Authorization: `Bearer ${token}` } }
      )

      if (res.status >= 200 && res.status < 300) {
        setReplyMessage({ ...replyMessage, [ticketId]: '' })
        fetchTickets()
      }

      toast.success('Reply sent successfully')
    } catch (err) {
      console.error('Reply error:', err.response || err)
      toast.error('Failed to send reply')
    }
  }

  const handleResolve = async (ticketId) => {
    try {
      await axios.post(
        `${API_URL}/support/tickets/${ticketId}/resolve`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      )
      fetchTickets()

      toast.success('The ticket is successfully closed')
    } catch (err) {
      console.error('Reply error:', err.response || err)
      toast.error('Failed to resolve ticket')
    }
  }

  if (loading)
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-vivid_blue mx-auto"></div>
          <span className="ml-4 text-lg text-text">Loading tickets...</span>
        </div>
      </div>
    )

  if (error)
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-red-600 text-lg bg-white p-6 rounded-lg shadow-md">
          {error}
        </p>
      </div>
    )

  return (
    <div className="min-h-screen bg-primary mt-16 pb-60 sm:p-6">
      <div className="max-w-6xl mx-auto mb-16">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex justify-between place-content-center mb-5 gap-3">
            <FaHeadset className="text-3xl text-vivid_blue" />
            <h1 className="text-2xl sm:text-3xl font-bold text-vivid_blue">
              Support Dashboard
            </h1>
          </div>
        </div>

        {/* Filter Section */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6 border border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <FaFilter className="text-gray-400" />
            <h2 className="text-lg font-semibold text-gray-700">
              Filter Tickets
            </h2>
          </div>
          <div className="flex gap-2">
            {['all', 'unresolved'].map((option) => (
              <button
                key={option}
                onClick={() => setFilter(option)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  filter === option
                    ? 'bg-vivid_blue text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}>
                {option.charAt(0).toUpperCase() + option.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {tickets.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center border border-gray-200">
            <FaEnvelope className="text-4xl text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-text mb-2">
              No tickets found
            </h3>
            <p className="text-gray-500">
              There are no tickets matching your current filter.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {tickets.map((ticket) => (
              <div
                key={ticket._id}
                className="bg-white rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow duration-300">
                {/* Ticket Header */}
                <div className="p-6 border-b border-gray-200">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3">
                    <div>
                      <h2 className="text-lg font-semibold text-vivid_blue mb-1">
                        {ticket.subject}
                      </h2>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-text">
                        <span className="flex items-center gap-1">
                          <FaTag className="text-gray-400" />
                          {ticket.department}
                        </span>
                        <span
                          className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${
                            ticket.status === 'closed'
                              ? 'bg-red-300 text-red-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                          {ticket.status}
                        </span>
                      </div>
                    </div>
                    <div className="mt-2 flex justify-normal place-items-center sm:mt-0 text-sm text-gray-500">
                      <FaClock className="inline text-vivid_blue mr-1" />
                      {new Date(ticket.createdAt).toLocaleDateString()}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-text">
                    <FaUser className="text-gray-400" />
                    <span>
                      {ticket.userId?.name} ({ticket.userId?.email})
                    </span>
                  </div>
                </div>

                {/* Messages */}
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-sm font-semibold text-gray-700 mb-3">
                    Conversation
                  </h3>
                  <div className="space-y-3">
                    {ticket.messages.map((msg) => (
                      <div
                        key={msg._id}
                        className={`p-3 rounded-lg border-l-4 ${
                          msg.sender === 'support'
                            ? 'bg-blue-50 border-vivid_blue'
                            : 'bg-gray-50 border-primary'
                        }`}>
                        <div className="flex items-center justify-between mb-1">
                          <strong
                            className={`text-sm ${
                              msg.sender === 'support'
                                ? 'text-vivid_blue'
                                : 'text-text'
                            }`}>
                            {msg.sender === 'support'
                              ? 'Support Team'
                              : ticket.userId?.name}
                          </strong>
                          <span className="text-xs text-text">
                            {new Date(msg.createdAt).toLocaleString()}
                          </span>
                        </div>
                        <p className="text-sm text-text">{msg.message}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="p-6">
                  <div className="flex flex-col sm:flex-row gap-3">
                    <input
                      type="text"
                      placeholder="Type your reply..."
                      value={replyMessage[ticket._id] || ''}
                      onChange={(e) =>
                        setReplyMessage({
                          ...replyMessage,
                          [ticket._id]: e.target.value,
                        })
                      }
                      className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-vivid_blue focus:border-transparent"
                      disabled={ticket.status === 'closed'}
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleReply(ticket._id)}
                        disabled={
                          ticket.status === 'closed' ||
                          !replyMessage[ticket._id]
                        }
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-white transition-colors ${
                          ticket.status === 'closed' ||
                          !replyMessage[ticket._id]
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'bg-blue-600 hover:bg-blue-700'
                        }`}>
                        <FaReply />
                        Reply
                      </button>

                      <button
                        onClick={() => handleResolve(ticket._id)}
                        disabled={ticket.status === 'closed'}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-white transition-colors ${
                          ticket.status === 'closed'
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'bg-green-600 hover:bg-green-700'
                        }`}>
                        <FaCheckCircle />
                        Resolve
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default SupportDashboard
