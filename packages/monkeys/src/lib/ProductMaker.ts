import { default as faker } from 'faker'
import { readFileSync } from 'fs'
import { Product } from '../types/Products'
import { SHA3 } from 'sha3'

type SKUGenerator = (seed: string) => string

export function HashSKUGenerator(): SKUGenerator {
  return (seed: string) => {
    const hash = new SHA3(512)
    return hash.update(seed).digest('base64').substr(0, 10)
  }
}

export function SequentialSKUGenerator(pfx: string, pad = 6): SKUGenerator {
  let cur = 0
  return () => {
    return `${pfx}-${(cur++).toString().padStart(pad, '0')}`
  }
}

export function* MakeBanana(
  bananaFile: string,
  skuGenerator: SKUGenerator
): Generator<Product> {
  const _cultivars = readFileSync(bananaFile, 'utf-8')
  const cultivars: { [group: string]: string[] } = JSON.parse(_cultivars)
  //const groups = Object.keys(cultivars)
  const groups = ['AAAB']

  const allBananas: Product[] = groups.flatMap((g: string) => {
    return cultivars[g].map(
      (b: string): Product => ({
        sku: skuGenerator(b),
        title: b,
        categories: ['bananas'],
        attributes: [{ name: 'group', value: g }],
      })
    )
  })

  for (const banana of allBananas) {
    yield banana
  }
}

export function* FakeProduct(skuGenerator: SKUGenerator): Generator<Product> {
  while (true) {
    const title = faker.commerce.productName()
    yield {
      title,
      sku: skuGenerator(title),
    }
  }
}
