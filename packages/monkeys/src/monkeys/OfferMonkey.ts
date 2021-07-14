import { AddProduct } from '../commands/AddProduct'
import { logger } from '../lib/Logger'
import { Product } from '../types/Products'
import { Monkey } from './Monkey'
import { default as faker } from 'faker'
export class OfferMonkey extends Monkey {
  async run(): Promise<any> {
    const addProduct = new AddProduct(this)
    try {
      const product: Product = {
        title: faker.commerce.productName(),
        sku: faker.datatype.uuid(),
      }
      const result = await addProduct.execute(product)
    } catch (e) {
      logger.error(e.message, { monkeyId: this.monkeyId })
    }
  }
}
