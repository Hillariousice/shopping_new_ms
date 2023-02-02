import ShoppingService from '../services/shopping-service';
import express,{Request, Response, NextFunction} from 'express'

export const appEvents = (app:express.Application) => {

    const service = new ShoppingService();

    app.use('/app-events', async(req:Request,res:Response,next:NextFunction)=>{
     
        const {payload} = req.body

        service.SubscribeEvents(payload)

        console.log("========= Shopping service recieved Events===========")
        return res.status(200).json(payload)
    })
}