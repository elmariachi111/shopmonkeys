import { Monkey } from '../monkeys/Monkey'
import { default as fetch } from 'node-fetch'

export const API_GATEWAY = 'http://localhost:9090'

export interface CommandRequestPayload {
  params?: Record<string, string>
  body?: Record<string, any>
}
export abstract class Command {
  protected abstract service: string
  protected abstract verb: string
  protected requestPayload?: CommandRequestPayload | undefined

  constructor(protected monkey: Monkey) {}

  abstract execute(params?: any): Promise<any>

  protected async request(
    requestPayload?: CommandRequestPayload
  ): Promise<any> {
    this.requestPayload = requestPayload

    const endpoint = `${API_GATEWAY}${this.service}`
    const res = await fetch(endpoint, {
      method: this.verb,
      body: requestPayload?.body
        ? JSON.stringify(requestPayload.body)
        : undefined,
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': this.monkey.getUserAgent(),
      },
    })
    if (res.status >= 400) {
      const e = await res.text()
      throw Error(`${this.verb}  ${endpoint} failed: ${e}`)
    }
    return res
  }

  asJson() {
    return {
      service: this.service,
      method: this.verb,
      payload: this.requestPayload,
    }
  }
}
