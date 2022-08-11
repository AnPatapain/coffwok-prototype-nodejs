const CoffeeShop = require('../models/coffeeShop')
const ObjectId = require('mongoose').Types.ObjectId
const {
    cloudinary
} = require('../Cloudinary/index')
const sanitizeHtml = require('sanitize-html')

module.exports.index = async (req, res) => {
    const coffeeShops = await CoffeeShop.find()
    res.render('coffeeShops/index', {
        coffeeShops
    })
}

module.exports.renderNewForm = (req, res) => {
    res.render('campgrounds/new')
}

module.exports.createCampground = async (req, res, next) => {
    const campground = new Campground(req.body.campground)
    campground.author = req.user._id
    campground.images = req.files.map(({
        path,
        filename
    }) => {
        let img = new Object()
        img.url = path
        img.filename = filename
        return img
    })
    console.log(campground)
    await campground.save()
    req.flash('success', 'Successfully made a new campground')
    res.redirect(`/campgrounds/${campground._id}`)
}

module.exports.showCoffeeShop = async (req, res) => {
    const {
        id
    } = req.params
    if (!ObjectId.isValid(id)) {
        req.flash('error', 'Sorry we can not find this coffee shop')
        return res.redirect('/coffeeShops')
    }
    const coffeeShop = await CoffeeShop.findById(id).populate('users')
    //const campground = await Campground.findById(id).populate('reviews').populate('author')
    if (!coffeeShop) {
        req.flash('error', 'Sorry we can not find this coffee shop')
        return res.redirect('/coffeeShops')
    }
    let firstUser = undefined
    console.log('coffeeShop in coffeeshop controllers')
    console.log(coffeeShop.users)
    coffeeShop.users.forEach((user) => {
        if (req.user && req.user.profile && user._id.equals(req.user._id)) {
            const {
                _id,
                profile
            } = user
            firstUser = {
                _id,
                profile
            }
        }
    })

    console.log(firstUser)
    res.render('coffeeShops/show', {
        coffeeShop,
        firstUser
    })
}

module.exports.renderEditForm = async (req, res) => {
    const {
        id
    } = req.params
    if (!ObjectId.isValid(id)) {
        req.flash('error', 'Sorry we can not find this campground')
        return res.redirect('/campgrounds')
    }
    const campground = await Campground.findById(id)
    if (!campground) {
        req.flash('error', 'Sorry we can not find this campground')
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/edit', {
        campground
    })
}

module.exports.updateCampground = async (req, res) => {
    console.log(req.body)
    const {
        id
    } = req.params
    const campground = await Campground.findByIdAndUpdate(id, {
        ...req.body.campground
    })
    const addImgs = req.files.map(({
        path,
        filename
    }) => {
        let img = new Object()
        img.url = path
        img.filename = filename
        return img
    })
    campground.images.push(...addImgs)
    await campground.save()
    if (req.body.deleteImgs) {
        // Delete in mongodb
        await campground.updateOne({
            $pull: {
                images: {
                    filename: {
                        $in: req.body.deleteImgs
                    }
                }
            }
        })
        // Delete in cloudinary
        for (fileName of req.body.deleteImgs) {
            await cloudinary.uploader.destroy(fileName)
        }

    }
    req.flash('success', 'Successfully updated')
    res.redirect(`/campgrounds/${id}`)
}

module.exports.deleteCampground = async (req, res) => {
    const {
        id
    } = req.params
    await Campground.findByIdAndDelete(id)
    req.flash('success', 'Successfully deleted')
    res.redirect('/campgrounds')
}