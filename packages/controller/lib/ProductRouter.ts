import express from 'express'
import { ProductService, Service } from './ProductService';

export default async function init() {

    const router = express.Router();
const service = await Service();

router.get('/', async (req, res) => {
    const products = service.fetchProducts();
    res.send('products');
})

router.get('/product/:productid', (req, res) => {

})

router.post('/', (req, res) => {

})

    return router;
}
