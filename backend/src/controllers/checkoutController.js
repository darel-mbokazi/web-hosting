const checkoutService = require('../services/checkoutService')

// Create order + invoice
async function checkout(req, res) {
  try {
    const result = await checkoutService.checkout(req.user._id)
    res.json(result)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
}

async function createCheckoutSession(req, res) {
  try {
    const { invoiceId } = req.body
    const result = await checkoutService.createStripeCheckoutSession(
      invoiceId,
      req.user._id
    )
    res.json(result)
  } catch (err) {
    console.error('Checkout session error:', err)
    res.status(400).json({ error: err.message })
  }
}

async function handleWebhook(req, res) {
  try {
    const result = await checkoutService.handleStripeWebhook(req)
    res.json(result)
  } catch (err) {
    console.error('Webhook error:', err)
    res.status(400).json({ error: err.message })
  }
}

async function getSessionStatus(req, res) {
  try {
    const { sessionId } = req.params
    const result = await checkoutService.getCheckoutSession(sessionId)
    res.json(result)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
}

async function verifyPayment(req, res) {
  try {
    const { invoiceId } = req.params
    const result = await checkoutService.verifyPaymentStatus(invoiceId)
    res.json(result)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
}

module.exports = {
  checkout,
  createCheckoutSession,
  handleWebhook,
  getSessionStatus,
  verifyPayment,
}
