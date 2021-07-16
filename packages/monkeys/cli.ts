#!/usr/bin/env node
import yargs from 'yargs'
import { BrowserMonkey } from './src/monkeys/BrowserMonkey'
import { ProductMonkey } from './src/monkeys/ProductMonkey'

yargs
  .scriptName('smonkey')
  .usage('$0 <cmd> [args]')
  .command(
    'product [amount]',
    'add products',
    (yargs) => {
      yargs.positional('amount', { type: 'number' })
    },
    async (argv) => {
      const monkey = new ProductMonkey({
        interval: 2000,
        amount: (argv.amount || 10) as number,
      })
      setInterval(() => {
        if (monkey.isDue(new Date())) monkey.run()
      }, 5000)
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
      setInterval(() => {
        if (monkey.isDue(new Date())) monkey.run()
      }, 2000)
    }
  )
  .help().argv
