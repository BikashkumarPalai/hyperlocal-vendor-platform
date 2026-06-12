const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const connectDB = require('./lib/mongoDB')
const authRoutes = require('./routes/auth')
const shopRoutes = require('./routes/shop')
const productRoutes = require('./routes/product')
const orderRoutes = require('./routes/order')
const analyticsRoutes = require('./routes/analytics')
const reviewRoutes = require('./routes/review')

dotenv.config()

const app = express()

app.use(cors())
app.use(express.json())


app.use(cors({
  origin: [
    'https://hyperlocal-vendor-frontend.vercel.app',
    'http://localhost:5173'
  ],
  credentials: true
}))

// Conecting the database
connectDB()

// /api/auth
app.use('/api/auth', authRoutes)
// For shop routers
app.use('/api/shop', shopRoutes)
// For product routers
app.use('/api/product', productRoutes)
// For order routes
app.use('/api/order', orderRoutes)
// For getting analytic like totalsale , mostsales_item
app.use('/api/analytics', analyticsRoutes)
// For the review 
app.use('/api/review', reviewRoutes)

app.get('/api/test', (req, res) => {
  res.json({ message: 'Server is running' })
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})