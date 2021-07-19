import { expect } from 'chai'
import { Product, ProductAttribute } from '../types/Products'
import { Command } from './Command'
import { Response } from 'node-fetch'

export class GetAllProducts extends Command {
  protected service = '/products'
  protected verb = 'GET'

  async execute(input?: any): Promise<Response> {
    const allProductsResult = await this.request()

    expect(allProductsResult.status).to.equal(200)

    return allProductsResult
  }
}

export class SearchProducts extends GetAllProducts {
  async execute(search: string): Promise<Response> {
    this.requestPayload = {
      query: { search },
    }

    return super.execute()
  }
}

export class AddAttribute extends Command {
  protected service = `/products/{id}/variant`
  protected verb = 'POST'

  async execute({
    productId,
    attribute,
  }: {
    productId: string | number
    attribute: ProductAttribute
  }): Promise<Response> {
    this.service = this.service.replace('{id}', productId as string)
    this.requestPayload = {
      body: attribute,
    }

    const variantResult = await this.request()
    expect(variantResult.status).to.equal(200)
    return variantResult
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

    expect(productCreatedResult.status).to.be.oneOf([201, 409])
    return productCreatedResult
  }
}
