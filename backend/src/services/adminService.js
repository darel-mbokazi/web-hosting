const User = require('../models/User')
const HostingPlan = require('../models/HostingPlan')
const Addon = require('../models/Addon')
const Order = require('../models/Order')
const Invoice = require('../models/Invoice')
const WordpressHosting = require('../models/WordpressHosting')

// ---------------- USER MANAGEMENT ---------------- //
async function getAllUsers() {
  return User.find().select('-passwordHash')
}

async function updateUserRole(userId, role) {
  if (!['customer', 'support', 'admin'].includes(role)) {
    throw new Error('Invalid role')
  }
  return User.findByIdAndUpdate(userId, { role }, { new: true })
}

// ---------------- ORDER ---------------- //

async function getAllOrders() {
  return await Order.find().populate('userId', 'email name')
}

async function getOrderById(orderId) {
  return await Order.findById(orderId).populate('userId', 'email name')
}

async function updateOrderStatus(orderId, status) {
  const order = await Order.findById(orderId)
  if (!order) throw new Error('Order not found')
  order.status = status
  await order.save()

  // update the corresponding invoice
  if (status === 'paid') {
    await Invoice.findOneAndUpdate(
      { orderId: orderId },
      { status: 'paid' },
      { new: true }
    )
  } else if (status === 'cancelled') {
    await Invoice.findOneAndUpdate(
      { orderId: orderId },
      { status: 'unpaid' }, 
      { new: true }
    )
  }

  return order
}

// ---------------- INVOICES ---------------- //

async function getAllInvoices() {
  return await Invoice.find().populate('userId', 'email name')
}

async function getInvoiceById(invoiceId) {
  return await Invoice.findById(invoiceId).populate('userId', 'email name')
}

async function updateInvoiceStatus(invoiceId, status) {
  const invoice = await Invoice.findById(invoiceId)
  if (!invoice) throw new Error('Invoice not found')
  invoice.status = status
  await invoice.save()

  if (status === 'paid') {
    await Order.findByIdAndUpdate(invoice.orderId, { status: 'paid' })
  } else if (status === 'unpaid') {
    // change order status back to pending if it was previously paid
    const order = await Order.findById(invoice.orderId)
    if (order.status === 'paid') {
      await Order.findByIdAndUpdate(invoice.orderId, { status: 'pending' })
    }
  }

  return invoice
}


// ---------------- HOSTING PLAN MANAGEMENT ---------------- //
async function createHostingPlan(data) {
  return HostingPlan.create(data)
}

async function updateHostingPlan(id, data) {
  return HostingPlan.findByIdAndUpdate(id, data, { new: true })
}

async function deleteHostingPlan(id) {
  return HostingPlan.findByIdAndDelete(id)
}

async function getHostingPlans() {
  return HostingPlan.find()
}

async function getHostingPlanById(id) {
  return HostingPlan.findById(id)
}

// ---------------- Webpress HOSTING PLAN MANAGEMENT ---------------- //
async function createWordpressHostingPlan(data) {
  return WordpressHosting.create(data)
}
async function updateWordpressHostingPlan(id, data) {
  return WordpressHosting.findByIdAndUpdate(id, data, { new: true })
}
async function deleteWordpressHostingPlan(id) {
  return WordpressHosting.findByIdAndDelete(id)
}
async function getWordpressHostingPlans() {
  return WordpressHosting.find()
}
async function getWordpressHostingPlanById(id) {
  return WordpressHosting.findById(id)
} 

// ---------------- ADD-ON MANAGEMENT ---------------- //
async function createAddon(data) {
  return Addon.create(data)
}

async function updateAddon(id, data) {
  return Addon.findByIdAndUpdate(id, data, { new: true })
}

async function deleteAddon(id) {
  return Addon.findByIdAndDelete(id)
}

async function getAddons() {
  return Addon.find()
}

async function getAddonById(id) {
  return Addon.findById(id)
}

module.exports = {
  // users
  getAllUsers,
  updateUserRole,

  // orders
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  getAllInvoices,
  getInvoiceById,
  updateInvoiceStatus,

  // hosting
  createHostingPlan,
  updateHostingPlan,
  deleteHostingPlan,
  getHostingPlans,
  getHostingPlanById,

  // wordpress hosting
  createWordpressHostingPlan,
  updateWordpressHostingPlan,
  deleteWordpressHostingPlan,
  getWordpressHostingPlans,
  getWordpressHostingPlanById,
  
  // addons
  createAddon,
  updateAddon,
  deleteAddon,
  getAddons,
  getAddonById,
}
