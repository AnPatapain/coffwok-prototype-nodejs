const CoffeeShop = require('../models/coffeeShop')
const User = require('../models/user')

module.exports.index = async (req, res, next) => {
    const {
        userID
    } = req.params
    const user = await User.findById(userID).populate({
        path: 'profile',
        populate: {
            path: 'reqConnects',
            populate: {
                path: 'senderID',
                populate: {
                    path: 'profile'
                }
            }
        }
    })

    res.render('dashBoard/index', {
        user
    })
}

module.exports.renderEditForm = async (req, res, next) => {
    res.send('edit route')
}

module.exports.deleteProfile = async (req, res, next) => {
    const {
        userID
    } = req.params
    const user = await User.findById(userID).populate('profile')
    for (let coffeeShopID of user.coffeeShops) {
        let coffeeShop = await CoffeeShop.findById(coffeeShopID)
        coffeeShop.users = coffeeShop.users.filter(user => !user.equals(userID))
        console.log(coffeeShop)
        await coffeeShop.save()
    }

    for (let senderID of user.reqConnects) {
        let sender = await User.findById(senderID)
        sender.sentReqs = sender.sentReqs.filter(id => !id.equals(userID))
        await sender.save()
    }

    for (let receiverID of user.sentReqs) {
        let receiver = await User.findById(receiverID)
        receiver.reqConnects = receiver.reqConnects.filter(sender => !sender.senderID.equals(user._id))
        await receiver.save()
    }

    for (let networkID of user.networks) {
        let networker = await User.findById(networkID)
        networker.networks = networker.networks.filter(networkID => !networkID.equals(user._id))
        await networker.save()
    }
    user.reqConnects = []
    user.networks = []
    user.coffeeShops = []
    user.sentReqs = []
    user.profile = undefined
    await user.save()
    console.log(user)
    req.flash('success', 'successfully deleted')
    res.redirect('/coffeeShops')
}