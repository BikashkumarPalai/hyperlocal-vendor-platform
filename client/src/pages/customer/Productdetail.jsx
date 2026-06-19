import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import axios from '../../api/axios'
import { useCart } from '../../context/CartContext'
import { useAuth } from '../../context/AuthContext'

const ProductDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const { cart, addToCart, updateQuantity, totalItems, totalPrice } = useCart()

  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchProduct()
  }, [id])

  const fetchProduct = async () => {
    try {
      setLoading(true)
      setError('')
      const res = await axios.get(`/api/product/${id}`)
      setProduct(res.data.product)
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to load product'
      setError(message)
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  const getCartQty = (productId) => {
    const item = cart.find(i => i._id === productId)
    return item ? item.quantity : 0
  }

  const handleAdd = () => {
    addToCart(product, product.shop._id)
    toast.success(`${product.name} added to cart`)
  }

  const handleLogout = () => {
    logout()
    toast.success('Logged out successfully')
    navigate('/login')
  }

  // ── Loading ──
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500 text-sm">Loading product...</p>
      </div>
    )
  }

  // ── Error ──
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 text-sm mb-3">{error}</p>
          <button
            onClick={() => navigate(-1)}
            className="text-blue-600 text-sm hover:underline"
          >
            Go back
          </button>
        </div>
      </div>
    )
  }

  const qty = getCartQty(product._id)
  const isOut = product.stock === 0
  const isLow = product.stock > 0 && product.stock <= 5
  const shop = product.shop

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── Navbar ── */}
      

      <div className="max-w-2xl mx-auto px-4 py-6">

        {/* ── Back ── */}
        <button
          onClick={() => navigate(-1)}
          className="text-sm text-gray-500 hover:text-gray-700 mb-5 flex items-center gap-1"
        >
          ← Back
        </button>

        {/* ── Product Image ── */}
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden mb-4">
          {product.image ? (
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-56 object-cover"
            />
          ) : (
            <div className="w-full h-56 bg-gray-100 flex items-center justify-center">
              <span className="text-gray-400 text-sm">No image</span>
            </div>
          )}
        </div>

        {/* ── Product Info ── */}
        <div className="bg-white border border-gray-200 rounded-lg p-5 mb-4">

          {/* Name + Status */}
          <div className="flex justify-between items-start mb-3">
            <h2 className="text-xl font-bold text-gray-900">{product.name}</h2>
            <span className={`text-xs font-semibold px-2 py-1 rounded ${isOut
              ? 'bg-gray-100 text-gray-500'
              : isLow
                ? 'bg-yellow-50 text-yellow-600'
                : 'bg-green-50 text-green-600'
              }`}>
              {isOut ? 'Out of Stock' : isLow ? `Only ${product.stock} left` : 'In Stock'}
            </span>
          </div>

          {/* Price */}
          <p className="text-2xl font-bold text-green-600 mb-1">
            ₹{product.price}
            <span className="text-sm font-normal text-gray-400 ml-1">/ {product.unit}</span>
          </p>

          {/* Rating */}
          {product.totalRatings > 0 && (
            <p className="text-sm text-gray-500 mb-3">
              ⭐ {product.averageRating} &nbsp;·&nbsp; {product.totalRatings} review{product.totalRatings > 1 ? 's' : ''}
            </p>
          )}

          {/* Description */}
          {product.description && (
            <p className="text-sm text-gray-600 border-t border-gray-100 pt-3 mt-3">
              {product.description}
            </p>
          )}
        </div>

        {/* ── Shop Info (small) ── */}
        {shop && (
          <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4 flex justify-between items-center">
            <div>
              <p className="text-xs text-gray-400 mb-0.5">Sold by</p>
              <p className="text-sm font-semibold text-gray-800">{shop.name}</p>
              <p className="text-xs text-gray-400 capitalize">{shop.category}</p>
            </div>
            <button
              onClick={() => navigate(`/shop/${shop._id}`)}
              className="text-sm font-medium text-blue-600 border border-blue-200 px-3 py-1.5 rounded hover:bg-blue-50 transition"
            >
              Visit Shop →
            </button>
          </div>
        )}

        {/* ── Add to Cart ── */}
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          {isOut ? (
            <button
              disabled
              className="w-full py-2.5 rounded bg-gray-100 text-gray-400 text-sm font-semibold cursor-not-allowed"
            >
              Out of Stock
            </button>
          ) : qty > 0 ? (
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 font-medium">In your cart</span>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => updateQuantity(product._id, qty - 1)}
                  className="w-8 h-8 rounded border border-gray-300 text-gray-700 font-bold hover:bg-gray-100 transition flex items-center justify-center"
                >
                  −
                </button>
                <span className="text-sm font-bold text-gray-900 w-5 text-center">{qty}</span>
                <button
                  onClick={handleAdd}
                  className="w-8 h-8 rounded border border-green-500 text-green-600 font-bold hover:bg-green-50 transition flex items-center justify-center"
                >
                  +
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={handleAdd}
              className="w-full py-2.5 rounded bg-green-600 text-white text-sm font-semibold hover:bg-green-700 transition"
            >
              Add to Cart
            </button>
          )}
        </div>

      </div>

      {/* ── Floating Cart Bar ── */}
      {totalItems > 0 && (
        <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50 w-full max-w-sm px-4">
          <div className="bg-gray-900 rounded-xl px-4 py-3 flex items-center justify-between shadow-xl">
            <div>
              <p className="text-white text-sm font-semibold">
                {totalItems} item{totalItems > 1 ? 's' : ''} · ₹{totalPrice}
              </p>
            </div>
            <button
              onClick={() => navigate('/cart')}
              className="bg-green-500 hover:bg-green-400 text-white text-sm font-bold px-4 py-1.5 rounded-lg transition"
            >
              View Cart →
            </button>
          </div>
        </div>
      )}

    </div>
  )
}

export default ProductDetail