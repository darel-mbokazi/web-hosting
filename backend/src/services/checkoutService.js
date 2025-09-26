const Cart = require('../models/Cart')
const Order = require('../models/Order')
const Invoice = require('../models/Invoice')
const Domain = require('../models/Domain')
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

async function checkout(userId) {
  const cart = await Cart.findOne({ userId })
  if (!cart || cart.items.length === 0) throw new Error('Cart is empty')

  // Create order
  const order = await Order.create({
    userId,
    items: cart.items,
    total: cart.total,
    status: 'pending',
  })

  // Create invoice
  const invoice = await Invoice.create({
    orderId: order._id,
    userId,
    amount: cart.total,
    status: 'unpaid',
  })

  // Update domains in cart from pending → registered
  for (const item of cart.items) {
    if (item.itemType === 'domain') {
      await Domain.findByIdAndUpdate(item.itemId, {
        status: 'registered',
        userId,
      })
    }
  }

  // Clear the cart
  await Cart.findOneAndUpdate({ userId }, { items: [], total: 0 })

  return { order, invoice }
}

async function createStripeCheckoutSession(invoiceId, userId) {
  const invoice = await Invoice.findById(invoiceId).populate('orderId')
  if (!invoice) throw new Error('Invoice not found')

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: 'zar',
          product_data: {
            name: `Order #${invoice.orderId._id}`,
            description: `Invoice ${invoiceId}`,
          },
          unit_amount: Math.round(invoice.amount * 100), // Convert to cents
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: `${process.env.FRONTEND_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}&invoice_id=${invoiceId}`,
    cancel_url: `${process.env.FRONTEND_URL}/checkout`,
    client_reference_id: invoiceId.toString(),
    metadata: {
      invoiceId: invoiceId.toString(),
      userId: userId.toString(),
    },
  })

  return {
    sessionId: session.id,
    url: session.url,
  }
}

async function handleStripeWebhook(req) {
  const sig = req.headers['stripe-signature']
  let event

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    )
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message)
    throw new Error(`Webhook Error: ${err.message}`)
  }

  console.log('Stripe webhook received:', event.type)

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object
      await handleSuccessfulPayment(session)
      break
    case 'checkout.session.expired':
      console.log('Checkout session expired:', event.data.object.id)
      break
    default:
      console.log(`Unhandled event type: ${event.type}`)
  }

  return { received: true }
}

async function handleSuccessfulPayment(session) {
  const { invoiceId, userId } = session.metadata

  if (!invoiceId) {
    console.error('No invoiceId in session metadata')
    return
  }

  try {
    // Update invoice status
    const invoice = await Invoice.findByIdAndUpdate(
      invoiceId,
      {
        status: 'paid',
        paidAt: new Date(),
      },
      { new: true }
    )

    if (!invoice) {
      console.error('Invoice not found:', invoiceId)
      return
    }

    // Update order status
    await Order.findByIdAndUpdate(
      invoice.orderId,
      { status: 'paid' },
      { new: true }
    )

    console.log(`Payment successful for invoice ${invoiceId}`)
  } catch (error) {
    console.error('Error updating payment status:', error)
  }
}

async function getCheckoutSession(sessionId) {
  const session = await stripe.checkout.sessions.retrieve(sessionId)
  return session
}

async function verifyPaymentStatus(invoiceId) {
  const invoice = await Invoice.findById(invoiceId)
  if (!invoice) throw new Error('Invoice not found')

  return {
    status: invoice.status,
    paid: invoice.status === 'paid',
    invoice: invoice.toObject(),
  }
}

module.exports = {
  checkout,
  createStripeCheckoutSession,
  handleStripeWebhook,
  getCheckoutSession,
  verifyPaymentStatus,
}
