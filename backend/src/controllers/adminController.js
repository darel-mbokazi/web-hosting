const adminService = require('../services/adminService')

// ---------------- USERS ---------------- //
async function getUsers(req, res) {
  const users = await adminService.getAllUsers()
  res.json(users)
}

async function updateRole(req, res) {
  try {
    const { userId, role } = req.body
    const user = await adminService.updateUserRole(userId, role)
    res.json(user)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
}

// ---------------- ORDERS ---------------- //
async function listOrders(req, res) {
  const orders = await adminService.getAllOrders();
  res.json(orders);
}

async function getOrder(req, res) {
  try {
    const order = await adminService.getOrderById(req.params.orderId);
    res.json(order);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
}

async function updateOrder(req, res) {
  try {
    const { status } = req.body;
    const order = await adminService.updateOrderStatus(req.params.orderId, status);
    res.json(order);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

async function listInvoices(req, res) {
  const invoices = await adminService.getAllInvoices();
  res.json(invoices);
}

async function getInvoice(req, res) {
  try {
    const invoice = await adminService.getInvoiceById(req.params.invoiceId);
    res.json(invoice);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
}

async function updateInvoice(req, res) {
  try {
    const { status } = req.body;
    const invoice = await adminService.updateInvoiceStatus(req.params.invoiceId, status);
    res.json(invoice);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

// ---------------- HOSTING ---------------- //
async function createHosting(req, res) {
  const plan = await adminService.createHostingPlan(req.body)
  res.status(201).json(plan)
}

async function updateHosting(req, res) {
  const { id } = req.params
  const plan = await adminService.updateHostingPlan(id, req.body)
  res.json(plan)
}

async function deleteHosting(req, res) {
  const { id } = req.params
  await adminService.deleteHostingPlan(id)
  res.json({ success: true })
}

async function getHosting(req, res) {
  const plans = await adminService.getHostingPlans()
  res.json(plans)
}

async function getHostingById(req, res) {
  const { id } = req.params
  const plan = await adminService.getHostingPlanById(id)
  if (!plan) return res.status(404).json({ error: 'Not found' })
  res.json(plan)
}

// ---------------- WORDPRESS HOSTING ---------------- //
async function createWordpressHosting(req, res) {
  const plan = await adminService.createWordpressHostingPlan(req.body)
  res.status(201).json(plan)
}
async function updateWordpressHosting(req, res) {
  const { id } = req.params
  const plan = await adminService.updateWordpressHostingPlan(id, req.body)
  res.json(plan)
}
async function deleteWordpressHosting(req, res) {
  const { id } = req.params
  await adminService.deleteWordpressHostingPlan(id)
  res.json({ success: true })
}
async function getWordpressHosting(req, res) {
  const plans = await adminService.getWordpressHostingPlans()
  res.json(plans)
}
async function getWordpressHostingById(req, res) {
  const { id } = req.params
  const plan = await adminService.getWordpressHostingPlanById(id)
  if (!plan) return res.status(404).json({ error: 'Not found' })
  res.json(plan)
}

// ---------------- ADDONS ---------------- //
async function createAddon(req, res) {
  const addon = await adminService.createAddon(req.body)
  res.status(201).json(addon)
}

async function updateAddon(req, res) {
  const { id } = req.params
  const addon = await adminService.updateAddon(id, req.body)
  res.json(addon)
}

async function deleteAddon(req, res) {
  const { id } = req.params
  await adminService.deleteAddon(id)
  res.json({ success: true })
}

async function getAddons(req, res) {
  const addons = await adminService.getAddons()
  res.json(addons)
}

async function getAddonById(req, res) {
  const { id } = req.params
  const addon = await adminService.getAddonById(id)
  if (!addon) return res.status(404).json({ error: 'Not found' })
  res.json(addon)
}

module.exports = {
  // users
  getUsers,
  updateRole,

  // orders
  listOrders,
  getOrder,
  updateOrder,
  listInvoices,
  getInvoice,
  updateInvoice,

  // hosting
  createHosting,
  updateHosting,
  deleteHosting,
  getHosting,
  getHostingById,

  // wordpress hosting
  createWordpressHosting,
  updateWordpressHosting,
  deleteWordpressHosting,
  getWordpressHosting,
  getWordpressHostingById,
  
  // addons
  createAddon,
  updateAddon,
  deleteAddon,
  getAddons,
  getAddonById,
}
