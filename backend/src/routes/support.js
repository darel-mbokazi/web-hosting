const express = require('express')
const { authMiddleware } = require('../middlewares/auth')
const { checkRoles } = require('../middlewares/roleMiddleware')
const supportController = require('../controllers/supportController')

const router = express.Router()

router.use(authMiddleware, checkRoles(['support']))

router.get('/tickets', supportController.getAllTickets)
router.get('/tickets/mine', supportController.getOpenTickets)
router.get('/tickets/unresolved', supportController.getUnresolvedTickets)
router.post('/tickets/reply', supportController.replyToTicket)
router.post('/tickets/:id/resolve', supportController.resolveTicket)

module.exports = router
