import express from 'express'
import {default as ProductRouter} from './lib/ProductRouter';

const app = express()
const port = 3000

app.use('products', ProductRouter);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

