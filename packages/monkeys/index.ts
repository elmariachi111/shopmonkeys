import { MonkeyRunner } from './src/lib/MonkeyRunner'
import { BrowserMonkey } from './src/monkeys/BrowserMonkey'
import { Monkey } from './src/monkeys/Monkey'
import { ProductMonkey } from './src/monkeys/ProductMonkey'

const main = async () => {
  const monkeyRunner = new MonkeyRunner()

  monkeyRunner.add(
    new ProductMonkey({
      interval: 2000,
    })
  )
  // .add(
  //   new BrowserMonkey({
  //     interval: 8000,
  //   })
  // )

  monkeyRunner.start()
}

;(async () => {
  await main()
})()
