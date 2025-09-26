const express = require('express')
const router = express.Router()
const { listAddonPlans } = require('../controllers/addonController')

router.get('/plans', listAddonPlans)

module.exports = router
