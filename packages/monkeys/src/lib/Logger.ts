import { default as winston } from 'winston'
import { default as LokiTransport } from 'winston-loki'

const logger = winston.createLogger({
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.prettyPrint(),
        winston.format.simple()
        //winston.format.json()
      ),
    }),
    new LokiTransport({
      format: winston.format.json(),
      host: 'http://127.0.0.1:3100',
      interval: 1,
      labels: {
        app: 'monkey-runner',
      },
    }),
  ],
})

export { logger }
