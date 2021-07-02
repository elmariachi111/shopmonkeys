import { BuyerMonkey } from './src/monkeys/BuyerMonkey'
import { Monkey } from './src/monkeys/Monkey'
import { OfferMonkey } from './src/monkeys/OfferMonkey'

const main = async () => {
  const monkey = new OfferMonkey()
  monkey.run()
  // const shoppingMonkey = new BuyerMonkey()
  // shoppingMonkey.run()
}

;(async () => {
  await main()
})()
