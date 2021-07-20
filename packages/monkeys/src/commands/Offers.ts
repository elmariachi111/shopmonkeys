import { expect } from 'chai'
import { Response } from 'node-fetch'
import { ProductOffer } from '../types/Products'
import { Command } from './Command'

export class GetAllOffers extends Command {
  protected service = '/offers'
  protected verb = 'GET'

  async execute(input?: any): Promise<Response> {
    const allProductsResult = await this.request()

    expect(allProductsResult.status).to.equal(200)

    return allProductsResult
  }
}

export class GetAllOffersForProduct extends GetAllOffers {
  protected service = '/products/{sku}/offers'

  async execute(productSku: string): Promise<Response> {
    this.service = this.service.replace('sku', productSku)
    return super.execute()
  }
}

export class AddOffer extends Command {
  protected service = '/products/{sku}/offers'
  protected verb = 'POST'

  async execute(offer: ProductOffer) {
    this.requestPayload = {
      body: offer,
    }
    const offerCreatedResult = await this.request()

    expect(offerCreatedResult.status).to.be.oneOf([201, 409])
    return offerCreatedResult
  }
}
