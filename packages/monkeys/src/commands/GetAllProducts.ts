import { expect } from 'chai'
import { logger } from '../lib/Logger'
import { Command } from './Command'

export class GetAllProducts extends Command {
  async execute() {
    const allProductsResult = await this.request('GET', '/products')

    expect(allProductsResult.status).to.equal(200)
    const allProducts = await allProductsResult.json()
    expect(allProducts).to.be.an('array', 'expecting an array as a result')
    logger.info(`fetched [${allProducts.length}] products`, {
      monkeyId: this.monkey.monkeyId,
    })
    return allProducts
  }
}
