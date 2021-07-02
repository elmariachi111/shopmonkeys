import { GetAllProducts } from '../commands/GetAllProducts'
import { logger } from '../lib/Logger'
import { Monkey } from './Monkey'

export class BuyerMonkey extends Monkey {
  async run() {
    try {
      const allProducts = await new GetAllProducts(this).execute()
    } catch (e) {
      logger.error(e.message, {
        monkeyId: this.monkeyId,
      })
    }
  }
}
