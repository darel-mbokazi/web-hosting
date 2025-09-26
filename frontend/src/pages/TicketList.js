import { useEffect, useState } from 'react'
import axios from 'axios'
import { API_URL } from '../config'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'
import {
  FaHeadset,
  FaEnvelope,
  FaUser,
  FaTag,
  FaClock,
  FaPaperPlane,
  FaSearch,
} from 'react-icons/fa'

const TicketList = () => {
  const { token } = useAuth()
  const [tickets, setTickets] = useState([])
  const [selectedTicket, setSelectedTicket] = useState(null)
  const [reply, setReply] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const res = await axios.get(`${API_URL}/tickets`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        setTickets(res.data || [])
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to load tickets')
      }
    }
    fetchTickets()
  }, [token])

  const handleReply = async (e) => {
    e.preventDefault()
    if (!reply.trim() || !selectedTicket) return

    setLoading(true)
    setError(null)

    try {
      const res = await axios.post(
        `${API_URL}/tickets/${selectedTicket._id}/message`,
        {
          ticketId: selectedTicket._id,
          message: reply,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      )

      setSelectedTicket(res.data)
      setReply('')
      toast.success('Message sent successfully')
    } catch (err) {
      console.error('Reply error:', err.response || err)
      toast.error(err.response?.data?.error || 'Failed to send message')
    } finally {
      setLoading(false)
    }
  }

  const filteredTickets = tickets.filter(
    (ticket) =>
      ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.department.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-primary py-8 mt-16 mb-40 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-center gap-3 mb-16">
          <FaHeadset className="text-4xl text-vivid_blue" />
          <h1 className="text-3xl sm:text-4xl font-bold text-vivid_blue text-center">
            My Support Tickets
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Tickets List */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md border border-gray-200 p-4 mb-4">
              <div className="flex items-center gap-2 mb-3">
                <FaSearch className="text-gray-400" />
                <input
                  type="text"
                  placeholder="Search tickets..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1 border-none outline-none text-sm"
                />
              </div>
              <div className="flex justify-between items-center text-sm text-gray-600">
                <span>{filteredTickets.length} tickets</span>
                <span className="text-vivid_blue font-semibold">
                  {tickets.filter((t) => t.status !== 'closed').length} active
                </span>
              </div>
            </div>

            <div className="space-y-3 max-h-96 overflow-y-auto">
              {filteredTickets.length === 0 ? (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
                  <FaEnvelope className="text-3xl text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">No tickets found</p>
                </div>
              ) : (
                filteredTickets.map((ticket) => (
                  <div
                    key={ticket._id}
                    onClick={() => setSelectedTicket(ticket)}
                    className={`bg-white rounded-lg shadow-sm border cursor-pointer transition-all duration-200 hover:shadow-md p-4 ${
                      selectedTicket?._id === ticket._id
                        ? 'border-vivid_blue ring-2 ring-blue-100'
                        : 'border-gray-200'
                    }`}>
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-gray-800 text-sm line-clamp-1">
                        {ticket.subject}
                      </h3>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          ticket.status === 'closed'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                        {ticket.status}
                      </span>
                    </div>

                    <div className="space-y-1 text-xs text-gray-600">
                      <div className="flex items-center gap-1">
                        <FaTag className="text-gray-400" />
                        <span>{ticket.department}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <FaClock className="text-gray-400" />
                        <span>
                          {new Date(ticket.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    <div className="mt-2 text-xs text-gray-500">
                      {ticket.messages?.length || 0} messages
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Ticket Details */}
          <div className="lg:col-span-2">
            {selectedTicket ? (
              <div className="bg-white rounded-lg shadow-md border border-gray-200 h-full flex flex-col">
                {/* Ticket Header */}
                <div className="p-6 border-b border-gray-200">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-800 mb-1">
                        {selectedTicket.subject}
                      </h2>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <FaTag className="text-gray-400" />
                          {selectedTicket.department}
                        </span>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            selectedTicket.status === 'closed'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                          {selectedTicket.status}
                        </span>
                      </div>
                    </div>
                    <div className="text-sm text-gray-500">
                      <FaClock className="inline mr-1" />
                      {new Date(selectedTicket.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 p-6 overflow-y-auto max-h-96">
                  <div className="space-y-4">
                    {selectedTicket.messages?.map((msg, idx) => (
                      <div
                        key={idx}
                        className={`p-4 rounded-lg border-l-4 ${
                          msg.sender === 'support'
                            ? 'bg-blue-50 border-blue-400'
                            : 'bg-gray-50 border-gray-400'
                        }`}>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <FaUser
                              className={`text-sm ${
                                msg.sender === 'support'
                                  ? 'text-blue-600'
                                  : 'text-gray-600'
                              }`}
                            />
                            <span
                              className={`font-semibold text-sm ${
                                msg.sender === 'support'
                                  ? 'text-blue-700'
                                  : 'text-gray-700'
                              }`}>
                              {msg.sender === 'support'
                                ? 'Support Team'
                                : 'You'}
                            </span>
                          </div>
                          <span className="text-xs text-gray-500">
                            {new Date(msg.createdAt).toLocaleString()}
                          </span>
                        </div>
                        <p className="text-gray-700 text-sm">{msg.message}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Reply Form */}
                {selectedTicket.status !== 'closed' && (
                  <div className="p-6 border-t border-gray-200">
                    <form onSubmit={handleReply} className="space-y-3">
                      <textarea
                        value={reply}
                        onChange={(e) => setReply(e.target.value)}
                        placeholder="Type your reply..."
                        rows="3"
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-vivid_blue focus:border-transparent"
                        required
                      />
                      {error && <p className="text-red-600 text-sm">{error}</p>}
                      <button
                        type="submit"
                        disabled={loading}
                        className="flex items-center gap-2 px-6 py-2 bg-vivid_blue text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors">
                        <FaPaperPlane />
                        {loading ? 'Sending...' : 'Send Reply'}
                      </button>
                    </form>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-md border border-gray-200 p-8 text-center h-full flex items-center justify-center">
                <div>
                  <FaEnvelope className="text-4xl text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-600 mb-2">
                    Select a Ticket
                  </h3>
                  <p className="text-gray-500">
                    Choose a ticket from the list to view the conversation
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default TicketList
