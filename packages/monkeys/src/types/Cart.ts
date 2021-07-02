import { MonkeyId } from './Monkey'
import { ProductOffer } from './Products'

export interface Cart {
  items: CartItem[]
  monkey: MonkeyId
}

export interface CartItem {
  offer: ProductOffer
  createdAt: Date
}
