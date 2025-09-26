const userService = require('../services/userService')

async function listOrders(req, res) {
  try {
    const orders = await userService.getUserOrders(req.user._id)
    res.json(orders)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch orders' })
  }
}

async function getOrder(req, res) {
  try {
    const { orderId } = req.params
    const order = await userService.getOrderById(orderId, req.user._id)

    if (!order) {
      return res.status(404).json({ error: 'Order not found' })
    }

    res.json(order)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch order' })
  }
}

module.exports = { listOrders, getOrder }
