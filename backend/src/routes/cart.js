const express = require('express')
const cartController = require('../controllers/cartController')
const { authMiddleware } = require('../middlewares/auth')

const router = express.Router()

router.use(authMiddleware)

// get user's cart
router.get('/', cartController.getCart)

// add items
router.post('/hosting', cartController.addHosting)
router.post('/addon', cartController.addAddon)
router.post('/wordpress', cartController.addWordpress)

// remove item
router.delete('/item/:itemId', cartController.removeItem)

module.exports = router
