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
  private isRunning = false

  public abstract doRun(): Promise<void>

  public async run(): Promise<void> {
    if (this.isRunning) return
    this.isRunning = true
    await this.doRun()
    this.lastRun = new Date()
    this.isRunning = false
  }

  constructor(options: RunOptions) {
    this.monkeyId = nanoid()
    this.options = options
  }

  public getUserAgent() {
    return `ShopMonkey/0.1 [${this.monkeyType}]: ${this.monkeyId}`
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
}
