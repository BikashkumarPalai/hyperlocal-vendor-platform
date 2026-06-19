// // // import { useState, useEffect } from 'react'
// // // import { useNavigate } from 'react-router-dom'
// // // import axios from '../../api/axios'
// // // import { useAuth } from '../../context/AuthContext'
// // // import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet'
// // // import L from 'leaflet'
// // // import 'leaflet/dist/leaflet.css'

// // // // Fix leaflet marker icons
// // // delete L.Icon.Default.prototype._getIconUrl
// // // L.Icon.Default.mergeOptions({
// // //   iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
// // //   iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
// // //   shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
// // // })

// // // // Custom icons
// // // const shopIcon = new L.Icon({
// // //   iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
// // //   shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
// // //   iconSize: [25, 41],
// // //   iconAnchor: [12, 41],
// // //   popupAnchor: [1, -34],
// // // })

// // // const userIcon = new L.Icon({
// // //   iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png',
// // //   shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
// // //   iconSize: [25, 41],
// // //   iconAnchor: [12, 41],
// // //   popupAnchor: [1, -34],
// // // })

// // // // Recenter map when location changes
// // // const RecenterMap = ({ lat, lng }) => {
// // //   const map = useMap()
// // //   useEffect(() => {
// // //     if (lat && lng) map.setView([lat, lng], 13)
// // //   }, [lat, lng])
// // //   return null
// // // }

// // // const Marketplace = () => {
// // //   const { user, logout } = useAuth()
// // //   const navigate = useNavigate()
// // //   const [shops, setShops] = useState([])
// // //   const [loading, setLoading] = useState(true)
// // //   const [search, setSearch] = useState('')
// // //   const [category, setCategory] = useState('')
// // //   const [userLocation, setUserLocation] = useState(null)
// // //   const [radius, setRadius] = useState(5000)
// // //   const [view, setView] = useState('grid')
// // //   const [locationError, setLocationError] = useState(false)

// // //   useEffect(() => {
// // //     getUserLocation()
// // //   }, [])

// // //   useEffect(() => {
// // //     fetchShops()
// // //   }, [userLocation, category, radius])

// // //   const getUserLocation = () => {
// // //     navigator.geolocation.getCurrentPosition(
// // //       (position) => {
// // //         setUserLocation({
// // //           latitude: position.coords.latitude,
// // //           longitude: position.coords.longitude
// // //         })
// // //       },
// // //       () => {
// // //         setLocationError(true)
// // //         fetchShops()
// // //       }
// // //     )
// // //   }

// // //   const fetchShops = async () => {
// // //     try {
// // //       setLoading(true)
// // //       const params = {}
// // //       if (category) params.category = category
// // //       if (userLocation) {
// // //         params.latitude = userLocation.latitude
// // //         params.longitude = userLocation.longitude
// // //         params.radius = radius
// // //       }
// // //       const res = await axios.get('/api/shop/all', { params })
// // //       setShops(res.data.shops)
// // //     } catch (err) {
// // //       console.error(err)
// // //     } finally {
// // //       setLoading(false)
// // //     }
// // //   }

// // //   const handleLogout = () => {
// // //     logout()
// // //     navigate('/login')
// // //   }

// // //   const filteredShops = shops.filter(shop =>
// // //     shop.name.toLowerCase().includes(search.toLowerCase()) ||
// // //     (shop.location?.address || '').toLowerCase().includes(search.toLowerCase())
// // //   )

// // //   return (
// // //     <div className="min-h-screen bg-gray-100">

// // //       {/* Navbar */}
// // //       <nav className="bg-white shadow px-6 py-4 flex justify-between items-center">
// // //         <h1 className="text-xl font-bold text-blue-600">Hyperlocal Vendor</h1>
// // //         <div className="flex items-center gap-4">
// // //           <span className="text-sm text-gray-600">Hello, {user?.name}</span>
// // //           <button
// // //             onClick={handleLogout}
// // //             className="bg-red-100 text-red-600 px-4 py-1 rounded text-sm hover:bg-red-200 transition"
// // //           >
// // //             Logout
// // //           </button>
// // //         </div>
// // //       </nav>

