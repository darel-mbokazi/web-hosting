const Ticket = require('../models/Ticket')

async function openTicket(req, res) {
  const { subject, department, message } = req.body
  if (!subject || !message)
    return res.status(400).json({ error: 'subject and message required' })
  const ticket = await Ticket.create({
    userId: req.user._id,
    subject,
    department: department || 'general',
    messages: [{ sender: 'user', message }],
  })
  res.status(201).json(ticket)
}

async function listUserTickets(req, res) {
  const tickets = await Ticket.find({ userId: req.user._id }).sort('-createdAt')
  res.json(tickets)
}

async function addMessage(req, res) {
  const { id } = req.params 
  const { message } = req.body
  if (!message) return res.status(400).json({ error: 'message required' })

  const ticket = await Ticket.findById(id)
  if (!ticket) return res.status(404).json({ error: 'Ticket not found' })
  if (
    !ticket.userId.equals(req.user._id) &&
    req.user.role !== 'support' &&
    req.user.role !== 'admin'
  ) {
    return res.status(403).json({ error: 'Forbidden' })
  }

  ticket.messages.push({
    sender: req.user.role === 'support' ? 'support' : 'user',
    message,
  })
  await ticket.save()
  res.json(ticket)
}

module.exports = { openTicket, listUserTickets, addMessage }
