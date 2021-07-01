const LoadProductService = require("../services/loadProductService")
const User = require('../models/User')

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
  async post(req, res) {
    try {
      // Pegar os dados do produto
      const  product = await LoadProductService.load('product', {
        where: { id: req.body.id }
      })

      // Pegar os dados do vendedor
      const seller = await User.findOne({where: {id: product.user_id}})

      // Pegar os dados do comprador
      const buyer = await User.findOne({where: {id: req.session.userId}})

      // Enviar email com dados da compra para o vendedor
      await mailer.sendMail({
        to: seller.email,
        from: 'no-reply@launchstore.com.br',
        subject: 'Novo pedido de compra',
        html: email(seller, product, buyer)
      })

      // Notificar o usuário com alguma mensagem de sucesso
      return res.render('orders/success')

    } catch(err) {

      console.error(err)
      // Notificar o usuário com alguma mensagem de erro
      return res.render('orders/error')

    }
  }
}
