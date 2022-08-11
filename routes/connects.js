const express = require('express')

const connects = require('../controllers/connects')
const catchAsync = require('../utils/catchAsync')
const {
    isLoggedIn,
    hasProfile,
    hasRequested
} = require('../middleware')
const router = express.Router({
    mergeParams: true
})

router.route('/connects/requests/:userID')
    .get(catchAsync(connects.indexRequests))

router.route('/connects/accept/:receiverID')
    .post(catchAsync(connects.accept))

router.route('/connects/networks/:receiverID')
    .get(catchAsync(connects.indexNetworks))

router.route('/connects/:receiverID')
    .get(isLoggedIn, hasProfile, hasRequested, catchAsync(connects.reqCardForm))
    .post(isLoggedIn, hasProfile, hasRequested, catchAsync(connects.sendRequest))


module.exports = router