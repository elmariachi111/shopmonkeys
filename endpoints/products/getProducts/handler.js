'use strict'
const fs = require("fs");
const mysql = require('mysql2/promise');

  //https://docs.openfaas.com/reference/secrets/
  const mysqlConnection = fs.readFileSync("/var/openfaas/secrets/mysql-connection", {
    encoding: "utf-8"
  });



module.exports = async (event, context) => {

  const knex = require('knex')({
    client: 'mysql2',
    connection: mysqlConnection,
    pool: { min: 1, max: 2 }
  });

  const query = knex.select().from("products").limit(20);
  if (event.query) {
    const { search } = event.query;
    if (search) {
      query.whereRaw("MATCH title AGAINST (?)", search)      
    }
  }
  const rows = await query;
  //const [rows, fields] = await connection.execute("SELECT * FROM products LIMIT 20;");
  knex.destroy();

  return context
    .headers({
      'Content-Type': 'application/json'
    })
    .status(200)
    .succeed(rows)
}
