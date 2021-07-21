import { default as winston } from 'winston'
import { default as LokiTransport } from 'winston-loki'

//const LOKI_ENDPOINT="http://127.0.0.1:3100";
const LOKI_ENDPOINT = 'http://registry.coding.earth:3100'

const logger = winston.createLogger({
  transports: [
    new winston.transports.Console({
      level: 'debug',
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.prettyPrint(),
        winston.format.simple()
        //winston.format.json()
      ),
    }),
    new LokiTransport({
      format: winston.format.json(),
      host: LOKI_ENDPOINT,
      interval: 1,
      labels: {
        app: 'monkey-runner',
      },
    }),
  ],
})

export { logger }
