const express = require('express')
const router = express.Router()
const authMiddleware = require('../middleware/auth')
const { createShop, getMyShop, updateShop, getAllShops, getShopById } = require('../controllers/shopController')
const upload = require('../middleware/upload') 

router.post('/create', authMiddleware, upload.single('image'), createShop)  // This fiels name 'image' should be match with the formdata which is dent by fronted
router.get('/my-shop', authMiddleware, getMyShop)
router.put('/update', authMiddleware, upload.single('image'), updateShop)
router.get('/all', getAllShops)
router.get('/:id', getShopById)

module.exports = router