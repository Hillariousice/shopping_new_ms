import { APIError, STATUS_CODES } from "../utils/app-errors";

const { ShoppingRepository } = require("../database");
const { FormateData } = require("../utils");

// All Business logic will be here
class ShoppingService {
    repository: any;

    constructor(){
        this.repository = new ShoppingRepository();
    }
 
    async PlaceOrder(userInput: { _id: any; txnNumber: any; }){

        const { _id, txnNumber } = userInput

        // Verify the txn number with payment logs
        


        
        try {
            const orderResult = await this.repository.CreateNewOrder(_id, txnNumber);
            return FormateData(orderResult);    
        } catch (err) {
            throw new APIError('API Error', STATUS_CODES.INTERNAL_ERROR,'Data Not found',true, '', true)
        }
        
    }

    async GetOrders(customerId: any){
        try {
            const orders = await this.repository.Orders(customerId);
            return FormateData(orders)
        } catch (err) {
            throw new APIError('API Error', STATUS_CODES.INTERNAL_ERROR,'Data Not found',true, '', true)
        }
    }
  
}

export default ShoppingService;