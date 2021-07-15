import { AddProduct } from '../commands/AddProduct'

import { Product } from '../types/Products'
import { Monkey } from './Monkey'
import { default as faker } from 'faker'

export class OfferMonkey extends Monkey {
  protected monkeyType = 'OfferMonkey'

  async run(): Promise<any> {
    const command = new AddProduct(this)
    try {
      const product: Product = {
        title: faker.commerce.productName(),
        sku: faker.random.alphaNumeric(10), //faker.datatype.uuid(),
      }
      const result = await command.execute(product)
      this.log('info', { message: `added product`, result })
    } catch (e) {
      this.log('error', {
        message: e.message,
        ...command.asJson(),
      })
    }
    this.lastRun = new Date()
  }
}
