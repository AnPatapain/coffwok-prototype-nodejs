const express = require('express')
const router = express.Router({
    mergeParams: true
})
const catchAsync = require('../utils/catchAsync')
const {
    validateReview,
    isLoggedIn,
    isReviewAuthor
} = require('../middleware')

const {
    upload
} = require('../Cloudinary/index')

const profiles = require('../controllers/profiles')

//http://localhost:3000/coffeeShops/62d389609baa2ef5b86c51b7/profiles

// router.post('/', isLoggedIn, validateReview, catchAsync(reviews.createReview))

router.get('/new', isLoggedIn, profiles.renderNewForm)

router.post('/', isLoggedIn, upload.single('image'), catchAsync(profiles.createProfile))

// router.delete('/:userID', isLoggedIn, catchAsync(profiles.deleteProfile))

router.route('/:userID')
    .get(isLoggedIn, catchAsync(profiles.index))
    .delete(isLoggedIn, catchAsync(profiles.deleteProfile))
    .put(isLoggedIn, upload.single('image'), catchAsync(profiles.updateProfile))

router.get('/:userID/edit', isLoggedIn, catchAsync(profiles.renderEditForm))

// router.delete('/:reviewID', isLoggedIn, isReviewAuthor, catchAsync(reviews.deleteReview))

module.exports = router