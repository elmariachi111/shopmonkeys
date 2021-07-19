import { expect } from 'chai'
import { GetAllProducts, SearchProducts } from '../commands/Products'
import { Product } from '../types/Products'
import { Monkey } from './Monkey'

export class BrowserMonkey extends Monkey {
  protected monkeyType = 'BrowserMonkey'

  async doRun(): Promise<boolean> {
    this.currentCommand = new GetAllProducts(this)

    let result = await this.currentCommand.execute()
    this.currentResult = await result.json()
    expect(this.currentResult).to.be.an('array')
    expect(this.currentResult.length).to.be.gt(0)
    expect(this.currentResult.length).to.be.lte(20)

    this.log('info', {
      message: `fetched [${this.currentResult.length}] products`,
    })

    const searchPhrase = 'goldfinger'
    this.currentCommand = new SearchProducts(this)
    result = await this.currentCommand.execute(searchPhrase)
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
    return true
    //todo: searchResult should be shorter than allProducts
    //todo: searchResult should contian bananas.
  }
}
