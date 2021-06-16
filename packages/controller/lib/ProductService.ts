import { default as fetch } from 'node-fetch';

const PRODUCT_API = 'http://localhost:3001'

const DEFAULT_PRODUCT_DEFINITION = {
    name: 'string',
}

const DEFAULT_PRODUCTS = [
    {
        name: '1kg of hot air',
    },
    {
        name: '2l of cold water'
    },
    {
        name: 'a crate of Fritz Mate'
    }];

class ProductService {
    
    private productDefinition = DEFAULT_PRODUCT_DEFINITION;

    constructor() {
        
    }

    async fetchProductDefinition() {
        try {
            await fetch(PRODUCT_API + '/definition');
        } catch (e) {
            console.error("no product definition, using default");
        }
        
    }

    async fetchProducts() {
        let products;
        try {
            products = await fetch(PRODUCT_API);
        } catch (e) {
            products = DEFAULT_PRODUCTS;
        }
        return products;
    }
}

const service = new ProductService();

const Service = async () => {
    
    await service.fetchProductDefinition();
    return service;
}

export {
    ProductService,
    Service,
};