const Base = require('./Base')

Base.init({ table: 'users' })

module.exports = {
  ...Base,
}





// async create(data) {
//   try {
//     const query = `
//     INSERT INTO users (
//       name,
//       email,
//       password,
//       cpf_cnpj,
//       cep,
//       address
//     ) VALUES ($1, $2, $3, $4, $5, $6)
//     RETURNING id
//   `

//   //Hash of password
//   const passwordHash = await hash(data.password, 8)

//   const values = [
//     data.name,
//     data.email,
//     passwordHash,
//     data.cpf_cnpj.replace(/\D/g,""),
//     data.cep.replace(/\D/g,""),
//     data.address
//   ]

//   const results = await db.query(query, values)
//   return results.rows[0].id

//   } catch(err) {
//     console.error(err)
//   }
// }

// async delete(id) {
//   //Segregar todos os produtos do usuária
//   let results = await db.query(`SELECT * FROM products WHERE user_id = $1`, [id])
//   const products = results.rows

//   //Segregar todas imagens dos produtos do usuário
//   const allFilesPromise = products.map(product => Product.files(product.id))
//   let promiseResults = await Promise.all(allFilesPromise)

//   //Executar a remoção do usuário, produtos e imagens no db
//   await db.query('DELETE FROM users WHERE id = $1', [id])

//   //Remover as imagens da aplicação - public/images
//   promiseResults.map(results => {
//     results.rows.map(file => {
//       try {
//         fs.unlinkSync(file.path)
//       } catch(err) {
//         console.error(err)
//       }
//     })
//   })


