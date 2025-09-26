const express = require('express')
const checkoutController = require('../controllers/checkoutController')
const { authMiddleware } = require('../middlewares/auth')

const router = express.Router()

router.post(
  '/webhook',
  express.raw({ type: 'application/json' }),
  checkoutController.handleWebhook
)

router.use(authMiddleware)

// Checkout
router.post('/', checkoutController.checkout)

// checkout session
router.post(
  '/create-checkout-session',
  checkoutController.createCheckoutSession
)

// session status
router.get('/session-status/:sessionId', checkoutController.getSessionStatus)

// Verify payment status
router.get('/verify-payment/:invoiceId', checkoutController.verifyPayment)

module.exports = router
