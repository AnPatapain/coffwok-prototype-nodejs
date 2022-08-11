const {
    campgroundSchema,
    reviewSchema
} = require('./schema')

const Campground = require('./models/coffeeShop')

const ExpressError = require('./utils/ExpressError')

const Profile = require('./models/profile')
const User = require('./models/user')

const ObjectId = require('mongoose').Types.ObjectId

// userRoute middleware
module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        // req.session.returnTo = req.originalUrl
        req.flash('error', 'You must be signed in first!');
        return res.redirect('/login');
    }
    next();
}

module.exports.hasProfile = (req, res, next) => {
    const {
        coffeeShopID
    } = req.query

    if (!req.user.profile) {
        req.flash('error', 'sorry you didnt have a profile. Please create a profile to connect')
        return res.redirect(`/coffeeShops/${coffeeShopID}`)
    }

    next()
}

module.exports.hasRequested = async (req, res, next) => {
    const {
        senderID,
        coffeeShopID
    } = req.query

    const {
        receiverID
    } = req.params
    const receiver = await User.findById(receiverID)
    receiver.reqConnects.forEach((req) => {
        if (req.senderID.equals(senderID)) {
            // req.flash('error', `You have sent request to ${receiver.profile.name}`)
            // return res.redirect(`/coffeeShops/${coffeeShopID}`)
            return res.redirect(`/coffeeShops/${coffeeShopID}`)
        }
    })
    next()
}

//campgroundRoute middleware
module.exports.validateCampground = (req, res, next) => {
    console.log(req.body)
    console.log(req.files)
    const result = campgroundSchema.validate(req.body)
    if (result.error) {
        // const redirectUrl = req.session.returnTo
        // const msg = result.error.details.map(e => e.message).join()
        // req.flash('error', msg)
        // res.redirect(redirectUrl)
        const msg = result.error.details.map(e => e.message).join()
        throw new ExpressError(msg, 402)
    } else {
        next()
    }
}

//reviewRoute middleware
module.exports.validateReview = (req, res, next) => {
    const result = reviewSchema.validate(req.body)
    if (result.error) {
        const msg = result.error.details.map(e => e.message).join()
        throw new ExpressError(msg, 402)
    } else {
        next()
    }
}

//campgroundRoute middleware
module.exports.isAuthor = async (req, res, next) => {
    const {
        id
    } = req.params
    if (!ObjectId.isValid(id)) {
        req.flash('error', 'Sorry we can not find this review')
        return res.redirect('/campgrounds')
    }
    const campground = await Campground.findById(id)
    if (!campground) {
        req.flash('error', 'Sorry we can not find this campground')
        return res.redirect('/campgrounds')
    }
    if (!campground.author.equals(req.user._id)) {
        req.flash('error', 'Sorry this campground is posted by other camper')
        return res.redirect(`/campgrounds/${id}`)
    }
    next()
}

//reviewRoute middleware
module.exports.isReviewAuthor = async (req, res, next) => {
    const {
        id,
        reviewID
    } = req.params
    if (!ObjectId.isValid(reviewID)) {
        req.flash('error', 'Sorry we can not find this review')
        return res.redirect('/campgrounds')
    }
    const review = await Review.findById(reviewID)
    if (!review) {
        req.flash('error', 'Sorry we can not find this review')
        return res.redirect('/campgrounds')
    }
    if (!req.user._id.equals(review.author)) {
        req.flash('error', 'Sorry you are not a owner of this review')
        return res.redirect(`/campgrounds/${id}`)
    }
    next()
}