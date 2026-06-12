const Review = require('../models/Review')
const Order = require('../models/Order')
const Shop = require('../models/Shop')
const Product = require('../models/Product')
const mongoose = require('mongoose')


const recalculateShopRating = async (shopId) => {
    const result = await Review.aggregate([
        { $match: { shop: shopId } },
        {
            $group: {
                _id: '$shop',
                averageRating: { $avg: '$shopRating' },
                totalRatings: { $sum: 1 }
            }
        }
    ])

    if (result.length > 0) {
        await Shop.findByIdAndUpdate(shopId, {
            averageRating: parseFloat(result[0].averageRating.toFixed(1)),
            totalRatings: result[0].totalRatings
        })
    } else {
        await Shop.findByIdAndUpdate(shopId, {
            averageRating: 0,
            totalRatings: 0
        })
    }
}


const recalculateProductRatings = async (productIds) => {
    for (const productId of productIds) {
        const result = await Review.aggregate([
            { $unwind: '$productReviews' },
            { $match: { 'productReviews.product': productId } },
            {
                $group: {
                    _id: '$productReviews.product',
                    averageRating: { $avg: '$productReviews.rating' },
                    totalRatings: { $sum: 1 }
                }
            }
        ])

        if (result.length > 0) {
            await Product.findByIdAndUpdate(productId, {
                averageRating: parseFloat(result[0].averageRating.toFixed(1)),
                totalRatings: result[0].totalRatings
            })
        } else {
            await Product.findByIdAndUpdate(productId, {
                averageRating: 0,
                totalRatings: 0
            })
        }
    }
}

const submitReview = async (req, res) => {
    try {
        const { orderId, shopRating, shopComment, productReviews } = req.body
        const customerId = req.user.userId

        if (!orderId || !shopRating) {
            return res.status(400).json({ message: 'orderId and shopRating are required' })
        }

        if (shopRating < 1 || shopRating > 5) {
            return res.status(400).json({ message: 'Shop rating must be between 1 and 5' })
        }

        const order = await Order.findById(orderId)

        if (!order) {
            return res.status(404).json({ message: 'Order not found' })
        }

        if (order.customer.toString() !== customerId) {
            return res.status(403).json({ message: 'You can only review your own orders' })
        }

        if (order.status !== 'completed') {
            return res.status(400).json({
                message: 'You can only review orders that have been completed'
            })
        }

        if (order.isReviewed) {
            return res.status(409).json({ message: 'You have already reviewed this order' })
        }

        // Also check Review collection (double safety — unique index will also catch this)
        const existingReview = await Review.findOne({ order: orderId })
        if (existingReview) {
            return res.status(409).json({ message: 'You have already reviewed this order' })
        }


        const validProductIds = new Set(
            order.items.map(item => item.product.toString())
        )

        const sanitizedProductReviews = []

        if (Array.isArray(productReviews) && productReviews.length > 0) {
            for (const pr of productReviews) {
                if (!pr.product || !pr.rating) continue  // skip incomplete entries

                if (!validProductIds.has(pr.product.toString())) {
                    return res.status(400).json({
                        message: `Product ${pr.product} does not belong to this order`
                    })
                }

                if (pr.rating < 1 || pr.rating > 5) {
                    return res.status(400).json({
                        message: `Rating for product must be between 1 and 5`
                    })
                }

                // Find productName snapshot from order items
                const orderItem = order.items.find(
                    item => item.product.toString() === pr.product.toString()
                )

                sanitizedProductReviews.push({
                    product: pr.product,
                    productName: orderItem?.name || pr.productName || 'Unknown',
                    rating: Number(pr.rating),
                    comment: (pr.comment || '').slice(0, 500).trim()
                })
            }
        }

        const review = await Review.create({
            order: orderId,
            customer: customerId,
            shop: order.shop,
            shopRating: Number(shopRating),
            shopComment: (shopComment || '').slice(0, 1000).trim(),
            productReviews: sanitizedProductReviews
        })


        await Order.findByIdAndUpdate(orderId, { isReviewed: true })


        const productIdsToUpdate = sanitizedProductReviews.map(pr =>
            new mongoose.Types.ObjectId(pr.product)
        )

        await Promise.all([
            recalculateShopRating(order.shop),
            productIdsToUpdate.length > 0
                ? recalculateProductRatings(productIdsToUpdate)
                : Promise.resolve()
        ])

        res.status(201).json({
            message: 'Review submitted successfully',
            review
        })

    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({ message: 'You have already reviewed this order' })
        }
        res.status(500).json({ message: 'Server error', error: error.message })
    }
}


const getShopReviews = async (req, res) => {
    try {
        const { shopId } = req.params
        const page = Math.max(1, parseInt(req.query.page) || 1)
        const limit = Math.min(20, parseInt(req.query.limit) || 10)  // max 20 per page
        const skip = (page - 1) * limit

        const [reviews, total] = await Promise.all([
            Review.find({ shop: shopId, isFlagged: false })
                .populate('customer', 'name')
                .select('shopRating shopComment productReviews createdAt customer helpfulVotes')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean(),
            Review.countDocuments({ shop: shopId, isFlagged: false })
        ])

        res.json({
            reviews,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
                hasNextPage: page < Math.ceil(total / limit),
                hasPrevPage: page > 1
            }
        })

    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message })
    }
}


const getProductReviews = async (req, res) => {
    try {
        const { productId } = req.params
        const page = Math.max(1, parseInt(req.query.page) || 1)
        const limit = Math.min(20, parseInt(req.query.limit) || 10)
        const skip = (page - 1) * limit


        const pipeline = [
            { $match: { 'productReviews.product': { $in: [require('mongoose').Types.ObjectId.createFromHexString(productId)] }, isFlagged: false } },
            { $unwind: '$productReviews' },
            { $match: { 'productReviews.product': require('mongoose').Types.ObjectId.createFromHexString(productId) } },
            {
                $lookup: {
                    from: 'users',
                    localField: 'customer',
                    foreignField: '_id',
                    as: 'customerData'
                }
            },
            { $unwind: '$customerData' },
            {
                $project: {
                    rating: '$productReviews.rating',
                    comment: '$productReviews.comment',
                    productName: '$productReviews.productName',
                    createdAt: 1,
                    customerName: '$customerData.name'
                }
            },
            { $sort: { createdAt: -1 } },
            {
                $facet: {
                    data: [{ $skip: skip }, { $limit: limit }],
                    totalCount: [{ $count: 'count' }]
                }
            }
        ]

        const result = await Review.aggregate(pipeline)
        const reviews = result[0]?.data || []
        const total = result[0]?.totalCount[0]?.count || 0

        res.json({
            reviews,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
                hasNextPage: page < Math.ceil(total / limit),
                hasPrevPage: page > 1
            }
        })

    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message })
    }
}


const checkReviewStatus = async (req, res) => {
    try {
        const { orderId } = req.params
        const customerId = req.user.userId

        const order = await Order.findOne({ _id: orderId, customer: customerId })
        if (!order) {
            return res.status(404).json({ message: 'Order not found' })
        }

        const review = await Review.findOne({ order: orderId }).lean()

        res.json({
            isReviewed: !!review,
            review: review || null
        })

    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message })
    }
}

module.exports = {
    submitReview,
    getShopReviews,
    getProductReviews,
    checkReviewStatus
}
