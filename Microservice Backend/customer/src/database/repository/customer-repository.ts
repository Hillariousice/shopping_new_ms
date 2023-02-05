import { CustomerModel, AddressModel } from '../models';
import { APIError, STATUS_CODES } from '../../utils/app-errors';

interface Icustomer {
    _id:string
    email: string, 
    password: string, 
    phone:string, 
    salt:string, 
}

interface Iproduct{
    _id:any, 
    name:string, 
    desc:string, 
    price:number, 
    available:boolean, 
    banner:string
}

interface Iaddress {
    _id:string, 
    street:string, 
    postalCode:string, 
    city:string, 
    country:string
}
//Dealing with data base operations
export class CustomerRepository {


    async CreateCustomer({ email, password, phone, salt }:Icustomer){
        try{
            const customer = new CustomerModel({
                email,
                password,
                salt,
                phone,
                address: []
            })
            const customerResult = await customer.save();
            return customerResult;
        }catch(err){
            throw new APIError('API Error', STATUS_CODES.INTERNAL_ERROR, 'Unable to Create Customer', true, '', true)
        }
    }
    
    async CreateAddress({ _id, street, postalCode, city, country}:Iaddress){
        
        try{
            const profile = await CustomerModel.findById(_id) as any;
            
            if(profile){
                
                const newAddress = new AddressModel({
                    street,
                    postalCode,
                    city,
                    country
                })
    
                await newAddress.save();
    
                profile.address.push(newAddress);
            }
    
            return await profile.save();

        }catch(err){
            throw new APIError('API Error', STATUS_CODES.INTERNAL_ERROR, 'Error on Create Address', true, '', true)
        }
    }

    async FindCustomer({ email }:{email:string}){
        try{
            const existingCustomer = await CustomerModel.findOne({ email: email });
            return existingCustomer;
        }catch(err){
            throw new APIError('API Error', STATUS_CODES.INTERNAL_ERROR, 'Unable to Find Customer', true, '', true)
        }
    }

    async FindCustomerById({ id }:{id:string}){

        try {
            const existingCustomer = await CustomerModel.findById(id).populate('address')
            return existingCustomer;
        } catch (err) {
            throw new APIError('API Error', STATUS_CODES.INTERNAL_ERROR, 'Unable to Find Customer', true, '', true);
        }
    }

    async Wishlist(customerId:any){
        try{
            const profile:any = await CustomerModel.findById(customerId).populate('wishlist');
           
            return profile.wishlist;
        }catch(err){
            throw new APIError('API Error', STATUS_CODES.INTERNAL_ERROR, 'Unable to Get Wishlist', true, '', true)
        }
    }

    async AddWishlistItem(customerId:string, {_id, name, desc, price, available, banner}:Iproduct){

        const product ={
            _id, 
            name, 
            desc, 
            price, 
            available, 
            banner
        }
        
            const profile:any = await CustomerModel.findById(customerId).populate('wishlist');

           
           
            if(profile){
    
                 let wishlist:any = profile.wishlist;
      
                if(wishlist.length > 0){
                    let isExist = false;
                    wishlist.map((item: any) => {
                        if(item._id.toString() === product._id.toString()){
                           const index = wishlist.indexOf(item);
                           wishlist.splice(index,1);
                           isExist = true;
                        }
                    });
    
                    if(!isExist){
                        wishlist.push(product);
                    }
    
                }else{
                    wishlist.push(product);
                }
                profile.wishlist = wishlist;
            }
    
            const profileResult = await profile.save();      
    
            return profileResult.wishlist;

    }


    async AddCartItem(customerId:any, {_id, name, price, banner}:Iproduct, qty:any, isRemove:any){

        // try{

            const profile = await CustomerModel.findById(customerId).populate('cart');
    
            if(profile){ 
     
                const cartItem = {
                    product:{_id, name, price, banner},
                    unit: qty,
                };
              
                let cartItems:any = profile.cart;
                
                
                if(cartItems.length > 0){
                    let isExist = false;
                     cartItems.map((item:any) => {
                        if(item.product._id.toString() === _id.toString()){
                            if(isRemove){
                                cartItems.splice(cartItems.indexOf(item), 1);
                            }else{
                                item.unit = qty;
                            }
                            isExist = true;
                        }
                    });
    
                    if(!isExist){
                        cartItems.push(cartItem);
                    } 
                }else{
                    cartItems.push(cartItem);
                }
    
                profile.cart = cartItems;
    
                const cartSaveResult = await profile.save();

                return cartSaveResult;
            }
            
            throw new Error('Unable to add to cart!');

        // }catch(err){
        //     throw new APIError('API Error', STATUS_CODES.INTERNAL_ERROR, 'Unable to Create Customer',true, '', true)
        // }

    }

    async AddOrderToProfile(customerId:any, order:any){
 
        try{

            const profile = await CustomerModel.findById(customerId);

            if(profile){ 
                
                if(profile.orders == undefined){
                    profile.orders = []
                }
                profile.orders.push(order);

                profile.cart = [];

                const profileResult = await profile.save();

                return profileResult;
            }
            
            throw new Error('Unable to add to order!');

        }catch(err){
            throw new APIError('API Error', STATUS_CODES.INTERNAL_ERROR, 'Unable to Create Customer',true, '', true)
        }
        
    }

}

