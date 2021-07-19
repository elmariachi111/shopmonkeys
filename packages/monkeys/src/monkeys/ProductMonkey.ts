import { expect } from 'chai'
import { AddProduct } from '../commands/Products'
import { logger } from '../lib/Logger'
import { Product, ProductEntity } from '../types/Products'
import { Monkey, RunOptions } from './Monkey'

// interface ProductMonkeyState {
//   products: Array<Product & { id?: number | string }>
//   offers: ProductOffer[]
// }

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

  private retryProduct: Product | undefined

  constructor(options: RunOptions & { productMaker: Generator<Product> }) {
    super(options)
  }

  protected async addProduct(product: Product): Promise<void> {
    this.currentCommand = new AddProduct(this)

    const result = await this.currentCommand.execute(product)
    this.currentResult = await result.json()
    if (result.status === 409) {
      this.log('warn', {
        message: `conflict with product sku [${product.sku}]`,
        product: this.currentResult,
      })
    } else {
      expect(this.currentResult).to.include({ sku: product.sku })
      expect(this.currentResult).to.contain.keys(product)

      this.addedProducts.push(this.currentResult)
      this.log('info', {
        message: `added product`,
        product: this.currentResult,
      })
    }
  }

  // protected async addVariant(product: Product) {
  //   const variant: ProductVariant = {
  //     name: faker.commerce.productAdjective,
  //   }
  //   this.currentCommand = new AddVariant({ variant })
  //   this.currentCommand?.execute(product, variant)
  // }

  async doRun(): Promise<boolean> {
    if (this.retryProduct) {
      await this.addProduct(this.retryProduct)
    } else {
      const { value: product, done } = this.options.productMaker.next()
      if (!done) {
        this.retryProduct = product
        await this.addProduct(product)
      } else {
        return true
      }
    }
    this.retryProduct = undefined
    return false
  }
}
