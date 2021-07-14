import { MonkeyRunner } from './src/lib/MonkeyRunner'
import { BuyerMonkey } from './src/monkeys/BuyerMonkey'
import { Monkey } from './src/monkeys/Monkey'
import { OfferMonkey } from './src/monkeys/OfferMonkey'

const main = async () => {
  const monkeyRunner = new MonkeyRunner()

  monkeyRunner
    .add(
      new OfferMonkey({
        interval: 3000,
      })
    )
    .add(
      new BuyerMonkey({
        interval: 5000,
      })
    )

  monkeyRunner.start()
}

;(async () => {
  await main()
})()