// // //       <div className="max-w-6xl mx-auto p-6">

// // //         {/* Header */}
// // //         <div className="flex justify-between items-center mb-4">
// // //           <h2 className="text-2xl font-bold text-gray-800">Nearby Shops</h2>
// // //           <div className="flex gap-2">
// // //             <button
// // //               onClick={() => setView('grid')}
// // //               className={`px-4 py-1 rounded text-sm font-medium transition ${view === 'grid'
// // //                 ? 'bg-blue-600 text-white'
// // //                 : 'bg-white text-gray-600 hover:bg-gray-100'
// // //                 }`}
// // //             >
// // //               Grid
// // //             </button>
// // //             <button
// // //               onClick={() => setView('map')}
// // //               className={`px-4 py-1 rounded text-sm font-medium transition ${view === 'map'
// // //                 ? 'bg-blue-600 text-white'
// // //                 : 'bg-white text-gray-600 hover:bg-gray-100'
// // //                 }`}
// // //             >
// // //               Map
// // //             </button>
// // //           </div>
// // //         </div>

// // //         {/* Location status */}
// // //         {locationError && (
// // //           <div className="bg-yellow-100 text-yellow-700 p-3 rounded mb-4 text-sm">
// // //             Location access denied. Showing all shops. Enable location for nearby results.
// // //           </div>
// // //         )}

// // //         {/* Search and Filter */}
// // //         <div className="flex gap-3 mb-4">
// // //           <input
// // //             type="text"
// // //             placeholder="Search shops by name or address..."
// // //             value={search}
// // //             onChange={(e) => setSearch(e.target.value)}
// // //             className="flex-1 border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-blue-500"
// // //           />
// // //           <select
// // //             value={category}
// // //             onChange={(e) => setCategory(e.target.value)}
// // //             className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
// // //           >
// // //             <option value="">All Categories</option>
// // //             <option value="grocery">Grocery</option>
// // //             <option value="food">Food</option>
// // //             <option value="fruit">Fruit</option>
// // //             <option value="bakery">Bakery</option>
// // //             <option value="dairy">Dairy</option>
// // //             <option value="stationary">Stationary</option>
// // //             <option value="other">Other</option>
// // //           </select>
// // //         </div>

// // //         {/* Radius slider */}
// // //         {userLocation && (
// // //           <div className="flex items-center gap-3 mb-6 bg-white p-3 rounded-lg shadow">
// // //             <span className="text-sm text-gray-600 whitespace-nowrap">Search radius:</span>
// // //             <input
// // //               type="range"
// // //               min="1000"
// // //               max="20000"
// // //               step="1000"
// // //               value={radius}
// // //               onChange={(e) => setRadius(Number(e.target.value))}
// // //               className="flex-1"
// // //             />
// // //             <span className="text-sm font-medium text-blue-600 whitespace-nowrap">
// // //               {radius / 1000} km
// // //             </span>
// // //           </div>
// // //         )}

// // //         {/* MAP VIEW */}
// // //         {view === 'map' && (
// // //           <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
// // //             {userLocation ? (
// // //               <MapContainer
// // //                 center={[userLocation.latitude, userLocation.longitude]}
// // //                 zoom={13}
// // //                 style={{ height: '500px', width: '100%' }}
// // //               >
// // //                 <TileLayer
// // //                   url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
// // //                   attribution='&copy; OpenStreetMap contributors'
// // //                 />

// // //                 <RecenterMap
// // //                   lat={userLocation.latitude}
// // //                   lng={userLocation.longitude}
// // //                 />

// // //                 {/* User location marker */}
// // //                 <Marker
// // //                   position={[userLocation.latitude, userLocation.longitude]}
// // //                   icon={userIcon}
// // //                 >
// // //                   <Popup>You are here</Popup>
// // //                 </Marker>

