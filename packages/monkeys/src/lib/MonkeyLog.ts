import { Monkey } from '../monkeys/Monkey'

export enum MonkeyLogType {
  INFO,
  ERROR,
}

export class MonkeyLog {
  constructor(
    private monkey: Monkey,
    private type: MonkeyLogType,
    private message: string,
    private originalMessage: string
  ) {}
}
