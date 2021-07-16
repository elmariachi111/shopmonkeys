import { GetAllProducts } from '../commands/GetAllProducts'
import { Monkey } from './Monkey'

export class BrowserMonkey extends Monkey {
  protected monkeyType = 'BrowserMonkey'

  async doRun(): Promise<void> {
    const command = new GetAllProducts(this)
    this.lastRun = new Date()
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
  }
}
