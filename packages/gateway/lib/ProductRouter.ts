import express from 'express'

export default async function init() {
  const router = express.Router()

  router.get('/products', async (req, res) => {
    //const products = service.fetchProducts()
    res.send('products')
  })

  router.get('/product/:productid', (req, res) => {})

  router.post('/', (req, res) => {})

  return router
}
