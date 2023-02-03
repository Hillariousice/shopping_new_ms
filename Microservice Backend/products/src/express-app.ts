import express from 'express';
import cors from 'cors';
import { products, appEvents } from './api';
 import HandleErrors from './utils/error-handler';


export const  expressApp = async (app:express.Application, channel:any) => {

    app.use(express.json({ limit: '1mb'}));
    app.use(express.urlencoded({ extended: true, limit: '1mb'}));
    app.use(cors());
    app.use(express.static(__dirname + '/public'))

    // //Listeners
    // appEvents(app)


    //api
    products(app, channel);

    // error handling
    app.use(HandleErrors);
    
}