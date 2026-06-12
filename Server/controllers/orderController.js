const Order = require('../models/Order')
const Product = require('../models/Product')
const Shop = require('../models/Shop')
const razorpay = require('../lib/razorpay')
const crypto = require('crypto')
const getDistanceInKm = require('../lib/distance')

const MAX_ORDER_RADIUS_KM = 10

// Step-1 creation of razorpay order
const createPaymentOrder = async (req, res) => {
    try {
        const { totalPrice } = req.body

        if (!totalPrice) {
            return res.status(400).json({ message: 'Total price is required' })
        }

        const options = {
            amount: totalPrice * 100, // Razorpay needs amount in paise
            currency: 'INR',
            receipt: `receipt_${Date.now()}`
        }

        const paymentOrder = await razorpay.orders.create(options)     // Razorpay order

        res.json({
            orderId: paymentOrder.id,
            amount: paymentOrder.amount,
            currency: paymentOrder.currency,
            keyId: process.env.RAZORPAY_KEY_ID
        })

    } catch (error) {
        res.status(500).json({ message: 'Payment order creation failed', error: error.message })
    }
}


// Step-2 verify the order using signature and save order
const verifyPayment = async (req, res) => {
    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            shop,
            items,
            totalPrice,
            customerLat,
            customerLng
        } = req.body

        // Verify signature
        const body = razorpay_order_id + '|' + razorpay_payment_id
        const expectedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(body.toString())
            .digest('hex')

        if (expectedSignature !== razorpay_signature) {
            return res.status(400).json({ message: 'Payment verification failed' })
        }

        // Check distance
        if (customerLat && customerLng) {
            const shopData = await Shop.findById(shop)
            if (shopData?.location?.coordinates) {
                const shopLng = shopData.location.coordinates[0]
                const shopLat = shopData.location.coordinates[1]
                const distance = getDistanceInKm(customerLat, customerLng, shopLat, shopLng)
                if (distance > MAX_ORDER_RADIUS_KM) {
                    return res.status(400).json({
                        message: `Shop is too far. Only orders within ${MAX_ORDER_RADIUS_KM}km allowed.`
                    })
                }
            }
        }

        // Check stock
        for (const item of items) {
            const product = await Product.findById(item.product)
            if (!product) {
                return res.status(404).json({ message: `Product not found: ${item.name}` })
            }
            if (product.stock < item.quantity) {
                return res.status(400).json({
                    message: `Insufficient stock for ${item.name}. Available: ${product.stock}`
                })
            }
        }

        // Save order
        const order = await Order.create({
            customer: req.user.userId,
            shop,
            items,
            totalPrice,
            paymentId: razorpay_payment_id,
            paymentOrderId: razorpay_order_id,
            isPaid: true  // Payment compelte then save 
        })

        res.status(201).json({
            message: 'Payment successful. Order placed!',
            order
        })

    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message })
    }
}





// Customer gets their orders
const getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({ customer: req.user.userId })
            .populate('shop', 'name location')
            .sort({ createdAt: -1 })

        res.json({ orders })
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message })
    }
}


// Vendor gets orders (Vendor see order placed by customer in his shop)
const getShopOrders = async (req, res) => {
    try {
        const shop = await Shop.findOne({ vendor: req.user.userId })
        if (!shop) {
            return res.status(404).json({ message: 'No shop found' })
        }

        const orders = await Order.find({ shop: shop._id })
            .populate('customer', 'name email')
            .sort({ createdAt: -1 })

        res.json({ orders })
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message })
    }
}


// Vendor update order status
const updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body
        const validStatuses = ['accepted', 'rejected', 'completed']

        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: 'Invalid status' })
        }

        const order = await Order.findById(req.params.id)
        if (!order) {
            return res.status(404).json({ message: 'Order not found' })
        }

        // Deduct stock when order is accepted
        if (status === 'accepted') {
            for (const item of order.items) {
                await Product.findByIdAndUpdate(item.product, {
                    $inc: { stock: -item.quantity }
                })
            }
        }

        // updating the status if order accepted 
        order.status = status
        await order.save()

        res.json({ message: `Order ${status}`, order })

    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message })
    }
}


module.exports = { createPaymentOrder, verifyPayment, getMyOrders, getShopOrders, updateOrderStatus }