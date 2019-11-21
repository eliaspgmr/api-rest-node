const express = require('express')
const authMid = require('../midlewares/auth')

const router = express.Router()

router.use(authMid)

router.get('/', (req, res) => {
    return res.send({ userID: req.userId })
})

module.exports = app => app.use('/projects', router)
