const Product = require('../models/Product')
const Shop = require('../models/Shop')
const Order = require('../models/Order')
const { default: getDistanceInKm } = require('../lib/distance')

// Addin product to the shop
const addProduct = async (req, res) => {
    try {
        const { name, price, unit, stock, description } = req.body

        if (!name || !price || !unit || !stock) {
            return res.status(400).json({ message: 'All fields are required' })
        }

        const shop = await Shop.findOne({ vendor: req.user.userId })
        if (!shop) {
            return res.status(404).json({ message: 'Create a shop first' })
        }

        const product = await Product.create({
            shop: shop._id,
            vendor: req.user.userId,
            name,
            price,
            unit,
            stock,
            description,
            image: req.file?.path || ''
        })

        res.status(201).json({
            message: 'Product added successfully',
            product
        })

    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message })
    }
}




// Get all products of vendor's shop
const getMyProducts = async (req, res) => {
    try {
        const shop = await Shop.findOne({ vendor: req.user.userId })
        if (!shop) {
            return res.status(404).json({ message: 'No shop found' })
        }

        // If there is shop then there is must be product
        const products = await Product.find({ shop: shop._id })

        res.json({ products })

    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message })
    }
}

// Updating the product
const updateProduct = async (req, res) => {
    try {
        const updateData = { ...req.body }
        if (req.file?.path) updateData.image = req.file.path

        const product = await Product.findOneAndUpdate(
            { _id: req.params.id, vendor: req.user.userId },
            updateData,
            { new: true }
        )

        if (!product) return res.status(404).json({ message: 'Product not found' })
        res.json({ message: 'Product updated successfully', product })
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message })
    }
}

// Deleting the product 
const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findOneAndDelete({
            _id: req.params.id,
            vendor: req.user.userId
        })

        if (!product) {
            return res.status(404).json({ message: 'Product not found' })
        }

        res.json({ message: 'Product deleted successfully' })

    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message })
    }
}

// Get products by shop id (public)
const getProductsByShop = async (req, res) => {
    try {
        const products = await Product.find({
            shop: req.params.shopId,
            isAvailable: true
        })
        res.json({ products })
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message })
    }
}

// Get single product by id (public)
const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id)
            .populate('shop', 'name category location isOpen contact')

        if (!product) {
            return res.status(404).json({ message: 'Product not found' })
        }

        res.json({ product })
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message })
    }
}

// For the showing the product 
const getPopularProducts = async (req, res) => {
    try {
        const { latitude, longitude } = req.query

        // Get all completed orders 
        const orders = await Order.find({ status: 'completed' })

        // count product appearances
        const productCount = {}
        orders.forEach(order => {
            order.items.forEach(item => {
                const id = item.product?.toString()
                if (id) productCount[id] = (productCount[id] || 0) + item.quantity
            })
        })

        // Get all available products with their shop
        let products = await Product.find({ isAvailable: true, stock: { $gt: 0 } })
            .populate('shop', 'name location category isOpen')

        // Filter by nearby shops if location provided
        if (latitude && longitude) {
            products = products.filter(p => {
                if (!p.shop?.location?.coordinates) return true
                const [lng, lat] = p.shop.location.coordinates
                return getDistanceInKm(parseFloat(latitude), parseFloat(longitude), lat, lng) <= 10
            })
        }

        // Sort by order count (popular first), then by newest
        products.sort((a, b) => {
            const countA = productCount[a._id.toString()] || 0
            const countB = productCount[b._id.toString()] || 0
            if (countB !== countA) return countB - countA
            return new Date(b.createdAt) - new Date(a.createdAt)
        })

        res.json({ products: products.slice(0, 20) })

    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message })
    }
}

// Get top-rated products sorted by averageRating
const getTopRatedProducts = async (req, res) => {
    try {
        const limit = Math.min(20, parseInt(req.query.limit) || 10)

        const products = await Product.find({
            isAvailable: true,
            stock: { $gt: 0 },
            totalRatings: { $gt: 0 }   // only products that have at least one review
        })
            .populate('shop', 'name category location isOpen')
            .sort({ averageRating: -1, totalRatings: -1 })
            .limit(limit)

        res.json({ products })
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message })
    }
}


// Search products by name (public)
const searchProducts = async (req, res) => {
    try {
        const { q } = req.query

        if (!q || q.trim().length === 0) {
            return res.status(400).json({ message: 'Search query is required' })
        }

        const limit = Math.min(20, parseInt(req.query.limit) || 10)

        // Case-insensitive partial match on product name
        const products = await Product.find({
            name: { $regex: q.trim(), $options: 'i' },    // $Option: 'i' for case-insensitive
            isAvailable: true,
            stock: { $gt: 0 }
        })
            .populate('shop', 'name category location isOpen')
            .sort({ averageRating: -1 })
            .limit(limit)

        res.json({ products, count: products.length })
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message })
    }
}

module.exports = { addProduct, getMyProducts, updateProduct, deleteProduct, getProductsByShop, getPopularProducts, searchProducts, getTopRatedProducts, getProductById }

