#!/usr/bin/env node

require('dotenv-flow').config()

import { system } from 'faker'
import yargs from 'yargs'
import { logger } from './src/lib/Logger'
import {
  MakeBanana,
  FakeProduct,
  SequentialSKUGenerator,
} from './src/lib/ProductMaker'
import { BrowserMonkey } from './src/monkeys/BrowserMonkey'
import { Monkey } from './src/monkeys/Monkey'
import { OfferMonkey } from './src/monkeys/OfferMonkey'
import { ProductMonkey } from './src/monkeys/ProductMonkey'
import { SquareMonkey } from './src/monkeys/SquareMonkey'

function runInInterval(monkey: Monkey, pingTime = 1000) {
  const intvl = setInterval(async () => {
    if (monkey.isDue(new Date())) {
      const finished = await monkey.run()
      if (finished) {
        clearInterval(intvl)
        logger.end()
      }
    }
  }, pingTime)
}

yargs
  .scriptName('smonkey')
  .usage('$0 <cmd> [args]')
  .command(
    'product [amount]',
    'add products',
    (yargs) => {
      yargs
        .positional('amount', { type: 'number' })
        .option('file', { type: 'string', demandOption: true })
        .option('seed', { type: 'number', alias: 's' })
    },
    async (argv) => {
      const monkey = new ProductMonkey({
        interval: 100,
        productMaker: MakeBanana(
          argv.file as string,
          SequentialSKUGenerator('BAN')
        ),
        amount: (argv.amount || 10) as number,
      })
      await monkey.initialize()
      runInInterval(monkey)
    }
  )
  .command(
    'browse',
    'browse products',
    (yargs) => {},
    (argv) => {
      const monkey = new BrowserMonkey({
        interval: 5000,
      })
      runInInterval(monkey)
    }
  )
  .command(
    'offer',
    'adds offers',
    (yargs) => {
      yargs.option('seed', { type: 'number', alias: 's' })
    },
    async (argv) => {
      const monkey = new OfferMonkey({
        interval: 5000,
        category: 'bananas',
      })
      await monkey.initialize()

      runInInterval(monkey)
    }
  )
  .command(
    'square',
    'squares numbers',
    (yargs) => {
      yargs.option('seed', { type: 'number', alias: 's' })
    },
    async (argv) => {
      const monkey = new SquareMonkey({
        interval: 2000,
      })
      await monkey.initialize()

      runInInterval(monkey)
    }
  )

  .help().argv
