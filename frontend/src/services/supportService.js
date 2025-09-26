import axios from 'axios'
import { API_URL } from '../config'


export const getOpenTickets = async (token) => {
  const res = await axios.get(`${API_URL}/support/tickets/open`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  return res.data
}

export const getUnresolvedTickets = async (token) => {
  const res = await axios.get(`${API_URL}/support/tickets/unresolved`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  return res.data
}

export const replyToTicket = async (ticketId, message, token) => {
  const res = await axios.post(
    `${API_URL}/support/tickets/reply`,
    { ticketId, message },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  )
  return res.data
}

export const resolveTicket = async (id, token) => {
  const res = await axios.patch(
    `${API_URL}/support/tickets/${id}/resolve`,
    {},
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  )
  return res.data
}
