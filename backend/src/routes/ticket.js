const express = require('express')
const router = express.Router()
const {
  openTicket,
  listUserTickets,
  addMessage,
} = require('../controllers/ticketController')
const { authMiddleware } = require('../middlewares/auth')

router.post('/', authMiddleware, openTicket)
router.get('/', authMiddleware, listUserTickets)
router.post('/:id/message', authMiddleware, addMessage)

module.exports = router
