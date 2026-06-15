import { StrictMode } from 'react'
import React from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { CartProvider } from './context/CartContext.jsx'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'


createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <CartProvider>
      <ToastContainer position="top-right" autoClose={3000} />
      <App />
    </CartProvider>
  </React.StrictMode>
)
