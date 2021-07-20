interface Entity {
  id: number | string
}

export interface Product {
  title: string
  sku: string | number
  categories?: string[]
  attributes?: ProductAttribute[]
}

export interface ProductEntity extends Product, Entity {}

export interface ProductAttribute {
  name: string
  value: any
}

export interface ProductOffer {
  product: Product
  variants?: ProductAttribute[]
  price: number
  decimals: number
  currency: Currency
}

export enum Currency {
  EUR = 'EUR',
  USD = 'USD',
}

export enum ExCurrency {
  EUR = 'EUR',
  USD = 'USD',
  MKY = 'MKY',
  YUA = 'YUA',
  ETH = 'ETH',
  BTC = 'BTC',
}
