const { Pool } = require("pg")

module.exports = new Pool({
    user: 'r00t',
    password: "r00t",
    host: "localhost",
    port: 5432,
    database: "launchstoredb"

})
