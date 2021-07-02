export interface Product {
  title: string
  sku: string | number
  options?: ProductOption[]
}

export interface ProductOption {
  name: string
  value: any
}

export interface ProductOffer {
  product: Product
  price: number
  decimals: number
  currency: Currency
}

export enum Currency {
  EUR = 'EUR',
  USD = 'USD',
  MKY = 'MKY',
  YUA = 'YUA',
}
