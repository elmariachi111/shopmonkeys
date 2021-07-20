import { nanoid } from 'nanoid'
import { Command } from '../commands/Command'
import { logger } from '../lib/Logger'

export interface RunOptions {
  interval: number
  monkeyId?: string
  [key: string]: any
}

export abstract class Monkey {
  readonly monkeyId
  protected abstract monkeyType: string = 'AbstractMonkey'

  readonly options: RunOptions

  protected currentCommand: Command | undefined
  protected currentResult: any | undefined

  public abstract doRun(): Promise<boolean>
  public lastRun: Date | undefined
  private isRunning = false

  private initialized = false

  public async initialize() {
    this.initialized = true
  }

  /**
   * @returns boolean: if true, the monkey has finished its work
   */
  public async run(): Promise<boolean> {
    if (!this.initialized) await this.initialize()

    if (this.isRunning) return false
    this.isRunning = true
    let finished = false

    try {
      finished = await this.doRun()
    } catch (e) {
      //console.error(e)
      this.log('error', {
        message: e.message,
        monkeyType: this.monkeyType,
        request: this.currentCommand?.asJson(),
        result: this.currentResult,
      })
    }
    this.currentCommand = undefined
    this.currentResult = undefined

    this.lastRun = new Date()
    this.isRunning = false
    if (finished) {
      this.log('info', {
        message: 'monkey has finished',
      })
    }
    return finished
  }

  constructor(options: RunOptions) {
    this.monkeyId = options.monkeyId || nanoid()
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
