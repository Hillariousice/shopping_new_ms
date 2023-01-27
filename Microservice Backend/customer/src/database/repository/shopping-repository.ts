import { STATUS_CODES } from "../../utils/app-errors";

import { CustomerModel, ProductModel, OrderModel } from '../models';
import { v4 as uuidv4 } from 'uuid';
import { APIError, BadRequestError } from '../../utils/app-errors';


//Dealing with data base operations
export class ShoppingRepository {

    // payment

    async Orders(customerId:any){
        try{
            const orders = await OrderModel.find({customerId }).populate('items.product');        
            return orders;
        }catch(err){
            throw new APIError('API Error', STATUS_CODES.INTERNAL_ERROR, 'Unable to Find Orders', true, '', true)
        }
    }
 
 
    async CreateNewOrder(customerId:string, txnId: any){

        //check transaction for payment Status
        
        try{
            const profile = await CustomerModel.findById(customerId).populate('cart.product');
    
            if(profile){
                
                let amount = 0;   
    
                let cartItems:any = profile.cart;
    
                if(cartItems.length > 0){
                    //process Order
                    cartItems.map((item: { product: { price: string; }; unit: string; }) => {
                        amount += parseInt(item.product.price) *  parseInt(item.unit);   
                    });
        
                    const orderId = uuidv4();
        
                    const order = new OrderModel({
                        orderId,
                        customerId,
                        amount,
                        txnId,
                        status: 'received',
                        items: cartItems
                    })
        
                    profile.cart = [];
                    
                    order.populate('items.product');
                    const orderResult:any = await order.save();
                   
                    profile.orders.push(orderResult);
    
                    await profile.save();
    
                    return orderResult;
                }
            }
    
          return {}

        }catch(err){
            throw new APIError('API Error', STATUS_CODES.INTERNAL_ERROR, 'Unable to Find Category', true, '', true)
        }
        

    }
}

