import { Monkey } from './src/monkeys/Monkey'

const main = async () => {
  const shoppingMonkey = new Monkey()
  shoppingMonkey.run()
}

;(async () => {
  await main()
})()
