const express = require('express')
const { authMiddleware } = require('../middlewares/auth')
const { checkRoles } = require('../middlewares/roleMiddleware')
const adminController = require('../controllers/adminController')

const router = express.Router()

router.use(authMiddleware, checkRoles(['admin']))

// Users
router.get('/users', adminController.getUsers)
router.patch('/users/role', adminController.updateRole)

// Orders
router.get('/orders', adminController.listOrders);
router.get('/orders/:orderId', adminController.getOrder);
router.put('/orders/:orderId', adminController.updateOrder);

// Invoices
router.get('/invoices', adminController.listInvoices);
router.get('/invoices/:invoiceId', adminController.getInvoice);
router.put('/invoices/:invoiceId', adminController.updateInvoice);

// Hosting
router.post('/hosting', adminController.createHosting)
router.get('/hosting', adminController.getHosting)
router.get('/hosting/:id', adminController.getHostingById)
router.put('/hosting/:id', adminController.updateHosting)
router.delete('/hosting/:id', adminController.deleteHosting)

// Wordpress Hosting
router.post('/wordpress-hosting', adminController.createWordpressHosting)
router.get('/wordpress-hosting', adminController.getWordpressHosting)
router.get('/wordpress-hosting/:id', adminController.getWordpressHostingById)
router.put('/wordpress-hosting/:id', adminController.updateWordpressHosting)
router.delete('/wordpress-hosting/:id', adminController.deleteWordpressHosting)

// Addons
router.post('/addons', adminController.createAddon)
router.get('/addons', adminController.getAddons)
router.get('/addons/:id', adminController.getAddonById)
router.put('/addons/:id', adminController.updateAddon)
router.delete('/addons/:id', adminController.deleteAddon)

module.exports = router
