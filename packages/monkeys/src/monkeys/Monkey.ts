import { nanoid } from 'nanoid'

export interface RunOptions {
  interval: number
}

export abstract class Monkey {
  readonly monkeyId
  readonly options: RunOptions
  public lastRun: Date | undefined

  constructor(options: RunOptions) {
    this.monkeyId = nanoid()
    this.options = options
  }

  public getUserAgent() {
    return `ShopMonkey/0.1 monkey: ${this.monkeyId}`
  }

  public isDue(now: Date): boolean {
    if (!this.lastRun) return true
    return now.getTime() - this.lastRun.getTime() > this.options.interval
  }

  abstract run(): Promise<any>
}
