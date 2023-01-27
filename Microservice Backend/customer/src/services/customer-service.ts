import { CustomerRepository } from "../database";
import { FormateData, GeneratePassword, GenerateSalt, GenerateSignature, ValidatePassword } from '../utils';
import { APIError, STATUS_CODES } from '../utils/app-errors';


// All Business logic will be here
class CustomerService {
    repository: any;

    constructor(){
        this.repository = new CustomerRepository();
    }

    async SignIn(userInputs: { email: any; password: any; }){

        const { email, password } = userInputs;
        
        try {
            
            const existingCustomer = await this.repository.FindCustomer({ email});

            if(existingCustomer){
            
                const validPassword = await ValidatePassword(password, existingCustomer.password, existingCustomer.salt);
                
                if(validPassword){
                    const token = await GenerateSignature({ email: existingCustomer.email, _id: existingCustomer._id});
                    return FormateData({id: existingCustomer._id, token });
                } 
            }
    
            return FormateData(null);

        } catch (err) {
            throw new APIError('API Error', STATUS_CODES.INTERNAL_ERROR,'Data Not found',true, '', true)
        }

       
    }

    async SignUp(userInputs: { email: any; password: any; phone: any; }){
        
        const { email, password, phone } = userInputs;
        
        try{
            // create salt
            let salt = await GenerateSalt();
            
            let userPassword = await GeneratePassword(password, salt);
            
            const existingCustomer = await this.repository.CreateCustomer({ email, password: userPassword, phone, salt});
            
            const token = await GenerateSignature({ email: email, _id: existingCustomer._id});

            return FormateData({id: existingCustomer._id, token });

        }catch(err){
            throw new APIError('API Error', STATUS_CODES.INTERNAL_ERROR,'Data Not found',true, '', true)
        }

    }

    async AddNewAddress(_id: any,userInputs: { street: any; postalCode: any; city: any; country: any; }){
        
        const { street, postalCode, city,country} = userInputs;
        
        try {
            const addressResult = await this.repository.CreateAddress({ _id, street, postalCode, city,country})
            return FormateData(addressResult);
            
        } catch (err) {
            throw new APIError('API Error', STATUS_CODES.INTERNAL_ERROR,'Data Not found',true, '', true)
        }
        
    
    }

    async GetProfile(id: any){

        try {
            const existingCustomer = await this.repository.FindCustomerById({id});
            return FormateData(existingCustomer);
            
        } catch (err) {
            throw new APIError('API Error', STATUS_CODES.INTERNAL_ERROR,'Data Not found',true, '', true)
        }
    }

    async GetShopingDetails(id:string){

        try {
            const existingCustomer = await this.repository.FindCustomerById({id});
    
            if(existingCustomer){
               return FormateData(existingCustomer);
            }       
            return FormateData({ msg: 'Error'});
            
        } catch (err) {
            throw new APIError('API Error', STATUS_CODES.INTERNAL_ERROR,'Data Not found',true, '', true)
        }
    }

    async GetWishList(customerId: any){

        try {
            const wishListItems = await this.repository.Wishlist(customerId);
            return FormateData(wishListItems);
        } catch (err) {
            throw new APIError('API Error', STATUS_CODES.INTERNAL_ERROR,'Data Not found',true, '', true)          
        }
    }

    async AddToWishlist(customerId: any, product: any){
        try {
            const wishlistResult = await this.repository.AddWishlistItem(customerId, product);        
           return FormateData(wishlistResult);
    
        } catch (err) {
            throw new APIError('API Error', STATUS_CODES.INTERNAL_ERROR,'Data Not found',true, '', true)
        }
    }

    async ManageCart(customerId: any, product: any, qty: any, isRemove: boolean){
        try {
            const cartResult = await this.repository.AddCartItem(customerId, product, qty, isRemove);        
            return FormateData(cartResult);
        } catch (err) {
            throw new APIError('API Error', STATUS_CODES.INTERNAL_ERROR,'Data Not found',true, '', true)
        }
    }

    async ManageOrder(customerId: any, order: any){
        try {
            const orderResult = await this.repository.AddOrderToProfile(customerId, order);
            return FormateData(orderResult);
        } catch (err) {
            throw new APIError('API Error', STATUS_CODES.INTERNAL_ERROR,'Data Not found',true, '', true)
        }
    }

    async SubscribeEvents(payload: { event: any; data: any; }){
 
        const { event, data } =  payload;

        const { userId, product, order, qty } = data;

        switch(event){
            case 'ADD_TO_WISHLIST':
            case 'REMOVE_FROM_WISHLIST':
                this.AddToWishlist(userId,product)
                break;
            case 'ADD_TO_CART':
                this.ManageCart(userId,product, qty, false);
                break;
            case 'REMOVE_FROM_CART':
                this.ManageCart(userId,product,qty, true);
                break;
            case 'CREATE_ORDER':
                this.ManageOrder(userId,order);
                break;
            default:
                break;
        }
 
    }

}

export default CustomerService;