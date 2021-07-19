'use strict'
const fs = require("fs");
const mysql = require('mysql2/promise');

const mysqlConnection = fs.readFileSync("/var/openfaas/secrets/mysql-connection", {
  encoding: "utf-8"
});

module.exports = async (event, context) => {
  const connection = await mysql.createConnection(mysqlConnection);
  
  context.headers({
    'Content-Type': 'application/json'
  })
  
  try {
    const statement = await connection.prepare("REPLACE INTO products (sku, title) VALUES (?, ?);");
    const [result] = await statement.execute([event.body.sku, event.body.title]);
    connection.end();  

    const res = {
      id: result.insertId,     
      ...event.body,
    }

    return context.status(201)
      .succeed(res)
  } catch(e) {
    return context.status(500)
    .fail(e);
  }
  
}
