const LoadProductService = require("../services/loadProductService")
const LoadOrderService = require("../services/loadOrderService")

const User = require('../models/user')
const Order = require('../models/order')

const Cart = require('../../lib/cart')
const mailer = require('../../lib/mailer')


const email = (seller, product, buyer) => `
  <h2>Olá ${seller.name}</h2>
  <p>Você tem um novo pedido de compra do seu produto</p>
  <p>Produto: ${product.name}</p>
  <p>Preço: ${product.formattedPrice}</p>
  <p><br/><br/></p>
  <h3>Dados do comprador</h3>
  <p>${buyer.name}</p>
  <p>${buyer.email}</p>
  <p>${buyer.address}</p>
  <p>${buyer.cep}</p>
  <p><br/><br/></p>
  <p><strong>Entre em contato com o comprador para finalizar a venda!</strong></p>
  <p><br/><br/></p>
  <p>Atenciosamente, Equipe Launchstore</p>
`

module.exports = {
  async index (req, res) {
    // Pegar os pedidos do usuário
    const orders = await LoadOrderService.load('orders', {
      where: {buyer_id: req.session.userId}
    })

    return res.render('orders/index', { orders })
  },

  async sales (req, res) {
    // Pegar os pedidos do usuário
    const sales = await LoadOrderService.load('orders', {
      where: {seller_id: req.session.userId}
    })

    return res.render('orders/sales', { sales })
  },

  async show (req, res) {

    console.log(req.params)

    const order = await LoadOrderService.load('order', {
      where: {product_id: req.params.id}
    })

    return res.render('orders/details', { order })
  },

  async post(req, res) {
    try {
      // Pegar todos produtos do carrinho
      const cart = Cart.init(req.session.cart)

      const buyer_id = req.session.userId
      const filteredItems = cart.items.filter(item =>
        item.product.user_id != buyer_id
      )

      // Criar pedido de compra
      const createOrdersPromise = filteredItems.map(async item => {
        let { product, price: total, quantity } = item
        const { id: product_id, price, user_id: seller_id } = product
        const status = "open"

        const order = await Order.create({
          seller_id,
          buyer_id,
          product_id,
          price,
          total,
          quantity,
          status
        })

        // Pegar os dados do produto
        product = await LoadProductService.load('product', {
          where: { id: product_id }
        })

        // Pegar os dados do vendedor
        const seller = await User.findOne({ where: { id: seller_id } })

        // Pegar os dados do comprador
        const buyer = await User.findOne({ where: { id: buyer_id } })

        // Enviar email com dados da compra para o vendedor
        await mailer.sendMail({
          to: seller.email,
          from: 'no-reply@launchstore.com.br',
          subject: 'Novo pedido de compra',
          html: email(seller, product, buyer)
        })

        return order
      })

      await Promise.all(createOrdersPromise)

      // Limpar o carrinho após o pedido
      delete req.session.cart
      Cart.init()

      // Notificar o usuário com alguma mensagem de sucesso
      return res.render('orders/success')

    } catch (err) {

      console.error(err)
      // Notificar o usuário com alguma mensagem de erro
      return res.render('orders/error')

    }
  }
}
