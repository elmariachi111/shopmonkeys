'use strict'
const fs = require("fs");
const { MongoClient } = require('mongodb')

const mongoConnection = fs.readFileSync("/var/openfaas/secrets/mongo-connection", {
  encoding: "utf-8"
});

module.exports = async (event, context) => {
  const client = new MongoClient(mongoConnection)

  await client.connect();
  const db = client.db("monkeys");
  const col = db.collection('products');

  const criteria = {};

  if (event.query) {

    const { search, attributes, categories } = event.query;
    if (search) {
      criteria["$text"] ={$search: search};
    }
    
    if (categories) {
      criteria['categories'] = categories;
    }

    if (attributes) {
      const [name, value] = attributes.split('=');
      criteria["attributes"] = { name, value }
    }
  }

  console.log(criteria);
  
  const rows = await col.find(criteria).toArray();
  await client.close()
  
  return context
    .headers({
      'Content-Type': 'application/json'
    })
    .status(200)
    .succeed(rows)
}
