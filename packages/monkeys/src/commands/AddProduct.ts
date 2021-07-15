import { expect } from 'chai'
import { Product } from '../types/Products'
import { Command } from './Command'

export class AddProduct extends Command {
  protected service = '/products'
  protected verb = 'POST'

  async execute(product: Product) {
    const productCreatedResult = await this.request({
      body: product,
    })

    expect(productCreatedResult.status).to.equal(201)
    return await productCreatedResult.json()
  }
}
