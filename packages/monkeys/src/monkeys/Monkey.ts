import { nanoid } from 'nanoid'

export abstract class Monkey {
  readonly monkeyId
  constructor() {
    this.monkeyId = nanoid()
  }

  public getUserAgent() {
    return `ShopMonkey/0.1 monkey: ${this.monkeyId}`
  }

  abstract run(): Promise<any>
}
