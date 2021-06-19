import { API_GATEWAY, Command } from './Command'
import { default as fetch } from 'node-fetch'
import { expect } from 'chai'
import { Monkey } from '../monkeys/Monkey'
import { logger } from '../lib/Logger'

export class GetAllProducts extends Command {
  constructor(private monkey: Monkey) {
    super()
  }

  async run() {
    const url = `${API_GATEWAY}/products`
    const allProductsResult = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': this.monkey.getUserAgent(),
      },
    })
    expect(allProductsResult.status).to.equal(200)
    const allProducts = await allProductsResult.json()
    expect(allProducts).to.be.an('array', 'expecting an array as a result')
    logger.info(`fetched [${allProducts.length}] products`, {
      monkeyId: this.monkey.monkeyId,
    })
    return allProducts
  }
}
