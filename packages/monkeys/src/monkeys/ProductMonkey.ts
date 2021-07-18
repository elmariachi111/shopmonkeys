import { AddProduct } from '../commands/Products'

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

interface OfferMonkeyState {
  products: Array<Product & { id?: number | string }>
  offers: ProductOffer[]
}

enum ProductMonkeyPhase {
  ADD_PRODUCTS,
  ADD_VARIANTS,
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
export class ProductMonkey extends Monkey {
  protected monkeyType = 'ProductMonkey'

  private phase = ProductMonkeyPhase.ADD_PRODUCTS

  private addedProducts: ProductEntity[] = []

  private productsToAdd: Product[] = []

  constructor(options: RunOptions & { amount?: number }) {
    super(options)
    this.inventInitialProducts(options.amount || 10)
  }

  public inventInitialProducts(amount: number) {
    for (let i = amount; i-- > 0; ) {
      const product: Product = {
        title: faker.commerce.productName(),
        sku: faker.datatype.uuid(), //random.alphaNumeric(10),
      }
      this.productsToAdd.push(product)
    }
  }

  protected async addNextProduct(): Promise<void> {
    this.currentCommand = new AddProduct(this)
    const product = this.productsToAdd[0]

    this.currentResult = await this.currentCommand.execute(product)
    expect(this.currentResult).to.include({ sku: product.sku })
    expect(this.currentResult).to.have.any.keys('id')

    this.addedProducts.push(this.currentResult)
    this.log('info', { message: `added product`, product: this.currentResult })

    //todo: use a fix set of products & another one to track added products
    this.productsToAdd.shift()
  }

  async doRun(): Promise<void> {
    switch (this.phase) {
      case ProductMonkeyPhase.ADD_PRODUCTS:
        await this.addNextProduct()
        if (this.productsToAdd.length === 0)
          this.phase = ProductMonkeyPhase.ADD_VARIANTS
        break
      case ProductMonkeyPhase.ADD_VARIANTS:
        logger.warn('ADD_VARIANTS phase not implemented')
    }
  }
}
