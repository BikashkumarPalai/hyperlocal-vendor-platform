const express = require('express')
const router = express.Router()
const authMiddleware = require('../middleware/auth')
const { submitReview, getShopReviews, getProductReviews, checkReviewStatus } = require('../controllers/reviewController')

// Private routes 
router.post('/submit', authMiddleware, submitReview)
router.get('/check/:orderId', authMiddleware, checkReviewStatus)

// Public routes 
router.get('/shop/:shopId', getShopReviews)
router.get('/product/:productId', getProductReviews)

module.exports = router