import { expect } from 'chai'
import { logger } from '../lib/Logger'
import { Product } from '../types/Products'
import { Command } from './Command'

export class AddProduct extends Command {
  async execute(params: Product) {
    const productCreatedResult = await this.request<Product>(
      'POST',
      '/products',
      params
    )

    expect(productCreatedResult.status).to.equal(201)
    return await productCreatedResult.json()
  }
}
