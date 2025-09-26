const express = require('express')
const router = express.Router()
const {
  search,
  register,
} = require('../controllers/domainController')
const { authMiddleware } = require('../middlewares/auth')

router.post('/search', search) 
router.post('/register', authMiddleware, register) 

module.exports = router
