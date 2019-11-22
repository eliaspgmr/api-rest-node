const express = require('express')
const authMid = require('./app/midlewares/auth')
// Controllers
const authController    = require('./app/controllers/authController')
const projectController = require('./app/controllers/projectController')

// Router
const routes = express.Router()

//routes.use(authMid)

/**
 * Test routes
 *
 * routes.get('/', (req, res) => {
 *     return res.json({ message: 'Hello, Elias!' })
 * })
 */

routes.use('/projects', authMid)

routes.get('/projects', projectController.projects)
routes.post('/auth/register', authController.register)
routes.post('/auth/authenticate', authController.login)
routes.post('/auth/forgot_password', authController.forgotPassword)
routes.post('/auth/reset_password', authController.resetPassword)

module.exports = routes
