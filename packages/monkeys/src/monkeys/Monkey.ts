import { nanoid } from 'nanoid'
import { GetAllProducts } from '../commands/GetAllProducts'
import { logger } from '../lib/Logger'

export class Monkey {
  readonly monkeyId
  constructor() {
    this.monkeyId = nanoid()
  }

  public getUserAgent() {
    return `ShopMonkey/0.1 monkey: ${this.monkeyId}`
  }

  async run() {
    try {
      const allProducts = await new GetAllProducts(this).run()
    } catch (e) {
      logger.error(e.message, {
        monkeyId: this.monkeyId,
      })
    }
  }
}
