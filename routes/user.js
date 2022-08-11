const express = require('express')
const User = require('../models/user')
const passport = require('passport')
const router = express.Router()

const users = require('../controllers/users')

router.route('/register')
    .get(users.renderRegister)
    .post(users.register)

router.route('/login')
    .get(users.renderLogin)
    .post(passport.authenticate('local', {
        failureFlash: true,
        failureRedirect: '/login',
        keepSessionInfo: true
    }), users.login)

router.get('/logout', users.logout)

module.exports = router