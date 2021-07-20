'use strict'
const fs = require("fs");
const { MongoClient } = require('mongodb')

const mongoConnection = fs.readFileSync("/var/openfaas/secrets/mongo-connection", {
  encoding: "utf-8"
});

module.exports = async (event, context) => {
  const client = new MongoClient(mongoConnection)

  //const connection = await mysql.createConnection(mysqlConnection);
  
  context.headers({
    'Content-Type': 'application/json'
  })
  
  try {

    await client.connect();
    const db = client.db("monkeys");
    const col = db.collection('products');

    const doc = {
      _id: event.body.sku,
      ...event.body
    };

    await col.updateOne(
      {_id: event.body.sku},
      {$set: doc},
      {upsert: true}
    );

    // const statement = await connection.prepare("REPLACE INTO products (sku, title) VALUES (?, ?);");
    // const [result] = await statement.execute([event.body.sku, event.body.title]);

    await client.close()

    return context.status(201)
      .succeed(doc)
  } catch(e) {
    return context.status(500)
    .fail(e);
  }
  
}

