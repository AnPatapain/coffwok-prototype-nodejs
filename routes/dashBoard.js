const express = require('express')
const router = express.Router({
    mergeParams: true
})
const dashBoard = require('../controllers/dashBoard')

router.route('/')
    .get(dashBoard.index)
    .delete(dashBoard.deleteProfile)

router.route('/edit')
    .get(dashBoard.renderEditForm)
module.exports = router