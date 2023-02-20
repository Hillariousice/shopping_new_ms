import { ProductModel } from "../models";
import { APIError, STATUS_CODES } from '../../utils/app-errors';

interface Iproduct {
    name:string
    desc: string,
    banner: string,
    type: string,
    unit: number,
    price: number,
    available: boolean,
    suplier: string
}
//Dealing with data base operations
export class ProductRepository {


    async CreateProduct({ name, desc, type, unit,price, available, suplier, banner }:Iproduct){

        try {
            const product = new ProductModel({
                name, desc, type, unit,price, available, suplier, banner
            })
    
            const productResult = await product.save();
            return productResult;
            
        } catch (err) {
            throw new APIError('API Error', STATUS_CODES.INTERNAL_ERROR, 'Unable to Create Product', true, '', true)
        }
        
    }


     async Products(){
         try{
             return await ProductModel.find();
         }catch(err){
            throw new APIError('API Error', STATUS_CODES.INTERNAL_ERROR, 'Unable to Get Products', true, '', true)
         }
    }
   
    async FindById(id:any){
        try{
            return await ProductModel.findById(id);
        }catch(err){
            throw new APIError('API Error', STATUS_CODES.INTERNAL_ERROR, 'Unable to Find Product',true, '', true)
        }

    }

    async FindByCategory(category:any){

        try{
            const products = await ProductModel.find({ type: category});
             return products;
            
        }catch(err){
            throw new APIError('API Error', STATUS_CODES.INTERNAL_ERROR, 'Unable to Find Category', true, '', true)
        }
    }

    async FindSelectedProducts(selectedIds:any){
        try{
            const products = await ProductModel.find().where('_id').in(selectedIds.map((_id: any) => _id)).exec();
            return products;
        }catch(err){
            throw new APIError('API Error', STATUS_CODES.INTERNAL_ERROR, 'Unable to Find Product', true, '', true)
        }
       
    }
    
}