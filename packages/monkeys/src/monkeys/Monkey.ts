import { nanoid } from 'nanoid'
import { logger } from '../lib/Logger'

export interface RunOptions {
  interval: number
}

export abstract class Monkey {
  readonly monkeyId
  readonly options: RunOptions
  public lastRun: Date | undefined
  protected abstract monkeyType: string = 'AbstractMonkey'

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

  protected log(level: string, payload: object) {
    logger.log(level, {
      ...payload,
      type: this.monkeyType,
      monkeyId: this.monkeyId,
    })
  }
  abstract run(): Promise<any>
}
