const Order = require('../models/Order')

async function getUserOrders(userId) {
  return await Order.find({ userId }).sort({ createdAt: -1 }) 
}

async function getOrderById(orderId, userId) {
  return await Order.findOne({ _id: orderId, userId })
}

module.exports = { getUserOrders, getOrderById }
