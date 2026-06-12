const multer = require('multer')
const { CloudinaryStorage } = require('multer-storage-cloudinary')
const cloudinary = require('../lib/cloudinary')

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => ({
    folder: 'hyperlocal',          // Folder in cloudinary
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [{ width: 800, height: 800, crop: 'limit', quality: 'auto' }]
  })
})

const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10 MB
  }
})

module.exports = upload