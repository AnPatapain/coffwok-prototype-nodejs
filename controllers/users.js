const User = require('../models/user')

module.exports.renderRegister = (req, res) => {
    res.render('users/register')
}

module.exports.register = async (req, res) => {
    const {
        username,
        email,
        password
    } = req.body

    try {
        const user = new User({
            username,
            email
        })
        const regisUser = await User.register(user, password)
        req.login(regisUser, function (err) {
            if (err) {
                return next(err)
            }
            req.flash('success', 'Welcome to Coffee Shops')
            res.redirect('/coffeeShops')
        })

    } catch (err) {
        req.flash('error', err.message)
        res.redirect('/register')
    }
}

module.exports.renderLogin = async (req, res) => {
    res.render('users/login')
}

module.exports.login = (req, res) => {
    req.flash('success', 'Welcome back to coffee shops')
    const redirectUrl = req.session.returnTo || '/coffeeShops'
    delete req.session.returnTo
    res.redirect(redirectUrl)
}

module.exports.logout = (req, res) => {
    req.logout(function (err) {
        if (err) {
            next(err)
        }
        req.flash('success', 'Goodbye bonne journee')
        console.log(req.session)
        res.redirect('/coffeeShops')
    })
}