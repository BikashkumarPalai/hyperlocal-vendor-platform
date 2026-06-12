const Order = require('../models/Order')
const Shop = require('../models/Shop')

const getAnalytics = async (req, res) => {
    try {
        const shop = await Shop.findOne({ vendor: req.user.userId })
        if (!shop) {
            return res.status(404).json({ message: 'No shop found' })
        }

        const orders = await Order.find({
            shop: shop._id,
            status: 'completed'
        })

        // Total revenue
        const totalRevenue = orders.reduce((sum, order) => sum + order.totalPrice, 0)

        // Total orders
        const totalOrders = await Order.countDocuments({ shop: shop._id })

        // Today's sales
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        const todayOrders = await Order.find({
            shop: shop._id,
            status: 'completed',
            createdAt: { $gte: today }
        })
        const todaySales = todayOrders.reduce((sum, order) => sum + order.totalPrice, 0)

        // Best selling products
        const productSales = {}
        orders.forEach(order => {
            order.items.forEach(item => {
                if (productSales[item.name]) {
                    productSales[item.name] += item.quantity
                } else {
                    productSales[item.name] = item.quantity
                }
            })
        })

        const bestSellingProduct = Object.entries(productSales)      // Object.entries  --> convert object to array of key & value pair
            .sort((a, b) => b[1] - a[1])[0]    // Return like ["sugar",10]

        // Pending orders count
        const pendingOrders = await Order.countDocuments({
            shop: shop._id,
            status: 'pending'
        })

        res.json({
            totalRevenue,
            totalOrders,
            todaySales,
            pendingOrders,
            bestSellingProduct: bestSellingProduct
                ? { name: bestSellingProduct[0], quantity: bestSellingProduct[1] }
                : null
        })

    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message })
    }
}

module.exports = { getAnalytics }