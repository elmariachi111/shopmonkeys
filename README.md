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

writing functions

https://github.com/openfaas/workshop/blob/master/README.md
