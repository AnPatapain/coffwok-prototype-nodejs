const User = require('../models/user')

module.exports.indexRequests = async (req, res) => {
    const {
        userID
    } = req.params
    const receiver = await User.findById(userID).populate({
        path: 'reqConnects',
        populate: {
            path: 'senderID',
            populate: {
                path: 'profile'
            }
        }
    })

    // res.send('index Request route')
    res.render('connects/myRequests', {
        receiver
    })
}

module.exports.reqCardForm = async (req, res) => {
    const {
        senderID,
        coffeeShopID
    } = req.query

    const {
        receiverID
    } = req.params

    const receiver = await User.findById(receiverID).populate('profile')
    const sender = await User.findById(senderID).populate('profile')

    if (!sender) {
        return res.redirect(`/coffeeShops/${coffeeShopID}`)
    }


    res.render('connects/reqCard', {
        receiver,
        sender,
        coffeeShopID
    })
}

module.exports.sendRequest = async (req, res) => {
    const {
        receiverID
    } = req.params

    const {
        senderID,
        coffeeShopID
    } = req.query
    const receiver = await User.findById(receiverID).populate('profile')
    const sender = await User.findById(senderID).populate('profile')

    const reqConnect = {
        senderID,
        message: req.body.message
    }
    receiver.reqConnects.push(reqConnect)
    sender.sentReqs.push(receiverID)
    await receiver.save()
    await sender.save()

    req.flash('success', `Successfully send invite card to ${receiver.profile.name}`)
    res.redirect(`/coffeeShops/${coffeeShopID}`)
}

module.exports.accept = async (req, res) => {
    const {
        receiverID
    } = req.params
    const {
        senderID
    } = req.query
    const receiver = await User.findById(receiverID)
    const sender = await User.findById(senderID)

    if (!receiver.networks.includes(senderID)) {
        receiver.networks.push(senderID)
    }
    if (!sender.networks.includes(receiverID)) {
        sender.networks.push(receiverID)
    }
    receiver.reqConnects = receiver.reqConnects.filter((req) => {
        req.senderID != senderID
    })
    sender.reqConnects = sender.reqConnects.filter((req) => {
        req.senderID != receiverID
    })
    sender.sentReqs = sender.sentReqs.filter((req) => {
        return !req.equals(receiverID)
    })

    await receiver.save()
    await sender.save()
    req.flash('success', `${sender.profile.name} now is in your networks. Check to see ${sender.profile.name}'s contact`)

    res.redirect(`/connects/networks/${receiverID}`)
}

module.exports.indexNetworks = async (req, res, next) => {
    const {
        receiverID
    } = req.params
    const receiver = await User.findById(receiverID).populate('networks')
    res.render('connects/myNetworks', {
        receiver
    })
}