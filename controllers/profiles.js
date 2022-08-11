const CoffeeShop = require('../models/coffeeShop')
const User = require('../models/user')

const {
    dailyTasks
} = require('../seeds/dailyTask')

module.exports.index = async (req, res) => {
    const {
        userID
    } = req.params
    res.send(userID)
}

module.exports.renderNewForm = async (req, res) => {
    const {
        id
    } = req.params
    const coffeeShop = await CoffeeShop.findById(id)
    if (coffeeShop.users.includes(req.user._id)) {
        req.flash('success', 'You have already profile in this coffee shop')
        return res.redirect(`/coffeeShops/${id}`)
    }
    if (req.user.profile) {
        coffeeShop.users.push(req.user._id)
        req.user.coffeeShops.push(coffeeShop._id)
        await coffeeShop.save()
        await req.user.save()
        return res.redirect(`/coffeeShops/${id}`)
    }
    res.render('profiles/new', {
        coffeeShop,
        dailyTasks
    })
}


module.exports.createProfile = async (req, res) => {
    const {
        id
    } = req.params
    const coffeeShop = await CoffeeShop.findById(id)

    const user = await User.findById(req.user._id)

    user.profile = req.body.profile

    if (req.body.dailyTasks) {
        req.body.dailyTasks.forEach((task) => {
            user.profile.dailyTask.push(task)
        })
    }

    user.coffeeShops.push(coffeeShop._id)

    let {
        path,
        filename
    } = req.file

    user.profile.images = {
        path,
        filename
    }

    coffeeShop.users.push(user._id)

    await user.save()
    await coffeeShop.save()

    console.log('coffeeShop and User in profile controllers')
    console.log(coffeeShop)
    console.log(user)

    res.redirect(`/coffeeShops/${id}`)
}

module.exports.deleteProfile = async (req, res) => {
    const {
        id,
        userID
    } = req.params

    const coffeeShop = await CoffeeShop.findByIdAndUpdate(id, {
        $pull: {
            users: userID
        }
    })

    await User.findByIdAndUpdate(userID, {
        $pull: {
            coffeeShops: coffeeShop._id
        }
    })


    req.flash('success', `Successfully deleted your profile in ${coffeeShop.title}`)
    res.redirect(`/coffeeShops/${id}`)
}

module.exports.renderEditForm = async (req, res) => {
    const {
        id,
        userID
    } = req.params
    const coffeeShop = await CoffeeShop.findById(id)
    const user = await User.findById(userID)
    res.render('profiles/edit', {
        user,
        coffeeShop,
        dailyTasks
    })
}

module.exports.updateProfile = async (req, res) => {
    const {
        id,
        userID
    } = req.params

    const user = await User.findByIdAndUpdate(userID, {
        profile: req.body.profile
    }, {
        returnDocument: 'after'
    })

    if (req.body.dailyTasks) {
        while (user.profile.dailyTask.length !== 0) {
            user.profile.dailyTask.pop()
        }

        req.body.dailyTasks.forEach((task) => {
            user.profile.dailyTask.push(task)
        })
    } else {
        req.flash('error', "you haven't tell us your daily tasks")
    }

    let {
        path,
        filename
    } = req.file

    user.profile.images = {
        path,
        filename
    }

    await user.save()

    req.flash('success', 'Successfully updated your profile')
    res.redirect(`/coffeeShops/${id}`)
}