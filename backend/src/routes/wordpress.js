const express = require('express')
const { wordpressPlans } = require('../controllers/wordpressHosting')
const router = express.Router()

router.get('/plans', wordpressPlans)

module.exports = router
