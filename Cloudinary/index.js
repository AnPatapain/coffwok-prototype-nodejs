const cloudinary = require('cloudinary').v2
const {
    CloudinaryStorage
} = require('multer-storage-cloudinary')
const multer = require('multer')

// config for cloudinary 
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET
})

// create new storage on cloudinary
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "Coffwok",
        allowed_formats: ['jpeg', 'png', 'jpg']
    }
})

//tell multer middleware we want to upload image to cloudinary
const upload = multer({
    storage: storage
})

// module.exports.upload = upload

module.exports = {
    upload,
    cloudinary
}