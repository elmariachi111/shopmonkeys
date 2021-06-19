import express, { NextFunction, Request, Response } from 'express'
import { default as ProductRouter } from './lib/ProductRouter'
import { Validator } from 'express-json-validator-middleware'
import { JSONSchema7 } from 'json-schema'
import RegisterSchema from './lib/RegisterSchema.json'
const validator = new Validator({ allErrors: true })
const validate = validator.validate
import winston from 'winston'
import expressWinston from 'express-winston'

const app = express()
const port = 3000

app.use(express.json())

app.use(
  expressWinston.logger({
    transports: [new winston.transports.Console()],
    format: winston.format.combine(
      winston.format.colorize(),
      //winston.format.prettyPrint(),
      winston.format.simple()
      //winston.format.json()
    ),
    meta: true, // optional: control whether you want to log the meta data about the request (default to true)
    msg: 'HTTP {{req.method}} {{req.url}}', // optional: customize the default logging message. E.g. "{{res.statusCode}} {{req.method}} {{res.responseTime}}ms {{req.url}}"
    expressFormat: true, // Use the default Express/morgan request formatting. Enabling this will override any msg if true. Will only output colors with colorize set to true
    colorize: true, // Color the text and status code, using the Express/morgan color palette (text: gray, status: default green, 3XX cyan, 4XX yellow, 5XX red).
  })
)

//app.use('products', ProductRouter)

app.post(
  '/register',
  validate({
    body: RegisterSchema as JSONSchema7,
  }),
  (req, res) => {
    const { route, target } = req.body

    res.json({ result: 'ok' })
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
      // pass error to next error middleware handler
      next(err)
    }
  }
)

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
