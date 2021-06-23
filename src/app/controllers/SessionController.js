const crypto = require('crypto')
const User = require('../models/User')
const mailer = require('../../lib/mailer')
const { hash } = require('bcryptjs')

module.exports = {

  loginForm(req, res) {
    return res.render('session/login')
  },

  login(req, res) {
    req.session.userId = req.user.id

    return res.redirect('/users')
  },

  logout(req, res) {
    req.session.destroy()
    return res.redirect('/')
  },

  forgotForm(req, res) {
    return res.render('session/forgot-password')
  },

  async forgot(req, res) {
    const user = req.user

    try {

      // criar um token para o usuário
      const token = crypto.randomBytes(20).toString("hex")

      // criar uma expiração - tempo que o token vai valer
      let now = new Date()
      now = now.setHours(now.getHours() + 1)

      await User.update(user.id, {
        reset_token: token,
        reset_token_expires: now
      })

      // enviar um email com um link de recuperação de senha
      await mailer.sendMail({
        to: user.email,
        from: 'no-reply@launchstore.com.br',
        subject: 'Recuperação de Senha',
        html: `<h2>RECUPERAR SENHA LAUNCHSTORE</h2>
          <p>Clique no link abaixo para recuperar sua senha:</p>
          <p>
            <a href="http://localhost:3000/users/password-reset?token=${token}" target="_blank">
              RECUPERAR SENHA!
            </a>
          </p>
        `
      })

      // avisar o usuário que o enviamos o email
      return res.render("session/forgot-password", {
        success: "Verifique seu email para resetar a senha!"
      })

    } catch(err) {

      console.error(err)
      return res.render("session/forgot-password", {
        error: "Algo deu errado, tente novamente!"
      })
    }
  },

  resetForm(req, res) {
    return res.render('session/password-reset', {token: req.query.token})
  },

  async reset(req, res) {
    const user = req.user
    const { password, token } = req.body

    try {
      // criar um novo hash de senha
      const newPassword = await hash(password, 8)

      // atualizar usuário
      await User.update(user.id, {
        password: newPassword,
        reset_token: "",
        reset_token_expires: ""
      })

      // avisar o usuário sobre nova senha
      return res.render('session/login', {
        user: req.body,
        success: "Senha atualizada com sucesso! Faça o login"
      })

    } catch(err) {

      console.error(err)
      return res.render("session/password-reset", {
        user: req.body,
        token,
        error: "Algo deu errado, tente novamente!"
      })

    }
  }
}
