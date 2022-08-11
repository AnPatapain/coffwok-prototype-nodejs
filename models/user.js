const mongoose = require('mongoose')
const passportLocalMongoose = require('passport-local-mongoose')
const {
    Schema
} = mongoose

const imageSchema = new Schema({
    path: String,
    filename: String
})

imageSchema.virtual('thumbnail').get(function () {
    return this.path.replace('/upload', '/upload/c_fill,h_400,w_300')
})

imageSchema.virtual('round').get(function () {
    return this.path.replace('/upload', '/upload/c_crop,g_face,h_400,w_400/c_scale,w_40,h_40')
})


const profileSchema = new Schema({
    name: String,
    age: Number,
    contact: String,
    images: imageSchema,
    dailyTask: [String],
    description: String
})

const userSchema = new Schema({
    profile: profileSchema,
    reqConnects: [{
        senderID: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        },
        message: String
    }],
    sentReqs: [{
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
    email: {
        type: String,
        required: true,
        unique: true
    }
})

userSchema.plugin(passportLocalMongoose)

const User = mongoose.model('User', userSchema)
module.exports = User