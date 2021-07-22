import { expect } from 'chai'
import { Command } from '../commands/Command'
import { Monkey } from './Monkey'
import { default as faker } from 'faker'

class SquareCommand extends Command {
  protected service = '/square'
  protected verb = 'POST'

  async execute(num: number) {
    this.requestPayload = {
      body: { num },
    }
    const result = await this.request()

    expect(result.status).to.be.equal(200)
    return result
  }
}

export class SquareMonkey extends Monkey {
  protected monkeyType = 'SquareMonkey'

  async doRun(): Promise<boolean> {
    this.currentCommand = new SquareCommand(this)
    const num = faker.datatype.number({ min: 3, max: 50 })
    let result = await this.currentCommand.execute(num)

    this.currentResult = await result.json()

    expect(this.currentResult).to.be.an('object')
    expect(this.currentResult.result).to.be.equal(num * num)

    this.log('info', {
      message: `successfully calculated  [${num}^2] = [${this.currentResult.result}]`,
    })
    return true
  }
}
