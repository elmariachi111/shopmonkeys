import { Monkey } from '../monkeys/Monkey'
import { Response, default as fetch } from 'node-fetch'

export const API_GATEWAY = process.env.API_GATEWAY // 'https://gateway.coding.earth'

export interface CommandRequestPayload {
  query?: Record<string, string>
  body?: Record<string, any>
}

export abstract class Command {
  protected abstract service: string
  protected abstract verb: string

  protected requestPayload: CommandRequestPayload = {}

  constructor(protected monkey: Monkey) {}

  /**
   * this is domain specific. Clients use their domain
   * objects as parameters and the command translates
   * them to their API representation.
   *
   * @param input any
   * @throws Error
   */
  abstract execute(input?: any): Promise<Response>

  protected buildQuery(): string {
    if (
      this.requestPayload.query &&
      Object.keys(this.requestPayload.query).length > 0
    ) {
      return (
        '?' +
        Object.keys(this.requestPayload.query)
          .map(
            (k) => `${k}=${encodeURIComponent(this.requestPayload.query![k])}`
          )
          .join('&')
      )
    }
    return ''
  }

  protected async request(): Promise<Response> {
    const endpoint = `${API_GATEWAY}${this.service}${this.buildQuery()}`
    const res = await fetch(endpoint, {
      method: this.verb,
      body: this.requestPayload?.body
        ? JSON.stringify(this.requestPayload.body)
        : undefined,
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': this.monkey.getUserAgent(),
      },
    })
    if (res.status >= 400) {
      const e = await res.text()
      throw Error(`${this.verb} ${endpoint} failed: ${e}`)
    }
    return res
  }

  asJson() {
    return {
      service: this.service,
      method: this.verb,
      params: this.requestPayload,
    }
  }
}
