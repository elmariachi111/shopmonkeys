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
  fixRequestBody,
} from 'http-proxy-middleware'

import { init as DockerRouter } from './lib/DockerRouter'

const validator = new Validator({ allErrors: true })
const validate = validator.validate
const app = express()
const port = 3000

app.use(express.json())

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
      //format: winston.format.combine(winston.format.json()),
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
    const { route, method, target } = req.body
    console.log(method, route, target)

    const middleware = createProxyMiddleware({
      target,
      selfHandleResponse: true,
      changeOrigin: true,
      logProvider: () => logger,
      onProxyReq: fixRequestBody,
      onProxyRes: responseInterceptor(
        async (responseBuffer, proxyRes, req, res) => {
          //const exchange = `[DEBUG] ${req.method} -> ${proxyRes.req.protocol}//${proxyRes.req.host}${proxyRes.req.path} [${proxyRes.statusCode}]`

          if (proxyRes.statusCode && proxyRes.statusCode >= 400) {
            logger.error(responseBuffer.toString('utf8'))
          }
          return responseBuffer
        }
      ),

      onError: (
        err: Error & {
          code: string
        },
        req: Request,
        res: Response
      ) => {
        logger.error('proxy err', err)
        res.status(503).json({
          target,
          error: err.code,
        })
      },
    })
    switch (method) {
      case 'POST':
        app.post(route, middleware)
        break
      default:
        app.get(route, middleware)
    }
    res.json({
      [route]: {
        method: method || 'GET',
        target,
      },
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
