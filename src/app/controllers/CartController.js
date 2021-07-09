
const Cart = require('../../lib/cart')
const LoadProductService = require("../services/loadProductService")

module.exports = {
  async index(req, res) {
    try {

      const product = await LoadProductService.load('product', {where: {id: 25}})

      let { cart } = req.session

      cart = Cart.init(cart).addOne(product)

      return res.render('cart/index',  { cart })

    } catch(err) {

      console.error(err)

    }
  }
}
