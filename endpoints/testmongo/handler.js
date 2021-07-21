'use strict'
const fs = require("fs");
const { MongoClient } = require('mongodb')
const mysql = require('mysql2/promise');

const mongoConnection = fs.readFileSync("/var/openfaas/secrets/mongo-connection", {
  encoding: "utf-8"
})

const mysqlConnection = fs.readFileSync("/var/openfaas/secrets/mysql-connection", {
  encoding: "utf-8"
});

module.exports = async (event, context) => {
  const client = new MongoClient(mongoConnection)
  await client.connect();
  const db = client.db("monkeys");
  const col = await db.collection('products');
  await col.insertOne({foo: "bar"});
  await client.close()
  
  const myc = await mysql.createConnection(mysqlConnection);
  const statement = await myc.prepare("INSERT INTO foo (foo, bar) VALUES (?, ?);");
  const [result] = await statement.execute([2, 3]);
  await myc.end(); 

  return context
    .status(200)
    .succeed(result)
}