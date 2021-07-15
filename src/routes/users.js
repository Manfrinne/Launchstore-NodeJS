const express = require('express')
const routes = express.Router()

const SessionController = require('../app/controllers/SessionController')
const UserController = require('../app/controllers/UserController')
const OrderController = require('../app/controllers/OrderController')

const UserValidator = require('../app/validators/user')
const SessionValidator = require('../app/validators/session')

const { ifLoggedRedirectToUsers, onlyUsers } = require('../app/middlewares/session')

// USER REGISTER UserController
routes.get('/register', UserController.registerForm)
routes.post('/register', UserValidator.post, UserController.post)
routes.get('/', onlyUsers,  UserValidator.show, UserController.show)
routes.put('/', UserValidator.update, UserController.update)
routes.delete('/', UserController.delete)

routes.get('/ads', UserController.ads)

// routes.get('/orders', (req, res) => res.render('orders/success'))

// LOGIN/LOGOUT
routes.get('/login', ifLoggedRedirectToUsers, SessionController.loginForm)
routes.post('/login', SessionValidator.login, SessionController.login)
routes.post('/logout', SessionController.logout)

// RESET PASSWORD/FORGOT
routes.get('/forgot-password', SessionController.forgotForm)
routes.post('/forgot-password', SessionValidator.forgot, SessionController.forgot)
routes.get('/password-reset', SessionController.resetForm)
routes.post('/password-reset', SessionValidator.reset, SessionController.reset)


module.exports = routes
