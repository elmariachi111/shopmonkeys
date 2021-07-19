#!/usr/bin/env node
import { system } from 'faker'
import yargs from 'yargs'
import {
  MakeBanana,
  FakeProduct,
  SequentialSKUGenerator,
} from './src/lib/ProductMaker'
import { BrowserMonkey } from './src/monkeys/BrowserMonkey'
import { ProductMonkey } from './src/monkeys/ProductMonkey'

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
        interval: 1000,
        productMaker: MakeBanana(
          argv.file as string,
          SequentialSKUGenerator('BAN')
        ),
        amount: (argv.amount || 10) as number,
      })
      await monkey.initialize()

      const intvl = setInterval(async () => {
        if (monkey.isDue(new Date())) {
          const finished = await monkey.run()
          if (finished) {
            clearInterval(intvl)
            process.exit(0)
          }
        }
      }, 1000)
    }
  )
  .command(
    'browse',
    'browse products',
    (yargs) => {},
    (argv) => {
      const monkey = new BrowserMonkey({
        interval: 2000,
      })
      const intvl = setInterval(async () => {
        if (monkey.isDue(new Date())) {
          const finished = await monkey.run()
          if (finished) {
            clearInterval(intvl)
            process.exit(0)
          }
        }
      }, 2000)
    }
  )
  .help().argv
