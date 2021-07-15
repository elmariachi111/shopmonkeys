import { expect } from 'chai'
import { Command } from './Command'

export class GetAllProducts extends Command {
  protected service = '/products'
  protected verb = 'GET'

  async execute() {
    const allProductsResult = await this.request()

    expect(allProductsResult.status).to.equal(200)
    const allProducts = await allProductsResult.json()

    expect(allProducts).to.be.an('array', 'expecting an array as a result')
    return allProducts
  }
}
