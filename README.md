# The Monkey Shop

## aka: Never run a changing system

The monkey shop is a microservice application without an implementation, and besides what the name implies: it's not a shop to buy monkeys, it's a shop that's visited by monkeys - software agents, that unpredictably follow a plan (which you don't know ;) ). A good analogy is actually a pentesting system that loads up your application with unpredictable requests.

There are monkeys calling the defunct endpoints all the time. You can only see the application's log file to get an idea of what the monkeys are about to. Your goal is to write implementations for the endpoints the monkeys are calling, deploy and register them at the API gateway to finally assemble a system that makes all monkeys happy.

We won't spoiler too much details here but monkeys will e.g.

- constantly search for new products to buy
- leave a star rating once they're satisfied with deliveries.
- will watch prices and buy products at a certain price or availability
- when they find that some part of the system isn't working, they're starting to become unhappy until they're leaving a bad rating.
- retour an item if they find it overpriced.
- not buy products with too many negative ratings.

An implicit goal is to maximize sales on the platform.

## The API gateway.

Monkeys will send requests to our API gateway: `https://monkeyshop.coding.earth`. The gateway will proxy all requests fully transparently to the endpoints you write. There's only the `register` endpoint that you'll need on that machine. It'll register your endpoints and start delegating monkey calls to them.

```http
POST https://monkeyshop.coding.earth/register
Content-Type: application/json

{
  "method": "POST", //default: GET
  "route": "/products",
  "target": "https://faasd.coding.earth/function/products"
}
```

## Deployment

you're free to deploy your service endpoints anyway you want (e.g. using your own K8S instance, heroku, ngrok,...) but we've prepared a FaaS environment for you so you don't have to take care of anything.

### About OpenFaas

OpenFaas is a toolchain for functions and docker containers. It allows you to deploy functions that reside in docker containers and run them at scale. You can write functions in any language you like. Functions operate on simple input and output streams but can be invoked using HTTP queries.

https://docs.openfaas.com/

writing functions

https://github.com/openfaas/workshop/blob/master/README.md

### Coding Earth OpenFaasd

We deployed an openfaasd gateway at faasd.coding.earth. It's _not_ based on a K8S deployment but runs in standalone mode (faasd/containerd). It therefore won't scale anything beyond one container, which is okay for demo purposes. You need to authenticate against that gateway to deploy anything.

to avoid repetition, set OPENFAAS_URL=faasd.coding.earth as an environment variable (see `https://github.com/openfaas/faas-cli`).

OpenFaasd comes with a management frontend that allows you to deploy virtually anything: https://faasd.coding.earth/ui/

#### Registry

To be able to deploy functions, their images must be available for the faasd runtime. Therefore we're operating a private docker registry as well: `registry.coding.earth`. You need another basic auth to access that instance.

### simple functions

With Registry and Faasd in place you can start writing functions by cloning templates. Make sure to install the [faas-cli](https://docs.openfaas.com/cli/install/) on your local box. Then you can

- fetch all standard templates:
  `faas template pull`

- list all available templates:
  `faas template store ls`

- create a new function
  `faas new myfunction --lang go`

some demo templates: https://docs.openfaas.com/cli/templates/

### stack files

when you create a new function, it'll create a new "stack" file for you. Stack files can contain more than one function but you can also have one stack file for each of your functions. When you create a new function, the stack file looks similar to this:

```yaml
version: 1.0
provider:
  name: openfaas
  gateway: http://127.0.0.1:8080
functions:
  myfunction:
    lang: go
    handler: ./myfunction
    image: myfunction:latest
```

To deploy that function on our coding.earth registry / faasd, you must adjust the gateway endpoints & image tags, like:

```yaml
version: 1.0
provider:
  name: openfaas
  gateway: https://faasd.coding.earth
functions:
  myfunction:
    lang: go
    handler: ./myfunction
    image: registry.coding.earth/myfunction:latest
```

here's the full reference: https://docs.openfaas.com/reference/yaml/

### build / deploy functions

there's a shortcut command that allows you to build, push, register and activate a function at once: `faas up -f myfunction.yml`

under the hood the `up` command calls `faas build -f myfunction.yml`, `faas push -f myfunction.yml` and `faas deploy -f myfunction.yml`.

### invoke functions on the command line

faas invoke getProducts --gateway=http://registry.local:8080

#### local

you can run the built images as containers on your local machine like so:

docker run --rm -p 8880:8080 registry.coding.earth/products:latest

if you need to connect to a local service from your function you might want to add it to the container's host file:
docker run -p 8090:8080 --add-host registry.local:192.168.122.85 -ti registry.local:5000/getproducts:latest

https://github.com/openfaas/workshop
