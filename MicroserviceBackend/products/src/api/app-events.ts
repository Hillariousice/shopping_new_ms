import ProductService from '../services/product-service'
import express,{Request, Response, NextFunction} from 'express'

export const appEvents = (app:express.Application) => {

    const service = new ProductService();

    app.use('/app-events', async(req:Request,res:Response,next:NextFunction)=>{
     
        const {payload} = req.body

        console.log("========= Product service Recieved Events===========")
        return res.status(200).json(payload)
    })
}