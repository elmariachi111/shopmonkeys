mkdir monkeyshop

### Install Faas CLI / docker registry login
(original docs: https://github.com/openfaas/workshop/blob/master/README.md)

 curl -sLSf https://cli.openfaas.com | sudo sh
 
 faas help
 
 docker login https://registry.coding.earth
 monkey:monkey
 
 // replace "stadolf" with your username
 echo 'export OPENFAAS_PREFIX="registry.coding.earth/stadolf"' >> ~/.bashrc
 echo 'export OPENFAAS_URL="https://faasd.coding.earth"' >> ~/.bashrc
 
 faas login -u admin -p eg6Jl1guFEhWXSQUNGQwMhCqDfeX7hEFV6RF4N7s6cI4NqcqfsAGsss6B9nsZNY
 see: https://faasd.coding.earth/ui/
 
 faas ls
 
 faas template pull
 (to see all available templates: `faas template store list`, to get one of them: `faas-cli template store pull node10-express`)
 
 optional php8: `faas pull https://github.com/cod1ng-earth/faas-templates`
 
### Create a new function that reverses a string

faas new reverse --lang php8
 
Handler.php
```php
<?php

namespace App;

class Handler
{
    public function handle($data)
    {
     	return strrev($data);
    }
}
```
take note of the stack file (reverse.yml):
```yml
version: 1.0
provider:
  name: openfaas
  gateway: https://faasd.coding.earth
functions:
  reverse:
    lang: php8
    handler: ./reverse
    image: registry.coding.earth/stadolf/reverse:latest
``` 

#### build & deploy

faas build -f reverse.yml
faas push -f reverse.yml
faas deploy -f reverse.yml

or all in one:

faas up -f reverse.yml

(faas ls)

echo "Banana" | faas invoke reverse

see the function on faasd gateway: https://faasd.coding.earth/

### wire up functions on API gateway

all monkeys send requests towards `https://gateway.coding.earth/`. It's configurable with an UI here: https://kong.coding.earth (monkey:monkey)
We'd like our function to be available on: https://gateway.coding.earth/reverse

It's simpler on the commandline, though:

1st: add the service (the function)
```rest
POST https://gateway.coding.earth/admin-api/services/
Authorization: Basic monkey:monkey
Content-Type: application/json

{
  "name": "reverse",
  "url": "https://faasd.coding.earth/function/reverse"
}
```

2nd: add the route that invokes the function:
```rest
POST https://gateway.coding.earth/admin-api/services/reverse/routes
Authorization: Basic monkey:monkey
Content-Type: application/json

{
  "paths": ["/reverse"],
  "methods": ["POST"],
  "name": "reverse"
}
```

3rd: try it out (note that there's no auth needed!)
```rest
POST https://gateway.coding.earth/reverse
Content-Type: application/json

this will be reversed.
```

### Check incoming monkey traffic

Monkeys issue requests to the gateway. They're reporting all requests and their results to Loki / Grafana:

https://grafana.coding.earth/login
admin:monkey

Explore > Loki > Log Query {app="monkey-runner"}, filter by log level, adjust the filtered timerange
or watch that log dashboard:
https://grafana.coding.earth/d/u-qOmHWnz/monkey-logs?orgId=1

### Connect to databases

Warning: we haven't setup fancy connection pooling or other measures to save our dbs from draining connections. If you're opening a connection, make sure to close it at the end of the function, please.

We've set up 2 databases for you, these are their frontends:

MariaDB
https://mariadb.coding.earth/
server: mariadb
user: monkey
pass: monkey
database: monkeys

MongoDB
https://mongo.coding.earth/
monkey:monkey

#### Access dbs from your code

The connection URLs are only dialable from within the faasd function gateway and not from your computer:

Rather consider to use them as configured secrets, instead (faas secret list). Faas is mounting all secrets a function requires at `/var/openfaas/secrets/` in its container. You can read it as a real file. A function must define the secrets it needs in its configuration:

testdbs.yml
```
version: 1.0
provider:
  name: openfaas
  gateway: https://faasd.coding.earth
functions:
  testdbs:
    lang: node14
    handler: ./testdbs
    image: testmongo:latest
    secrets:
      - mongo-connection
      - mysql-connection
```

here's a node example:

```js
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

  //mongo
  const client = new MongoClient(mongoConnection)
  await client.connect();
  const db = client.db("monkeys");
  const col = await db.collection('products');
  await col.insertOne({foo: "bar"});
  await client.close()
  
  //mysql
  const myc = await mysql.createConnection(mysqlConnection);
  const statement = await myc.prepare("INSERT INTO foo (foo, bar) VALUES (?, ?);");
  const [result] = await statement.execute([2, 3]);
  await myc.end(); 

  return context
    .status(200)
    .succeed(result)
}
```

### Testing a function locally
since functions are simply shipped as docker images you can simply run them on your own machine

`docker run -p "3000:8080" --rm --name reverse registry.coding.earth/stadolf/reverse:latest`
`curl -X POST http://localhost:3000 -d "reverse this"`

### Some more helpful insights & advanced topics

OpenFaaS docs: https://docs.openfaas.com/

The OpenFaaS workshop: https://github.com/openfaas/workshop/

Functions: https://docs.openfaas.com/cli/templates/#create-new-functions

The stack YML reference: https://docs.openfaas.com/reference/yaml/ (multiple functions in one stack

You can run any docker container, actually:
https://docs.openfaas.com/reference/workloads/#running-an-existing-docker-image-on-openfaas

how OpenFaas container setup looks under the hood:
https://github.com/openfaas/of-watchdog

Functions triggered by Kafka are a commercial feature but RabbitMQ, NATS and MQTT are supported:
https://docs.openfaas.com/reference/triggers/#other-event-sources


### ok, I'm done with OpenFaaS, what other options do I have?

ngrok, ftw! https://dashboard.ngrok.com/get-started/setup

Google Cloud Run: 
(it's even compatible to OpenFaaS watchdog based containers: https://www.openfaas.com/blog/openfaas-cloudrun/)
 
 ### Call one function from another
https://github.com/openfaas/workshop/blob/master/lab4.md#call-one-function-from-another
 
 
 
