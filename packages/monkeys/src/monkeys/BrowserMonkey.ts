import { expect } from 'chai'
import {
  FilterProducts,
  GetAllProducts,
  SearchProducts,
} from '../commands/Products'
import { Product } from '../types/Products'
import { Monkey } from './Monkey'

export class BrowserMonkey extends Monkey {
  protected monkeyType = 'BrowserMonkey'

  private async findAllProducts() {
    this.currentCommand = new GetAllProducts(this)

    let result = await this.currentCommand.execute()
    this.currentResult = await result.json()
    expect(this.currentResult).to.be.an('array')
    expect(this.currentResult.length).to.be.gt(0)
    expect(this.currentResult.length).to.be.lte(20)

    this.log('info', {
      message: `fetched [${this.currentResult.length}] products`,
    })
  }

  private async searchProducts(searchPhrase: string) {
    this.currentCommand = new SearchProducts(this)
    const result = await this.currentCommand.execute(searchPhrase)
    this.currentResult = await result.json()
    expect(this.currentResult).to.be.an('array')
    const searchResults = this.currentResult.filter(
      (res: Product) => res.title.toLowerCase().indexOf(searchPhrase) !== -1
    )
    expect(searchResults).to.have.length.gt(0)
    expect(searchResults).to.have.length.lte(20)
    this.log('info', {
      message: `found [${this.currentResult.length}] products with [${searchPhrase}]`,
    })
  }

  private async filterCategory(category: string) {
    this.currentCommand = new FilterProducts(this)

    const result = await this.currentCommand.execute({
      filter: 'category',
      value: category,
    })

    this.currentResult = await result.json()
    expect(this.currentResult).to.be.an('array')
    expect(this.currentResult).to.have.length.gt(0)
    expect(this.currentResult).to.have.length.lte(20)

    const bananas = this.currentResult.filter((res: Product) =>
      res.categories?.includes(category)
    )

    expect(
      bananas,
      `failed filtering for category [${category}]`
    ).to.have.length.gt(0)
    this.log('info', {
      message: `found [${this.currentResult.length}] products for [category]=[${category}]`,
    })
  }

  async doRun(): Promise<boolean> {
    await this.findAllProducts()
    await this.searchProducts('lacatan')
    await this.filterCategory('bananas')

    return true
    //todo: searchResult should be shorter than allProducts
    //todo: searchResult should contian bananas.
  }
}
