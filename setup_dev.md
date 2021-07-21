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
```
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

3rd: try it out
```rest
POST https://gateway.coding.earth/reverse
Content-Type: application/json

this will be reversed.
```





 
 
 ### Call one function from another
https://github.com/openfaas/workshop/blob/master/lab4.md#call-one-function-from-another
 
 
 
