const express = require('express')
const router = express.Router()
const catchAsync = require('../utils/catchAsync')
const {
    isLoggedIn,
    validateCampground,
    isAuthor
} = require('../middleware')

const {
    upload
} = require('../Cloudinary/index')

const coffeeShops = require('../controllers/coffeeShops')

router.route('/')
    .get(catchAsync(coffeeShops.index))
    // .post(upload.array('image'), (req, res) => {
    //     console.log(req.files)
    //     res.send('hehe ok')
    // })
    .post(isLoggedIn, upload.array('image'), validateCampground, catchAsync(coffeeShops.createCampground))


router.get('/new', isLoggedIn, coffeeShops.renderNewForm)

router.route('/:id')
    .get(catchAsync(coffeeShops.showCoffeeShop))
    .put(isLoggedIn, isAuthor, upload.array('image'), validateCampground, catchAsync(coffeeShops.updateCampground))
    .delete(isLoggedIn, isAuthor, catchAsync(coffeeShops.deleteCampground))

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(coffeeShops.renderEditForm))


module.exports = router