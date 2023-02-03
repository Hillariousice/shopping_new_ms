import express, {Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { customer,appEvents } from './api';
 import HandleErrors from './utils/error-handler';


export const  expressApp = async (app:express.Application, channel:any) => {

    app.use(express.json({ limit: '1mb'}));
    app.use(express.urlencoded({ extended: true, limit: '1mb'}));
    app.use(cors());
    app.use(express.static(__dirname + '/public'))

    // app.use((req:Request,res:Response,next:NextFunction)=>{
    //  console.log(req)

    //  next()
    // })

    // //Listen to Events 
    // appEvents(app)

    //api
    customer(app,channel);

    // error handling
    app.use(HandleErrors);
    
}