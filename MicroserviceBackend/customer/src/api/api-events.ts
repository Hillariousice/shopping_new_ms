import CustomerService from '../services/customer-service'
import express,{Request, Response, NextFunction} from 'express'

export const appEvents = (app:express.Application) => {

    const service = new CustomerService();

    app.use('/app-events', async(req:Request,res:Response,next:NextFunction)=>{
     
        const {payload} = req.body

        service.SubscribeEvents(payload)

        console.log("========= Customer service recieved Events===========")
        // console.log(payload);
        return res.json(payload)
    })
}