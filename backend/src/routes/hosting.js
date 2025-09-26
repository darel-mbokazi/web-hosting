const express = require('express')
const router = express.Router()
const { listPlans } = require('../controllers/hostingController')

router.get('/plans', listPlans)

module.exports = router
