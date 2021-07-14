'use strict'
const fs = require("fs");
const mysql = require('mysql2/promise');

const mysqlConnection = fs.readFileSync("/var/openfaas/secrets/mysql-connection", {
  encoding: "utf-8"
});

module.exports = async (event, context) => {
  
  const connection = await mysql.createConnection(mysqlConnection);
  const statement = await connection.prepare("INSERT INTO products (sku, title) VALUES (?, ?);");
  const [result] = await statement.execute([event.body.sku, event.body.title]);

  const response = {
    result
  }

  return context
    .headers({
      'Content-Type': 'application/json'
    })
    .status(201)
    .succeed(JSON.stringify(response))
}
