import express, { NextFunction, Request, Response } from 'express'
import { default as ProductRouter } from './lib/ProductRouter'
import { Validator } from 'express-json-validator-middleware'
import { JSONSchema7 } from 'json-schema'
import RegisterSchema from './lib/RegisterSchema.json'
const validator = new Validator({ allErrors: true })
const validate = validator.validate

const app = express()
const port = 3000

app.use(express.json())

app.use('products', ProductRouter)

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
      console.log(err)

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
