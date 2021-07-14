import { Monkey } from '../monkeys/Monkey'
import { default as fetch } from 'node-fetch'

export const API_GATEWAY = 'http://localhost:3000'

export abstract class Command {
  constructor(protected monkey: Monkey) {}

  abstract execute(params?: any): Promise<any>

  protected async request<T>(
    method: string,
    service: string,
    body?: T | undefined
  ): Promise<any> {
    const res = await fetch(`${API_GATEWAY}${service}`, {
      method,
      body: body ? JSON.stringify(body) : undefined,
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': this.monkey.getUserAgent(),
      },
    })
    if (res.status >= 500) {
      const e = await res.text()
      throw Error(`Request to ${service} failed: ${e}`)
    }
    return res
  }
}
