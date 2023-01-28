import express from 'express';
import cors from 'cors';
import { customer } from './api';
 import HandleErrors from './utils/error-handler';


export const  expressApp = async (app:express.Application) => {

    app.use(express.json({ limit: '1mb'}));
    app.use(express.urlencoded({ extended: true, limit: '1mb'}));
    app.use(cors());
    app.use(express.static(__dirname + '/public'))

    //api
    customer(app);

    // error handling
    app.use(HandleErrors);
    
}