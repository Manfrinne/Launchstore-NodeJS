const db = require("../../config/db")
const { hash } = require('bcryptjs')
const Product = require('../models/Product')
const fs = require('fs')

module.exports = {
  async findOne(filters) {
    let query = "SELECT * FROM users"

    Object.keys(filters).map(key => {
     // WHERE | OR => vindo do controllers
     // poderia ser qualquer coisa, um END... p.ex.
      query = `${query}
      ${key}
      `

      Object.keys(filters[key]).map(field => {
        query = `${query} ${field} = '${filters[key][field]}'`
      })

      // SELECT * FROM users
      // where email = usersemaildoreqbody
      // or cpf_cnpj = '11122233344444'
    })

    const results = await db.query(query)
    return results.rows[0]
  },

  async create(data) {
    try {
      const query = `
      INSERT INTO users (
        name,
        email,
        password,
        cpf_cnpj,
        cep,
        address
      ) VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id
    `

    //Hash of password
    const passwordHash = await hash(data.password, 8)

    const values = [
      data.name,
      data.email,
      passwordHash,
      data.cpf_cnpj.replace(/\D/g,""),
      data.cep.replace(/\D/g,""),
      data.address
    ]

    const results = await db.query(query, values)
    return results.rows[0].id

    } catch(err) {
      console.error(err)
    }
  },

  async update(id, fields) {
    let query = "UPDATE users SET"

    Object.keys(fields).map((key, index, array) => {
      if((index + 1) < array.length) {
        query = `${query}
          ${key} = '${fields[key]}',
        `
      } else {
        //Last iteration (without ',')
        query = `${query}
          ${key} = '${fields[key]}'
          WHERE id = ${id}
        `
      }
    })

    await db.query(query)

    return
  },

  async delete(id) {
    //Segregar todos os produtos do usuária
    let results = await db.query(`SELECT * FROM products WHERE user_id = $1`, [id])
    const products = results.rows

    //Segregar todas imagens dos produtos do usuário
    const allFilesPromise = products.map(product => Product.files(product.id))
    let promiseResults = await Promise.all(allFilesPromise)

    //Executar a remoção do usuário, produtos e imagens no db
    await db.query('DELETE FROM users WHERE id = $1', [id])

    //Remover as imagens da aplicação - public/images
    promiseResults.map(results => {
      results.rows.map(file => {
        try {
          fs.unlinkSync(file.path)
        } catch(err) {
          console.error(err)
        }
      })
    })

  }
}
