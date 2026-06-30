# Hyperlocal Vendor Platform

A full-stack hyperlocal marketplace connecting customers with nearby local shops for fast delivery of groceries, food, dairy, bakery, and daily essentials — within a 10km radius.


## Features

**Customer**
- Browse and search nearby shops by category and location (10km radius)
- Interactive map view with real-time shop markers (Leaflet)
- Cart with single-shop restriction enforced on the frontend
- Razorpay payment with HMAC signature verification on the backend
- Track order status: pending → accepted → completed / rejected
- Submit shop and per-product star ratings after order completion

**Vendor**
- Create and manage a shop with GPS coordinates and image upload
- Add, edit, and delete products with stock tracking
- Accept, reject, or complete incoming orders
- Analytics dashboard: today's sales, total revenue, pending orders, best-selling product

---

## Tech Stack

**Frontend:** React, Vite, Tailwind CSS, React Router v6, Axios, Leaflet, Lucide React

**Backend:** Node.js, Express, MongoDB, Mongoose, JWT, Razorpay, Cloudinary, Multer

---

## Core Modules

- Authentication & Authorization (JWT + bcryptjs)
- Shop Management (geospatial queries with MongoDB 2dsphere index)
- Product Management
- Order Management (Razorpay two-step payment flow)
- Reviews & Ratings (per-shop and per-product, recalculated on every submission)
- Vendor Analytics
- Image Uploads (Cloudinary via Multer)


## Key Business Rules

- **10km order radius** — enforced server-side during payment verification using the Haversine formula; orders beyond 10km are rejected even if payment succeeds.
- **Stock deducted on acceptance** — stock is only reduced when a vendor accepts an order, not at placement time.
- **Single-shop cart** — customers cannot mix items from different shops in one session.
- **Review eligibility** — only allowed once per `completed` order; duplicate attempts are blocked at both the application and database level (unique index).
- **Rating recalculation** — shop and product average ratings are recalculated via MongoDB aggregation after every review submission.

---

## Deployment

| Service | Platform |
|---|---|
| Frontend | Vercel |
| Backend | Render |
