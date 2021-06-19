import { default as winston } from 'winston'

const logger = winston.createLogger({
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.prettyPrint(),
    winston.format.simple()
    //winston.format.json()
  ),
  transports: [new winston.transports.Console()],
})

export { logger }
