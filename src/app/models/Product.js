const Base = require('./Base')

Base.init({ table: 'products' })

module.exports = {
  ...Base,

  files(id) {
    return db.query(`SELECT * FROM files WHERE product_id = $1`, [id])
  },

  search(params) {

    const { filter, category } = params

    let query = "", filterQuery = `WHERE`

    if (category) {
      filterQuery = `${filterQuery}
      products.category_id = ${category_id}
      AND
      `
    }

    filterQuery = `
      ${filterQuery}
      products.name ILIKE '%${filter}%'
      OR products.description ILIKE '%${filter}%'
    `

    query = `
      SELECT products.*,
        categories.name AS category_name
      FROM products
      LEFT JOIN categories ON (categories.id = products.category_id)
      ${filterQuery}
    `

    return db.query(query)
  }
}
