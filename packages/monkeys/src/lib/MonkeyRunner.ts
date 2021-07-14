import { Monkey } from '../monkeys/Monkey'

export class MonkeyRunner {
  private monkeys: Monkey[] = []

  constructor() {}

  add(monkey: Monkey) {
    this.monkeys.push(monkey)
    return this
  }

  start() {
    setInterval(async () => {
      const now = new Date()
      for (const monkey of this.monkeys) {
        if (monkey.isDue(now)) {
          monkey.run()
        }
      }
    }, 2000)
  }
}
