const express = require('express')
const router = express.Router()
const authMiddleware = require('../middleware/auth')
const { addProduct, getMyProducts, updateProduct, deleteProduct, getProductsByShop, getPopularProducts } = require('../controllers/productController')
const upload = require('../middleware/upload') 

router.post('/add', authMiddleware, upload.single('image'), addProduct)
router.get('/my-products', authMiddleware, getMyProducts)
router.put('/update/:id', authMiddleware, upload.single('image'), updateProduct)
router.delete('/delete/:id', authMiddleware, deleteProduct)
router.get('/shop/:shopId', getProductsByShop)
router.get('/popular', getPopularProducts)

module.exports = router