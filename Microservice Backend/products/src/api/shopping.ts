import ShoppingService from "../services/shopping-service";
import UserService from '../services/customer-service';
import UserAuth from './middlewares/auth';
import express, {Request, Response, NextFunction} from 'express'

export const shopping = (app:express.Application) => {
    
    const service = new ShoppingService();
    const userService = new UserService();

    app.post('/shopping/order',UserAuth, async (req:Request | any,res:Response,next:NextFunction) => {

        const { _id } = req.user;
        const { txnNumber } = req.body;


        try {
            const { data } = await service.PlaceOrder({_id, txnNumber});
            return res.status(200).json(data);
            
        } catch (err) {
            next(err)
        }

    });

    app.get('/shopping/orders',UserAuth, async (req:Request | any,res:Response,next:NextFunction) => {

        const { _id } = req.user;

        try {
            const { data } = await userService.GetShopingDetails(_id);
            return res.status(200).json(data.orders);
        } catch (err) {
            next(err);
        }

    });
       
    
    app.get('/shopping/cart', UserAuth, async (req:Request | any,res:Response,next:NextFunction) => {

        const { _id } = req.user;
        try {
            const { data } = await userService.GetShopingDetails(_id);
            return res.status(200).json(data.cart);
        } catch (err) {
            next(err);
        }
    });
}