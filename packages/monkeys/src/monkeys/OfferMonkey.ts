import { AddProduct, FilterAttributes } from '../commands/Products'

import {
  Currency,
  Product,
  ProductEntity,
  ProductOffer,
} from '../types/Products'
import { Monkey, RunOptions } from './Monkey'
import { default as faker } from 'faker'
import { expect } from 'chai'
import { logger } from '../lib/Logger'
import { sample } from '../lib/helpers'
import { AddOffer } from '../commands/Offers'

interface OfferMonkeyState {
  products: Array<Product & { id?: number | string }>
  offers: ProductOffer[]
}

enum ProductMonkeyPhase {
  FIND_PRODUCT,
  ADD_OFFER,
}

// public inventOffer(product: Product): ProductOffer {
//   return {
//     product,
//     price: faker.datatype.number(100000),
//     decimals: 2,
//     currency: Currency.EUR,
//   }
// }

/*
ideas
  add product variants
  check whether all my products are still there, if not: readd them
  change / configure sku type
  
  offer monkey: ensure that endpoint keeps monkey id

*/
const BANANA_GROUPS = [
  'AA',
  'AAA',
  'AAAA',
  'AAAB',
  'AAB',
  'AABB',
  'AB',
  'ABB',
  'ABBB',
  'BB',
  'Wild',
]
export class OfferMonkey extends Monkey {
  protected monkeyType = 'OfferMonkey'

  private phase = ProductMonkeyPhase.FIND_PRODUCT

  constructor(options: RunOptions & { amount?: number; category: string }) {
    super(options)
  }

  protected async offerProduct(): Promise<void> {}

  private inventSingleOffer(product: Product): ProductOffer {
    const price = faker.datatype.number(1000)
    const currency = sample(Object.values(Currency))

    const offer: ProductOffer = {
      product,
      price,
      decimals: 2,
      currency,
    }
    return offer
  }

  protected async findRandomProduct(): Promise<Product> {
    this.currentCommand = new FilterAttributes(this)

    const group =
      BANANA_GROUPS[Math.floor(Math.random() * BANANA_GROUPS.length)]

    const result = await this.currentCommand.execute({
      name: 'group',
      value: group,
    })

    this.currentResult = await result.json()
    expect(this.currentResult).to.be.an('array')

    const product: Product =
      this.currentResult[Math.floor(Math.random() * this.currentResult.length)]
    expect(product.attributes).to.deep.include({ name: 'group', value: group })
    return product
  }

  protected async addOffer(offer: ProductOffer): Promise<ProductOffer> {
    this.currentCommand = new AddOffer(this)
    const inserted = await this.currentCommand.execute(offer)
    const insertedOffer = await inserted.json()
    return offer
  }

  async doRun(): Promise<boolean> {
    const product = await this.findRandomProduct()
    const offer = this.inventSingleOffer(product)
    this.addOffer(offer)

    return true
    // switch (this.phase) {
    //   case ProductMonkeyPhase.ADD_PRODUCTS:
    //     await this.offerProduct()
    //     if (this.productsToAdd.length === 0)
    //       this.phase = ProductMonkeyPhase.ADD_VARIANTS
    //     break
    //   case ProductMonkeyPhase.ADD_VARIANTS:
    //     logger.warn('ADD_VARIANTS phase not implemented')
    // }
  }
}
