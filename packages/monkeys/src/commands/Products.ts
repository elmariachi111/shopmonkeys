import { expect } from 'chai'
import { Product } from '../types/Products'
import { Command } from './Command'

export class GetAllProducts extends Command {
  protected service = '/products'
  protected verb = 'GET'

  async execute(input?: any): Promise<any> {
    const allProductsResult = await this.request()

    expect(allProductsResult.status).to.equal(200)
    const allProducts = await allProductsResult.json()

    expect(allProducts).to.be.an('array', 'expecting an array as a result')
    return allProducts
  }
}

export class SearchProducts extends GetAllProducts {
  async execute(search: string): Promise<any> {
    this.requestPayload = {
      query: { search },
    }

    return super.execute()
  }
}

export class AddProduct extends Command {
  protected service = '/products'
  protected verb = 'POST'

  async execute(product: Product) {
    this.requestPayload = {
      body: product,
    }
    const productCreatedResult = await this.request()

    expect(productCreatedResult.status).to.equal(201)
    return await productCreatedResult.json()
  }
}
