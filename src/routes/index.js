const express = require('express')
const routes = express.Router()

const HomeController = require('../app/controllers/HomeController')
const products = require('./products')
const users = require('./users')

// HOME
routes.get('/', HomeController.index)

// PRODUCTS
routes.use('/products', products)

// USERS
routes.use('/users', users)

// ALIAS
routes.get('/ads/create', function(req, res) {
  return res.redirect('/products/create')
})

routes.get('/accounts', function(req, res) {
  return res.redirect('/users/login')
})


module.exports = routes
