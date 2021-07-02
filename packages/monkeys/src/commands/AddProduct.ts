import { expect } from 'chai'
import { logger } from '../lib/Logger'
import { Product } from '../types/Products'
import { Command } from './Command'

export class AddProduct extends Command {
  async execute(params: Product) {
    const productCreatedResult = await this.request<Product>(
      'POST',
      '/product',
      params
    )

    expect(productCreatedResult.status).to.equal(201)

    logger.info(`added product [${params.sku}]`, {
      monkeyId: this.monkey.monkeyId,
    })
    return productCreatedResult
  }
}
