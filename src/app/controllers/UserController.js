const { hash } = require('bcryptjs')
const { unlinkSync } = require('fs')

const User = require('../models/User')
const Product = require('../models/Product')

const { formatCpfCnpj, formatCep } = require('../../lib/utils')

module.exports = {
  async registerForm(req, res) {
    return res.render('user/register')
  },

  async show(req, res) {
    try {

      const { user } = req

      user.cpf_cnpj = formatCpfCnpj(user.cpf_cnpj)
      user.cep = formatCep(user.cep)

      return res.render('user/index', { user })

    } catch (error) {
      console.log(error)
    }
  },

  async post(req, res) {
    try {

      let { name, email, password, cpf_cnpj, cep, address } = req.body

      password = await hash(password, 8)
      cpf_cnpj = cpf_cnpj.replace(/\D/g, "")
      cep = cep.replace(/\D/g, "")

      const userId = await User.create({
        name,
        email,
        password,
        cpf_cnpj,
        cep,
        address
      })

      req.session.userId = userId

      return res.redirect('/users')

    } catch (error) {
      console.log(error)
    }
  },

  async update(req, res) {
    try {

      const { user } = req

      let { name, email, cpf_cnpj, cep, address } = req.body

      cpf_cnpj = cpf_cnpj.replace(/\D/g, '')
      cpf_cep = cep.replace(/\D/g, '')

      await User.update(user.id, {
        name,
        email,
        cpf_cnpj,
        cep,
        address
      })

      return res.render('user/index', {
        user: req.body,
        success: 'Conta atualizada com sucesso!'
      })

    } catch (err) {

      console.error(err)
      return res.render('user/index', {
        error: 'Sorry! Algo deu errado...'
      })

    }
  },

  async delete(req, res) {

    try {

      const products = await Product.findAll({ where: { user_id: req.body.id } })

      //Segregar todas imagens dos produtos do usuário
      const allFilesPromise = products.map(product => Product.files(product.id))
      let promiseResults = await Promise.all(allFilesPromise)

      await User.delete(req.body.id)
      req.session.destroy()

      //Remover as imagens da aplicação - public/images
      promiseResults.map(results => {
        results.rows.map(file => {
          try {
            unlinkSync(file.path)
          } catch (err) {
            console.error(err)
          }
        })
      })

      return res.render('session/login', {
        success: 'Conta deletada com sucesso!'
      })

    } catch (err) {

      console.error(err)
      return res.render('users/index', {
        user: req.body,
        error: 'Erro ao tentar deletar sua conta! Tente novamente'
      })

    }
  }

}
