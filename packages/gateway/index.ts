import express, { NextFunction, Request, Response } from 'express'
import { Validator } from 'express-json-validator-middleware'
import { JSONSchema7 } from 'json-schema'
import RegisterSchema from './lib/RegisterSchema.json'
import winston from 'winston'
import expressWinston from 'express-winston'
import { default as LokiTransport } from 'winston-loki'
import {
  createProxyMiddleware,
  responseInterceptor,
} from 'http-proxy-middleware'

import { init as DockerRouter } from './lib/DockerRouter'

const validator = new Validator({ allErrors: true })
const validate = validator.validate
const app = express()
const port = 3000

app.use(express.json())

const logger = winston.createLogger({
  transports: [
    new winston.transports.Console(),
    new LokiTransport({
      host: 'http://127.0.0.1:3100',
      interval: 1,
      labels: {
        app: 'api-gateway',
      },
    }),
  ],
  // format: winston.format.combine(
  //   winston.format.colorize(),
  //   //winston.format.prettyPrint(),
  //   winston.format.simple()
  //   //winston.format.json()
  // ),
})

app.use(
  expressWinston.logger({
    winstonInstance: logger,
    meta: true, // optional: control whether you want to log the meta data about the request (default to true)
    //msg: 'HTTP {{req.method}} {{req.url}}', // optional: customize the default logging message. E.g. "{{res.statusCode}} {{req.method}} {{res.responseTime}}ms {{req.url}}"
    expressFormat: true, // Use the default Express/morgan request formatting. Enabling this will override any msg if true. Will only output colors with colorize set to true
    colorize: true, // Color the text and status code, using the Express/morgan color palette (text: gray, status: default green, 3XX cyan, 4XX yellow, 5XX red).
  })
)

app.use('/docker', DockerRouter({ logger }))

app.post(
  '/register',
  validate({
    body: RegisterSchema as JSONSchema7,
  }),
  (req, res) => {
    const { route, target } = req.body
    app.use(
      route,
      createProxyMiddleware({
        target,
        selfHandleResponse: true,
        changeOrigin: true,
        logProvider: () => logger,
        onProxyRes: responseInterceptor(
          async (responseBuffer, proxyRes, req, res) => {
            const response = responseBuffer.toString('utf8')
            if (res.statusCode && res.statusCode >= 400) {
              logger.error(response)
            }
            return response
          }
        ),
        onError: (
          err: Error & {
            code: string
          },
          req: Request,
          res: Response
        ) => {
          logger.error(err)
          res.status(503).json({
            target,
            error: err.code,
          })
        },
      })
    )
    res.json({
      [route]: target,
    })
  }
)

app.use(
  (
    err: Error & { validationErrors: any },
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    if (err.name === 'JsonSchemaValidationError') {
      res.status(400)
      console.error(err)

      return res.json({
        statusText: 'Bad Request',
        jsonSchemaValidation: true,
        validationErrors: err.validationErrors, // All of your validation information
      })
    } else {
      logger.warn('FOOOO')
      // pass error to next error middleware handler
      next(err)
    }
  }
)

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
