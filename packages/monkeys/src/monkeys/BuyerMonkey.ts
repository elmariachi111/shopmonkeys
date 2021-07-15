import { GetAllProducts } from '../commands/GetAllProducts'
import { Monkey } from './Monkey'

export class BuyerMonkey extends Monkey {
  protected monkeyType = 'BuyerMonkey'

  async run() {
    const command = new GetAllProducts(this)
    try {
      const allProducts = await command.execute()

      this.log('info', {
        message: `fetched [${allProducts.length}] products`,
      })
    } catch (e) {
      this.log('error', {
        message: e.message,
        ...command.asJson(),
      })
    }
    this.lastRun = new Date()
  }
}
