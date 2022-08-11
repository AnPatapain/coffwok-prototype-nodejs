const mongoose = require('mongoose')
const Review = require('./profile')
const Schema = mongoose.Schema

// const imageSchema = new Schema({
//     url: String,
//     filename: String
// })
//         https://res.cloudinary.com/du7mbtyzp/image/upload/v1656327037/YELP_CAMP/pbtug3rsscypga8q7nii.jpg
// imageSchema.virtual('thumbnail').get(function () {
//     return this.url.replace('/upload', '/upload/c_fill,h_500,w_500')
// })

const coffeeSchema = new Schema({
    title: String,
    images: String,
    city: String,
    address: String,
    description: String,
    users: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }]
})

// const campgroundSchema = new Schema({
//     title: String,
//     images: [imageSchema],
//     price: Number,
//     description: String,
//     location: String,
//     author: {
//         type: Schema.Types.ObjectId,
//         ref: 'User'
//     },
//     reviews: [{
//         type: Schema.Types.ObjectId,
//         ref: 'Review'
//     }]
// })

//doc is document (campground instance) that was deleted
// campgroundSchema.post('findOneAndDelete', async function (doc) {
//     if (doc.reviews.length) {
//         await Review.deleteMany({
//             _id: {
//                 $in: doc.reviews
//             }
//         })
//     }
// })

// const Campground = mongoose.model('Campground', campgroundSchema)

// module.exports = Campground

const CoffeeShop = mongoose.model('CoffeeShop', coffeeSchema)
module.exports = CoffeeShop