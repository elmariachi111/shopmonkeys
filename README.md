Never run a changing system

This is a microservice application that is supposed to stay up and working all the time. You're in charge of the microservices it uses.

The platform is constantly visited by monkey agents that react on the system state and its implemented functionality.

Monkeys will

- constantly search for new products to buy
- leave a star rating once they're satisfied with deliveries.
- when they find that some part of the system isn't working, they're decreasing their star rating
- after 5 buying attempts they'll leave a negative rating
- will only buy at a certain price or availability
- retour an item if they find it overpriced.
- not buy products with too many negative ratings.

Your goal is to maximize sales on the platform.

Build the product service

Build a dynamic pricing service that adjusts prices.

Add interesting features to your products
monkeys love filtering - the more product filters they find, the more likely they are to buy something
if monkeys are dissatisfied with prices they might not return to your platform

Build the cart service
Monkeys find it suspicious if their overall cart price changes too frequently

Build the checkout service
Tell monkeys where to send their money to

If you want, you can become a monkey yourself.

###

https://docs.openfaas.com/

### Setup pointers

https://docs.docker.com/registry/

https://docs.openfaas.com/deployment/faasd/
https://docs.openfaas.com/cli

https://ericstoekl.github.io/faas/operations/managing-images/#using-private-docker-registries

```
Running with sufficient permissions to attempt to move faas-cli to /usr/local/bin
New version of faas-cli installed to /usr/local/bin
Creating alias 'faas' for 'faas-cli'.
  ___                   _____           ____
 / _ \ _ __   ___ _ __ |  ___|_ _  __ _/ ___|
| | | | '_ \ / _ \ '_ \| |_ / _` |/ _` \___ \
| |_| | |_) |  __/ | | |  _| (_| | (_| |___) |
 \___/| .__/ \___|_| |_|_|  \__,_|\__,_|____/
      |_|

CLI:
 commit:  72816d486cf76c3089b915dfb0b66b85cf096634
 version: 0.13.13
2021/06/20 10:21:52 Writing to: "/var/lib/faasd/secrets/basic-auth-password"
2021/06/20 10:21:52 Writing to: "/var/lib/faasd/secrets/basic-auth-user"
Check status with:
  sudo journalctl -u faasd --lines 100 -f

Login with:
  sudo cat /var/lib/faasd/secrets/basic-auth-password | faas-cli login -s
Skipping caddy installation as FAASD_DOMAIN.


```
