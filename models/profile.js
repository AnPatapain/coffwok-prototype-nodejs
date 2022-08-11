const mongoose = require('mongoose')
const {
    Schema
} = mongoose

const imageSchema = new Schema({
    url: String,
    filename: String
})

imageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/c_fill,h_500,w_400')
})

const profileSchema = new Schema({
    name: String,
    age: Number,
    contact: String,
    images: imageSchema,
    dailyTask: [String],
    reqConnects: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    networks: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    coffeeShops: [{
        type: Schema.Types.ObjectId,
        ref: 'CoffeeShop'
    }],
    description: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
})

const Profile = mongoose.model('Profile', profileSchema)
module.exports = Profile