const mongoose = require('mongoose')

const productReviewSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    productName: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    comment: {
        type: String,
        default: '',
        maxlength: 500
    }
}, { _id: false })         // no separate _id per product review

const reviewSchema = new mongoose.Schema({
    order: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order',
        required: true,
        unique: true
    },
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    shop: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Shop',
        required: true
    },


    shopRating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    shopComment: {
        type: String,
        default: '',
        maxlength: 1000
    },

    // Listen, it create array of object name productReviews and contain all inside the things that are present inside the productreviewschema 
    productReviews: [productReviewSchema],

    isFlagged: {
        type: Boolean,
        default: false
    },

    helpfulVotes: {
        type: Number,
        default: 0
    }

}, { timestamps: true })


reviewSchema.index({ shop: 1, createdAt: -1 })

reviewSchema.index({ 'productReviews.product': 1 })

reviewSchema.index({ order: 1, customer: 1 }, { unique: true })

module.exports = mongoose.model('Review', reviewSchema)