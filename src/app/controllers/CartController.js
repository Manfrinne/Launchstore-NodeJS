
const Cart = require('../../lib/cart')
const LoadProductService = require("../services/loadProductService")

module.exports = {
  async index(req, res) {
    try {

      let { cart } = req.session

      cart = Cart.init(cart)

      return res.render('cart/index',  { cart })

    } catch(err) {

      console.error(err)

    }
  },
  async addOne(req, res) {
    try {
      // Pegar o id do produto e pegar o produto
      const { id } = req.params
      const product = await LoadProductService.load('product', {where: { id }})

      // Pegar o carrinho da sessão
      let { cart } = req.session

      // Adicionar o produto ao carrinho (Usando o gerenciador de carrinho)
      cart = Cart.init(cart).addOne(product)

      // Atualizar o carrinho da sessão
      req.session.cart = cart

      // Redirecionar o usuário para tela do carrinho
      return res.redirect('/cart')

    } catch(err) {

      console.error(err)

    }
  },
  removeOne(req, res) {
    try {
      // Pegar o id do produto
      let { id } = req.params

      // Pegar o carrinho da sessão
      let { cart } = req.session

      // Se não houver carrinho, retornar
      if (!cart) return res.redirect('/cart')

      // Iniciar carrinho (gerenciador de carrinho) e remover
      cart = Cart.init(cart).removeOne(id)

      // Atualizar o carrinho da sessão, removendo 1 item
      req.session.cart = cart

      // redirecionar para a página Cart
      return res.redirect('/cart')

    } catch(err) {

      console.error(err)

    }
  },
  delete(req, res) {
    try {
      // Pegar o id do produto
      let { id } = req.params

      // Pegar o carrinho da sessão
      let { cart } = req.session

      // Se não houver carrinho, retornar
      if (!cart) return res.redirect('/cart')

      // Iniciar carrinho (gerenciador de carrinho) e remover
      cart = Cart.init(cart).delete(id)

      // Atualizar o carrinho da sessão, removendo 1 item
      req.session.cart = cart

      // redirecionar para a página Cart
      return res.redirect('/cart')

    } catch(err) {

      console.error(err)

    }
  }
}
