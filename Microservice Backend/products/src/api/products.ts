import ProductService from '../services/product-service';
import { PublishMessage } from '../utils';
import UserAuth from './middlewares/auth';
import express, {Request, Response, NextFunction} from 'express'
import { Channel } from 'diagnostics_channel';
import {SHOPPING_BINDING_KEY,CUSTOMER_BINDING_KEY} from '../config'

export const products = (app:express.Application, channel:any) => {
    
    const service = new ProductService();


    app.post('/product/create', async(req:Request | any,res:Response,next:NextFunction) => {
        
        try {
            const { name, desc, type, unit,price, available, suplier, banner } = req.body; 
            // validation
            const { data } =  await service.CreateProduct({ name, desc, type, unit,price, available, suplier, banner });
            return res.json(data);
            
        } catch (err) {
            next(err)    
        }
        
    });

    app.get('/category/:type', async(req:Request | any,res:Response,next:NextFunction) => {
        
        const type = req.params.type;
        
        try {
            const { data } = await service.GetProductsByCategory(type)
            return res.status(200).json(data);

        } catch (err) {
            next(err)
        }

    });

    app.get('/:id', async(req:Request | any,res:Response,next:NextFunction) => {
        
        const productId = req.params.id;

        try {
            const { data } = await service.GetProductDescription(productId);
            return res.status(200).json(data);

        } catch (err) {
            next(err)
        }

    });

    app.post('/ids', async(req:Request | any,res:Response,next:NextFunction) => {

        try {
            const { ids } = req.body;
            const products = await service.GetSelectedProducts(ids);
            return res.status(200).json(products);
            
        } catch (err) {
            next(err)
        }
       
    });
     
    app.put('/wishlist',UserAuth, async (req:Request | any,res:Response,next:NextFunction) => {

        const { _id } = req.user;

        // Get the payload to send to customer service
      
        
        try {
            const {data} = await service.GetProductPayload(_id,{productId:req.body._id, qty:1},'ADD_TO_WISHLIST')
            // console.log(data)
            // PublishedCustomerEvent(data);

            PublishMessage(channel,CUSTOMER_BINDING_KEY, data)
            return res.status(200).json(data.data.product);
        } catch (err) {
            
        }
    });
    
    app.delete('/wishlist/:id',UserAuth, async (req:Request | any,res:Response,next:NextFunction) => {

        const { _id } = req.user;
        const productId = req.params.id;

        try {
            const {data} = await service.GetProductPayload(_id,{productId,qty:1},'REMOVE_FROM_WISHLIST')

            // PublishedCustomerEvent(data)
            PublishMessage(channel,CUSTOMER_BINDING_KEY, data)
            
            return res.status(200).json(data.data.product);
        } catch (err) {
            next(err)
        }
    });


    app.put('/cart',UserAuth, async (req:Request | any,res:Response,next:NextFunction) => {
        
        const { _id } = req.user;
        
        try {     
            const {data} = await service.GetProductPayload(_id,{productId:req.body._id, qty:req.body.qty},'ADD_TO_CART') 
          
            // PublishedCustomerEvent(data)
            // PublishedShoppingEvent(data)

            PublishMessage(channel,CUSTOMER_BINDING_KEY, data)

            PublishMessage(channel,SHOPPING_BINDING_KEY, data)

            const response = {
                product: data.data.product,
                unit: data.data.qty
            }
            return res.status(200).json(response);
            
        } catch (err) {
            next(err)
        }
    });
    
    app.delete('/cart/:id',UserAuth, async (req:Request | any,res:Response,next:NextFunction) => {

        const { _id } = req.user;
        const productId = req.params.id

        try {
            const {data} = await service.GetProductPayload(_id,{productId, qty:req.body.qty},'REMOVE_FROM_CART') 

        //    PublishedCustomerEvent(data);
        //    PublishedShoppingEvent(data)  
        PublishMessage(channel,CUSTOMER_BINDING_KEY, data)
        PublishMessage(channel,SHOPPING_BINDING_KEY, data)

           
           const response = {
            product: data.data.product,
            unit: data.data.qty
        }
            return res.status(200).json(response);
        } catch (err) {
            next(err)
        }
    });

    //get Top products and category
    app.get('/', async (req:Request | any,res:Response,next:NextFunction) => {
        //check validation
        try {
            const { data} = await service.GetProducts();        
            return res.status(200).json(data);
        } catch (err) {
            next(err)
        }
        
    });
    
}