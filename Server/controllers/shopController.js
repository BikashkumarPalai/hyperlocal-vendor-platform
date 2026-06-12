const Shop = require('../models/Shop')

// Creating the shop 
const createShop = async (req, res) => {
    try {
        const { name, category, description, address, contact, latitude, longitude } = req.body

        if (!name || !category || !description || !address || !contact || !latitude || !longitude) {
            return res.status(400).json({ message: 'All fields are required' })
        }

        const existingShop = await Shop.findOne({ vendor: req.user.userId })
        if (existingShop) {
            return res.status(400).json({ message: 'You already have a shop' })
        }

        const shop = await Shop.create({
            vendor: req.user.userId,
            name,
            category,
            description,
            contact,
            image: req.file?.path || '',
            location: { 
                type: 'Point',
                coordinates: [parseFloat(longitude), parseFloat(latitude)],
                address
            }, 
            address
        })

        res.status(201).json({ message: 'Shop created successfully', shop })

    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message })
    }
}

// Finding the shop which is owned by vendor
const getMyShop = async (req, res) => {
    try {
        const shop = await Shop.findOne({ vendor: req.user.userId })

        if (!shop) {
            return res.status(404).json({ message: 'No shop found' })
        }

        res.json({ shop })

    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message })
    }
}


// Upadtion of shop
const updateShop = async (req, res) => {
    try {
        const updateData = { ...req.body }
        if (req.file?.path) updateData.image = req.file.path    // If image update then only cloudinary url exist 

        const shop = await Shop.findOneAndUpdate(
            { vendor: req.user.userId },
            updateData,
            { new: true }
        )

        if (!shop) return res.status(404).json({ message: 'Shop not found' })
        res.json({ message: 'Shop updated successfully', shop })
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message })
    }
}

// get all near by shops 
const getAllShops = async (req, res) => {
    try {
        const { latitude, longitude, radius = 10000, category } = req.query

        let shops

        if (latitude && longitude) {
            let filter = {
                location: {
                    $near: {
                        $geometry: {
                            type: 'Point',
                            coordinates: [parseFloat(longitude), parseFloat(latitude)]
                        },
                        $maxDistance: parseInt(radius)
                    }
                }
            }
            if (category) filter.category = category
            shops = await Shop.find(filter)
        } else {
            let filter = {}
            if (category) filter.category = category
            shops = await Shop.find(filter).sort({ createdAt: -1 })
        }

        res.json({ shops })

    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message })
    }
}

// Get single shop by id (Public route)
const getShopById = async (req, res) => {
    try {
        const shop = await Shop.findById(req.params.id)
        if (!shop) {
            return res.status(404).json({ message: 'Shop not found' })
        }
        res.json({ shop })
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message })
    }
}



module.exports = { createShop, getMyShop, updateShop, getAllShops, getShopById }