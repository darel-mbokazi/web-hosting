const express = require('express')
const { authMiddleware } = require('../middlewares/auth')
const userController = require('../controllers/userController')

const router = express.Router()

router.get('/orders', authMiddleware, userController.listOrders)
router.get('/orders/:orderId', authMiddleware, userController.getOrder)

module.exports = router