// // //                 {/* Radius circle */}
// // //                 <Circle
// // //                   center={[userLocation.latitude, userLocation.longitude]}
// // //                   radius={radius}
// // //                   pathOptions={{
// // //                     color: 'blue',
// // //                     fillColor: 'blue',
// // //                     fillOpacity: 0.05
// // //                   }}
// // //                 />

// // //                 {/* Shop markers */}
// // //                 {filteredShops.map(shop => (
// // //                   shop.location?.coordinates && (
// // //                     <Marker
// // //                       key={shop._id}
// // //                       position={[
// // //                         shop.location.coordinates[1],
// // //                         shop.location.coordinates[0]
// // //                       ]}
// // //                       icon={shopIcon}
// // //                     >
// // //                       <Popup>
// // //                         <div className="p-1">
// // //                           <p className="font-bold text-gray-800">{shop.name}</p>
// // //                           <p className="text-sm text-blue-600 capitalize">{shop.category}</p>
// // //                           <p className="text-xs text-gray-500 mb-2">
// // //                             {shop.location?.address || shop.location.address}
// // //                           </p>
// // //                           <button
// // //                             onClick={() => navigate(`/shop/${shop._id}`)}
// // //                             className="bg-blue-600 text-white px-3 py-1 rounded text-xs w-full"
// // //                           >
// // //                             View Shop
// // //                           </button>
// // //                         </div>
// // //                       </Popup>
// // //                     </Marker>
// // //                   )
// // //                 ))}
// // //               </MapContainer>
// // //             ) : (
// // //               <div className="h-64 flex items-center justify-center text-gray-500">
// // //                 Enable location to see map
// // //               </div>
// // //             )}
// // //           </div>
// // //         )}

// // //         {/* GRID VIEW */}
// // //         {view === 'grid' && (
// // //           <>
// // //             {loading ? (
// // //               <div className="text-center text-gray-500 py-12">Loading shops...</div>
// // //             ) : filteredShops.length === 0 ? (
// // //               <div className="text-center text-gray-500 py-12">
// // //                 No shops found in this area. Try increasing the radius.
// // //               </div>
// // //             ) : (
// // //               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
// // //                 {filteredShops.map(shop => (
// // //                   <div
// // //                     key={shop._id}
// // //                     onClick={() => navigate(`/shop/${shop._id}`)}
// // //                     className="bg-white rounded-lg shadow p-5 cursor-pointer hover:shadow-md transition"
// // //                   >
// // //                     <div className="flex justify-between items-start mb-2">
// // //                       <h3 className="font-bold text-gray-800 text-lg">{shop.name}</h3>
// // //                       <span className={`text-xs px-2 py-1 rounded-full font-medium ${shop.isOpen
// // //                         ? 'bg-green-100 text-green-700'
// // //                         : 'bg-red-100 text-red-600'
// // //                         }`}>
// // //                         {shop.isOpen ? 'Open' : 'Closed'}
// // //                       </span>
// // //                     </div>
// // //                     <p className="text-sm text-blue-600 font-medium capitalize mb-1">
// // //                       {shop.category}
// // //                     </p>
// // //                     <p className="text-sm text-gray-500 mb-1">
// // //                       {shop.location?.address || shop.location}
// // //                     </p>
// // //                     <p className="text-sm text-gray-600 line-clamp-2">
// // //                       {shop.description}
// // //                     </p>
// // //                     <p className="text-sm text-gray-500 mt-2">{shop.contact}</p>
// // //                   </div>
// // //                 ))}
// // //               </div>
// // //             )}
// // //           </>
// // //         )}
// // //       </div>
// // //     </div>
// // //   )
// // // }

// // // export default Marketplace



