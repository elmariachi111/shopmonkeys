'use strict'
const fs = require("fs");
const mysql = require('mysql2/promise');

module.exports = async (event, context) => {

  //https://docs.openfaas.com/reference/secrets/
  const mysqlConnection = fs.readFileSync("/var/openfaas/secrets/mysql-connection", {
    encoding: "utf-8"
  });

  const connection = await mysql.createConnection(mysqlConnection);

  const [rows, fields] = await connection.execute("SELECT * FROM products;");

  return context
    .headers({
      'Content-Type': 'application/json'
    })
    .status(200)
    .succeed(JSON.stringify(rows))
}
