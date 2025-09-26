const express = require('express')
const router = express.Router()
const { register, login, profile, updateProfile, forgotPassword, resetPassword} = require('../controllers/authController')
const { authMiddleware } = require('../middlewares/auth')

router.post('/register', register)
router.post('/login', login)
router.get('/profile', authMiddleware, profile)
router.put('/update-profile', authMiddleware, updateProfile)
router.post('/forgot-password', forgotPassword)
router.post('/reset-password', resetPassword)

module.exports = router
