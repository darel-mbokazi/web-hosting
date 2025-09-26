const Ticket = require('../models/Ticket')

// for support/admin only //

async function getAllTickets() {
  return Ticket.find().populate('userId', 'email name')
}


async function getOpenTickets() {
  return Ticket.find({ status: 'open' }).populate('userId', 'email name')
}

async function replyToTicket(ticketId, senderId, message) {
  const ticket = await Ticket.findById(ticketId)
  if (!ticket) throw new Error('Ticket not found')

  ticket.messages.push({
    sender: 'support',
    message,
  })

  // Move ticket to pending state
  ticket.status = 'pending'
  return ticket.save()
}

// close a ticket
async function resolveTicket(ticketId) {
  const ticket = await Ticket.findByIdAndUpdate(
    ticketId,
    { status: 'closed' },
    { new: true }
  )
  if (!ticket) throw new Error('Ticket not found')
  return ticket
}
async function getUnresolvedTickets() {
  return Ticket.find({ status: { $ne: 'closed' } }).populate('userId', 'email name')
}

module.exports = { getAllTickets, getOpenTickets, replyToTicket, resolveTicket, getUnresolvedTickets }