import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from '../../api/axios'
import { useAuth } from '../../context/AuthContext'
// import { useCart } from '../../context/CartContext'
import {
  BadgeCheck, ShieldCheck,
  ShoppingCart, UtensilsCrossed, Apple, Croissant, Milk, PenLine, LayoutGrid, Package,
  MapPin, Search, LogOut, ClipboardList, ChevronRight, ShoppingBag, Star, ChevronLeft
} from 'lucide-react'
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet'
import { createPortal } from 'react-dom'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import './Marketplace.css'
import heroBanner from '../../assets/Hero.png'
import GridSection from "../../components/GridSection"
import Navbar from '../../components/Navbar'
import { ArrowUpRight } from "lucide-react";
import Footer from '../../components/Footer'

delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})
const shopIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34],
})
const userIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34],
})

const catColor = { grocery: '#16a34a', food: '#ea580c', fruit: '#dc2626', bakery: '#d97706', dairy: '#2563eb', stationary: '#7c3aed', other: '#64748b' }
const catBg = { grocery: '#f0fdf4', food: '#fff7ed', fruit: '#fef2f2', bakery: '#fffbeb', dairy: '#eff6ff', stationary: '#f5f3ff', other: '#f8fafc' }

// Category images from Unsplash (free, no auth needed)
const CAT_IMAGES = {
  grocery: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=300&q=80',
  food: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=300&q=80',
  fruit: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=300&q=80',
  bakery: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=300&q=80',
  dairy: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=300&q=80',
  stationary: 'https://images.unsplash.com/photo-1456735190827-d1262f71b8a3?w=300&q=80',
  other: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=300&q=80',
}

const CATEGORIES = [
  { id: '', label: 'All', color: '#0f172a', bg: '#f1f5f9', icon: <LayoutGrid size={20} /> },
  { id: 'grocery', label: 'Grocery', color: '#16a34a', bg: '#f0fdf4', icon: <ShoppingCart size={20} /> },
  { id: 'food', label: 'Food', color: '#ea580c', bg: '#fff7ed', icon: <UtensilsCrossed size={20} /> },
  { id: 'fruit', label: 'Fruits', color: '#dc2626', bg: '#fef2f2', icon: <Apple size={20} /> },
  { id: 'bakery', label: 'Bakery', color: '#d97706', bg: '#fffbeb', icon: <Croissant size={20} /> },
  { id: 'dairy', label: 'Dairy', color: '#2563eb', bg: '#eff6ff', icon: <Milk size={20} /> },
  { id: 'stationary', label: 'Stationery', color: '#7c3aed', bg: '#f5f3ff', icon: <PenLine size={20} /> },
  { id: 'other', label: 'Other', color: '#64748b', bg: '#f8fafc', icon: <Package size={20} /> },
]

const ProductCard = ({ product, onClick }) => {
  const rating = product.averageRating || 0;
  const shop = product.shop || {};

  const shopLocation =
    shop.location?.address || "Location not set";

  const category =
    shop.category
      ? shop.category.charAt(0).toUpperCase() +
      shop.category.slice(1)
      : "Local Store";

  const hasImg = !!product.image;

  return (
    <div className="pcard" onClick={onClick}>
      <div className="pcard-img-wrap">
        {hasImg ? (
          <img
            src={product.image}
            alt={product.name}
            className="pcard-img"
          />
        ) : (
          <div
            className="pcard-img-placeholder"
            style={{
              background:
                catBg[shop.category] || "#f1f5f9",
            }}
          >
            <Package
              size={48}
              color={
                catColor[shop.category] || "#94a3b8"
              }
              strokeWidth={1.4}
            />
          </div>
        )}

        <div className="pcard-overlay">

        </div>
      </div>
      <div className="pcard-body">

        <div className="pcard-name">
          {product.name}
        </div>

        <div className="pcard-price">
          ₹{product.price}
          <span className="pcard-unit">
            / {product.unit}
          </span>
        </div>

        {rating > 0 && (
          <div className="pcard-meta">
            <span className="pcard-rating">
              <Star
                size={14}
                fill="#16a34a"
                color="#16a34a"
              />
              {rating.toFixed(1)}
            </span>
          </div>
        )}

        <div className="pcard-category">
          {category}
        </div>

        <div className="pcard-location">
          <MapPin size={13} />
          {shopLocation}
        </div>

      </div>
    </div>
  );
};

