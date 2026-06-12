const express = require('express')
const router = express.Router()
const authMiddleware = require('../middleware/auth')
const { createPaymentOrder, verifyPayment, getMyOrders, getShopOrders, updateOrderStatus } = require('../controllers/orderController')

router.post('/create-payment', authMiddleware, createPaymentOrder)
router.post('/verify-payment', authMiddleware, verifyPayment)
router.get('/my-orders', authMiddleware, getMyOrders)
router.get('/shop-orders', authMiddleware, getShopOrders)
router.put('/status/:id', authMiddleware, updateOrderStatus)

module.exports = router