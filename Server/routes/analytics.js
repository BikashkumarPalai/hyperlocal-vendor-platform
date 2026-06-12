const express = require('express')
const router = express.Router()
const authMiddleware = require('../middleware/auth')
const { getAnalytics } = require('../controllers/analyticsController')

router.get('/', authMiddleware, getAnalytics)

module.exports = router