const RecenterMap = ({ lat, lng }) => {
  const map = useMap()
  useEffect(() => { if (lat && lng) map.setView([lat, lng], 13) }, [lat, lng])
  return null
}
const MapResizer = ({ expanded }) => {
  const map = useMap()
  useEffect(() => { const t = setTimeout(() => map.invalidateSize(), 300); return () => clearTimeout(t) }, [expanded])
  return null
}

const MapPanel = ({ userLocation, filteredShops, mapExpanded, setMapExpanded, navigate }) => {
  const mapEl = (
    <MapContainer
      center={userLocation ? [userLocation.latitude, userLocation.longitude] : [20.5937, 78.9629]}
      zoom={13}
      style={{ height: '100%', width: '100%' }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; OpenStreetMap' />
      {userLocation && <RecenterMap lat={userLocation.latitude} lng={userLocation.longitude} />}
      <MapResizer expanded={mapExpanded} />
      {userLocation && (
        <>
          <Marker position={[userLocation.latitude, userLocation.longitude]} icon={userIcon}>
            <Popup>📍 You are here</Popup>
          </Marker>
          <Circle center={[userLocation.latitude, userLocation.longitude]} radius={10000}
            pathOptions={{ color: '#22c55e', fillColor: '#22c55e', fillOpacity: 0.04, weight: 1.5 }} />
        </>
      )}
      {filteredShops.map(shop => shop.location?.coordinates && (
        <Marker key={shop._id} position={[shop.location.coordinates[1], shop.location.coordinates[0]]} icon={shopIcon}>
          <Popup>
            <div style={{ minWidth: 160, padding: 6, fontFamily: 'Inter, sans-serif' }}>
              <p style={{ fontWeight: 700, fontSize: 14, marginBottom: 3 }}>{shop.name}</p>
              <p style={{ fontSize: 12, color: catColor[shop.category] || '#64748b', marginBottom: 6 }}>{shop.category}</p>
              <button onClick={() => navigate(`/shop/${shop._id}`)}
                style={{ background: '#22c55e', color: '#fff', border: 'none', padding: '7px 14px', borderRadius: 8, fontSize: 12, cursor: 'pointer', width: '100%', fontWeight: 600 }}>
                View Shop →
              </button>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  )

  const header = (
    <div style={{ background: '#fff', padding: '14px 20px', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: 10 }}>
      <div style={{ width: 30, height: 30, borderRadius: 8, background: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <MapPin size={14} color="#22c55e" />
      </div>
      <span style={{ fontSize: 15, fontWeight: 700, color: '#0f172a', fontFamily: 'Inter, sans-serif' }}>Live Map</span>
      <span style={{ fontSize: 12, color: '#94a3b8', marginLeft: 'auto', marginRight: 12, fontFamily: 'Inter, sans-serif' }}>
        {filteredShops.filter(s => s.location?.coordinates).length} shops
      </span>
      <button onClick={() => setMapExpanded(v => !v)}
        style={{ background: mapExpanded ? '#f1f5f9' : '#f0fdf4', border: 'none', borderRadius: 8, padding: '6px 14px', cursor: 'pointer', fontSize: 12, fontWeight: 700, color: mapExpanded ? '#374151' : '#22c55e', fontFamily: 'Inter, sans-serif' }}>
        {mapExpanded ? '✕ Close' : '⛶ Expand'}
      </button>
    </div>
  )

  if (mapExpanded) return createPortal(
    <>
      <div onClick={() => setMapExpanded(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 998 }} />
      <div style={{ position: 'fixed', inset: 0, zIndex: 999, display: 'flex', flexDirection: 'column', background: '#fff' }}>
        {header}
        <div style={{ flex: 1 }}>{mapEl}</div>
      </div>
    </>,
    document.body
  )

  return (
    <div style={{ overflow: 'hidden', borderRadius: 0 }}>
      {header}
      <div style={{ height: 560 }}>
        {userLocation ? mapEl : (
          <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12, background: '#f8fafc' }}>
            <MapPin size={40} color="#cbd5e1" strokeWidth={1.5} />
            <p style={{ fontSize: 14, color: '#94a3b8', fontFamily: 'Inter, sans-serif' }}>Enable location to see map</p>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Main Component 
export default function Marketplace() {
  const { user, logout } = useAuth()
  // const { totalItems, totalPrice } = useCart()
  const navigate = useNavigate()

  const [shops, setShops] = useState([])
  const [trendingProducts, setTrendingProducts] = useState([])
  const [topRatedProducts, setTopRatedProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [productsLoading, setProductsLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const [userLocation, setUserLocation] = useState(null)
  const [scrolled, setScrolled] = useState(false)
  const [mapExpanded, setMapExpanded] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => { getUserLocation() }, [])
  useEffect(() => { fetchShops() }, [userLocation])
  useEffect(() => { fetchProducts() }, [userLocation])

  useEffect(() => {
    document.body.style.overflow = mapExpanded ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mapExpanded])

  const getUserLocation = () => {
    navigator.geolocation.getCurrentPosition(
      pos => setUserLocation({ latitude: pos.coords.latitude, longitude: pos.coords.longitude }),
      () => { fetchShops(); fetchProducts() }
    )
  }

  const fetchShops = async () => {
    try {
      setLoading(true)
      const params = {}
      if (userLocation) {
        params.latitude = userLocation.latitude
        params.longitude = userLocation.longitude
        params.radius = 10000
      }
      const res = await axios.get('/api/shop/all', { params })
      setShops(res.data.shops)
    } catch (err) { console.error(err) }
    finally { setLoading(false) }
  }

  const fetchProducts = async () => {
    try {
      setProductsLoading(true)
      const params = {}
      if (userLocation) {
        params.latitude = userLocation.latitude
        params.longitude = userLocation.longitude
      }
      const [trendRes, topRes] = await Promise.all([
        axios.get('/api/product/popular', { params }),
        axios.get('/api/product/top-rated', { params })
      ])
      setTrendingProducts(trendRes.data.products || [])
      setTopRatedProducts(topRes.data.products || [])
    } catch (err) { console.error(err) }
    finally { setProductsLoading(false) }
  }

  const filteredShops = shops.filter(shop => {
    const matchSearch = shop.name.toLowerCase().includes(search.toLowerCase()) ||
      (shop.location?.address || '').toLowerCase().includes(search.toLowerCase())
    const matchCat = category === '' || shop.category === category
    return matchSearch && matchCat
  })

  const openShops = filteredShops.filter(s => s.isOpen).length

  return (
    <div style={{ minHeight: '100vh', background: '#fafafa', fontFamily: "'Inter', sans-serif" }}>

      {/* ── Navbar ── */}
      <Navbar
        scrolled={scrolled}
      />

      <section
        className="hero"
        style={{
          backgroundImage: `url(${heroBanner})`
        }}
      >
        <div className="hero-inner">
          <div className="hero-content">

            <h1 className="hero-title">
              Everything you need,
              <br />
              delivered <em>fast.</em>
            </h1>

            <p className="hero-sub">
              Discover nearby stores, compare products, and order directly from
              local vendors in your area.
            </p>

            <div className="hero-btns">
              <button
                className="hero-btn-primary"
                onClick={() =>
                  document
                    .getElementById("trending-section")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
              >
                Start Shopping →
              </button>

              <button
                className="hero-btn-secondary"
                onClick={() =>
                  document
                    .getElementById("map-section")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
              >
                Explore on Map
              </button>
            </div>

          </div>
        </div>
      </section>



      <section className="trust-bar">
        <div className="trust-container">

          <div className="trust-item">
            <div className="trust-number">750+</div>
            <div className="trust-label">Verified Stores</div>
          </div>

          <div className="trust-divider"></div>

          <div className="trust-item">
            <div className="trust-number">18K+</div>
            <div className="trust-label">Products Available</div>
          </div>

          <div className="trust-divider"></div>

          <div className="trust-item">
            <div className="trust-number">92K+</div>
            <div className="trust-label">Orders Delivered</div>
          </div>

          <div className="trust-divider"></div>

          <div className="trust-item">
            <div className="trust-number">99.8%</div>
            <div className="trust-label">Customer Satisfaction</div>
          </div>

        </div>
      </section>



      {/* ── Main content ── */}
      <div className="main">

        {/* ── Section 1: Trending Near You ── */}
        <div id="trending-section">
          <GridSection
            title="🔥 Trending Near You"
            subtitle="Most ordered products from nearby stores"
            items={trendingProducts}
            loading={productsLoading}
            renderItem={(product) => (
              <ProductCard
                product={product}
                onClick={() => navigate(`/product/${product?._id}`)}
              />
            )}
          />
        </div>

        {/* ── Section 2: Top Rated ── */}
        {(topRatedProducts.length > 0 || productsLoading) && (
          <GridSection
            title="⭐ Customer Favorites"
            subtitle="Highest rated products near you"
            items={topRatedProducts}
            loading={productsLoading}
            renderItem={(product) => (
              <ProductCard
                product={product}
                onClick={() => navigate(`/product/${product?._id}`)}
              />
            )}
          />
        )}





        <section className="why-section">

          <div className="why-header">
            <h2 className="why-title">
              Why Hyperlocal?
            </h2>

            <p className="why-sub">
              Designed to connect customers directly with trusted local vendors.
            </p>
          </div>

          <div className="why-grid">

            <div className="why-card">
              <div className="why-icon">⚡</div>

              <div className="why-card-title">
                Faster Delivery
              </div>

              <div className="why-card-text">
                Get products from nearby stores delivered quickly without long wait times.
              </div>
            </div>

            <div className="why-card">
              <div className="why-icon">🏪</div>

              <div className="why-card-title">
                Trusted Vendors
              </div>

              <div className="why-card-text">
                Discover verified local businesses and shop with confidence.
              </div>
            </div>

            <div className="why-card">
              <div className="why-icon">💰</div>

              <div className="why-card-title">
                Better Prices
              </div>

              <div className="why-card-text">
                Compare products from multiple stores and find the best deals nearby.
              </div>
            </div>

          </div>

        </section>

        {/* ── Section 4: Explore Nearby Shops ── */}
        <div className="shops-section" id="shops-section">
          <div className="shops-header">
            <div>
              <div className="section-title">
                🏪 {category ? `${CATEGORIES.find(c => c.id === category)?.label} Shops` : 'Explore Nearby Shops'}
              </div>
              <div className="section-sub">Trusted local stores around you</div>
              {!loading && (
                <div className="results-pills">
                  <span className="results-text"><strong>{filteredShops.length}</strong> shops found</span>
                  <span className="open-badge">{openShops} open now</span>
                </div>
              )}
            </div>
            {category && (
              <button className="see-all" onClick={() => setCategory('')}>
                View all <ChevronRight size={14} />
              </button>
            )}
          </div>

          {loading ? (
            <div className="shops-grid">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="skeleton" style={{ height: 280 }} />
              ))}
            </div>
          ) : filteredShops.length === 0 ? (
            <div className="empty">
              <Search size={48} color="#cbd5e1" strokeWidth={1.5} />
              <p className="empty-title">No shops found</p>
              <p className="empty-sub">Try a different category or clear your search</p>
            </div>
          ) : (
            <div className="shops-grid">
              {filteredShops.map(shop => {
                const color = catColor[shop.category] || '#64748b'
                const bg = catBg[shop.category] || '#f8fafc'
                const hasRating = shop.totalRatings > 0
                return (
                  <div key={shop._id} className="shop-card" onClick={() => navigate(`/shop/${shop._id}`)}>
                    {/* Shop image or colored fallback */}
                    <div className="shop-img-wrap">
                      {shop.image
                        ? <img src={shop.image} alt={shop.name} className="shop-img" />
                        : (
                          <div className="shop-img-fallback" style={{ background: `linear-gradient(135deg, ${bg}, #fff)` }}>
                            {/* big category icon as fallback */}
                            {shop.category === 'grocery' && <ShoppingCart size={48} color={color} strokeWidth={1.2} />}
                            {shop.category === 'food' && <UtensilsCrossed size={48} color={color} strokeWidth={1.2} />}
                            {shop.category === 'fruit' && <Apple size={48} color={color} strokeWidth={1.2} />}
                            {shop.category === 'bakery' && <Croissant size={48} color={color} strokeWidth={1.2} />}
                            {shop.category === 'dairy' && <Milk size={48} color={color} strokeWidth={1.2} />}
                            {shop.category === 'stationary' && <PenLine size={48} color={color} strokeWidth={1.2} />}
                            {(!shop.category || shop.category === 'other') && <Package size={48} color={color} strokeWidth={1.2} />}
                          </div>
                        )
                      }
                      <span className={`shop-open-tag ${shop.isOpen ? 'tag-open' : 'tag-closed'}`}>
                        {shop.isOpen ? '● Open' : '● Closed'}
                      </span>
                    </div>

                    {/* <div className="shop-body">

                      <div className="shop-name">
                        {shop.name}
                      </div>

                      {hasRating && (
                        <div className="shop-rating-row">
                          <Star
                            size={14}
                            fill="#16a34a"
                            color="#16a34a"
                          />
                          <span>{shop.averageRating?.toFixed(1)}</span>

                          <span className="shop-rating-count">
                            ({shop.totalRatings})
                          </span>
                        </div>
                      )}

                      <div
                        className="shop-category"
                        style={{ color }}
                      >
                        {shop.category}
                      </div>

                      <div className="shop-addr">
                        <MapPin size={13} />
                        {shop.location?.address || "Location not set"}
                      </div>

                    </div> */}



                    <div className="shop-body">

                      <div className="shop-title-row">
                        <div className="shop-name">
                          {shop.name}
                        </div>

                        <BadgeCheck
                          size={15}
                          className="verified-icon"
                        />
                      </div>

                      <div
                        className="shop-category-chip"
                        style={{
                          background: bg,
                          color: color
                        }}
                      >
                        {shop.category === "grocery" && <ShoppingCart size={12} />}
                        {shop.category === "food" && <UtensilsCrossed size={12} />}
                        {shop.category === "fruit" && <Apple size={12} />}
                        {shop.category === "bakery" && <Croissant size={12} />}
                        {shop.category === "dairy" && <Milk size={12} />}
                        {shop.category === "stationary" && <PenLine size={12} />}
                        {(!shop.category || shop.category === "other") && (
                          <Package size={12} />
                        )}

                        {shop.category?.charAt(0).toUpperCase() +
                          shop.category?.slice(1)}
                      </div>

                      <div className="shop-addr">
                        <MapPin size={13} />
                        {shop.location?.address || "Location not set"}
                      </div>

                      <div className="shop-bottom">
                        <span className="shop-status">
                          Explore Store
                        </span>

                        <div className="shop-action">
                          <ArrowUpRight size={18} />
                        </div>
                      </div>

                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* ── Map Section ── */}
      <section id="map-section" className="map-section">
        <div className="map-showcase-header">

          <span className="map-badge">
            STORE DISCOVERY
          </span>

          <h2 className="map-heading">
            Explore Nearby Vendors
          </h2>

          <p className="map-text">
            Find local businesses around your location and explore stores directly from the map.
          </p>

        </div>
        <div className="map-shell">
          <MapPanel
            userLocation={userLocation}
            filteredShops={filteredShops}
            mapExpanded={mapExpanded}
            setMapExpanded={setMapExpanded}
            navigate={navigate}
          />
        </div>
      </section>





      {/* ── Footer ── */}
      <Footer />
    </div>
  )
}