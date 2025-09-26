const {
  getOpenTickets,
  replyToTicket,
  resolveTicket,
  getUnresolvedTickets,
  getAllTickets
} = require('../services/supportService')

async function getAllTicketsController(req, res, next) {
  try {
    const tickets = await getAllTickets()
    res.json(tickets)
  } catch (err) {
    console.error('Error fetching all tickets:', err.message)
    next(err) 
  }
}


async function getOpenTicketsController(req, res) {
  const tickets = await getOpenTickets()
  res.json(tickets)
}

async function replyToTicketController(req, res) {
  try {
    const { ticketId, message } = req.body
    const ticket = await replyToTicket(ticketId, req.user._id, message)
    res.json(ticket)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
}


async function resolveTicketController(req, res, next) {
  try {
    const { id } = req.params
    const ticket = await resolveTicket(id) 

    res.json({ message: 'Ticket resolved successfully', ticket })
  } catch (err) {
    next(err)
  }
}

async function getUnresolvedTicketController(req, res, next) {
  try {
    const tickets = await getUnresolvedTickets() 
    res.json(tickets)
  } catch (err) {
    next(err)
  }
}

module.exports = {
  getAllTickets: getAllTicketsController,
  getOpenTickets: getOpenTicketsController,
  replyToTicket: replyToTicketController,
  resolveTicket: resolveTicketController,
  getUnresolvedTickets: getUnresolvedTicketController,
}
